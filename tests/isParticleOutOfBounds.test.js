/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

// Extract the isParticleOutOfBounds function
const isParticleOutOfBoundsRegex = /function isParticleOutOfBounds\([\s\S]*?\n    \}/;
const match = mainJsCode.match(isParticleOutOfBoundsRegex);

if (!match) {
    throw new Error('Could not find isParticleOutOfBounds function in main.js');
}

const isParticleOutOfBoundsCode = match[0];

describe('isParticleOutOfBounds', () => {
    let isParticleOutOfBounds;

    beforeEach(() => {
        // Create an evaluation context
        isParticleOutOfBounds = eval(`
            (function() {
                ${isParticleOutOfBoundsCode}
                return isParticleOutOfBounds;
            })
        `)();
    });

    it('should be extracted correctly', () => {
        expect(typeof isParticleOutOfBounds).toBe('function');
    });

    it('should return false when particle is inside bounds', () => {
        // x=500, y=500, width=1000, height=800, scrollY=0
        expect(isParticleOutOfBounds(500, 500, 1000, 800, 0)).toBe(false);
    });

    it('should return false when particle is above top boundary (intentionally allowed)', () => {
        // y=-100, which is above viewport. It should be allowed so particles can fall into view.
        expect(isParticleOutOfBounds(500, -100, 1000, 800, 0)).toBe(false);
    });

    it('should return true when particle is below bottom boundary', () => {
        // y > scrollY + height + 100 -> 0 + 800 + 100 = 900
        expect(isParticleOutOfBounds(500, 901, 1000, 800, 0)).toBe(true);
    });

    it('should return false when particle is exactly on the bottom boundary edge', () => {
        // y = scrollY + height + 100 -> 0 + 800 + 100 = 900
        expect(isParticleOutOfBounds(500, 900, 1000, 800, 0)).toBe(false);
    });

    it('should return true when particle is left of the left boundary', () => {
        // x < -50
        expect(isParticleOutOfBounds(-51, 500, 1000, 800, 0)).toBe(true);
    });

    it('should return false when particle is exactly on the left boundary edge', () => {
        // x = -50
        expect(isParticleOutOfBounds(-50, 500, 1000, 800, 0)).toBe(false);
    });

    it('should return true when particle is right of the right boundary', () => {
        // x > width + 50 -> 1000 + 50 = 1050
        expect(isParticleOutOfBounds(1051, 500, 1000, 800, 0)).toBe(true);
    });

    it('should return false when particle is exactly on the right boundary edge', () => {
        // x = width + 50 -> 1000 + 50 = 1050
        expect(isParticleOutOfBounds(1050, 500, 1000, 800, 0)).toBe(false);
    });

    it('should work correctly with scrollY', () => {
        // y > scrollY + height + 100 -> 500 + 800 + 100 = 1400
        expect(isParticleOutOfBounds(500, 1401, 1000, 800, 500)).toBe(true);
        expect(isParticleOutOfBounds(500, 1400, 1000, 800, 500)).toBe(false);
    });
});
