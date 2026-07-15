/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

// Extract the isParticleOutOfBounds function
const match = mainJsCode.match(/function isParticleOutOfBounds\([\s\S]*?\n    \}/);

if (!match) {
    throw new Error('Could not find isParticleOutOfBounds function in main.js');
}

const isParticleOutOfBoundsCode = match[0];
const isParticleOutOfBounds = eval(`
    (function() {
        ${isParticleOutOfBoundsCode}
        return isParticleOutOfBounds;
    })()
`);

describe('isParticleOutOfBounds', () => {
    it('should be extracted correctly', () => {
        expect(typeof isParticleOutOfBounds).toBe('function');
    });

    it('should return false if particle is within bounds', () => {
        // Arguments: x, y, width, height, scrollY
        expect(isParticleOutOfBounds(100, 100, 800, 600, 0)).toBe(false);
        expect(isParticleOutOfBounds(0, 0, 800, 600, 0)).toBe(false);
        expect(isParticleOutOfBounds(-50, 700, 800, 600, 0)).toBe(false);
        expect(isParticleOutOfBounds(850, 700, 800, 600, 0)).toBe(false);
    });

    it('should return true if particle is below the bottom bound', () => {
        // y > scrollY + height + 100
        expect(isParticleOutOfBounds(100, 701, 800, 600, 0)).toBe(true);
        expect(isParticleOutOfBounds(100, 801, 800, 600, 100)).toBe(true);
    });

    it('should return true if particle is past the left bound', () => {
        // x < -50
        expect(isParticleOutOfBounds(-51, 100, 800, 600, 0)).toBe(true);
    });

    it('should return true if particle is past the right bound', () => {
        // x > width + 50
        expect(isParticleOutOfBounds(851, 100, 800, 600, 0)).toBe(true);
    });

    it('should intentionally not check the top boundary', () => {
        // The memory notes state it intentionally allows spawning above viewport
        expect(isParticleOutOfBounds(100, -1000, 800, 600, 0)).toBe(false);
    });
});
