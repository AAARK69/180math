/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

describe('isParticleOutOfBounds', () => {
    let isParticleOutOfBounds;

    beforeAll(() => {
        const match = mainJsCode.match(/function isParticleOutOfBounds\(x, y, width, height, scrollY\) \{([\s\S]+?)\n    \}/);
        if (!match) throw new Error("Could not extract isParticleOutOfBounds function");

        isParticleOutOfBounds = new Function('x', 'y', 'width', 'height', 'scrollY', `
            ${match[1]}
        `);
    });

    it('should return false when particle is within bounds', () => {
        expect(isParticleOutOfBounds(100, 100, 1000, 800, 0)).toBe(false);
        expect(isParticleOutOfBounds(0, 100, 1000, 800, 0)).toBe(false);
        expect(isParticleOutOfBounds(-49, 100, 1000, 800, 0)).toBe(false);
    });

    it('should return true when particle is below the bottom boundary (y > scrollY + height + 100)', () => {
        expect(isParticleOutOfBounds(100, 901, 1000, 800, 0)).toBe(true);
        expect(isParticleOutOfBounds(100, 1001, 1000, 800, 100)).toBe(true);
    });

    it('should return true when particle is beyond the left boundary (x < -50)', () => {
        expect(isParticleOutOfBounds(-51, 100, 1000, 800, 0)).toBe(true);
    });

    it('should return true when particle is beyond the right boundary (x > width + 50)', () => {
        expect(isParticleOutOfBounds(1051, 100, 1000, 800, 0)).toBe(true);
    });

    it('should return false when particle is above the viewport (top boundary is intentionally not checked)', () => {
        expect(isParticleOutOfBounds(100, -200, 1000, 800, 0)).toBe(false);
    });

    it('should handle scrollY correctly', () => {
        // scrollY = 500, height = 500. Bottom threshold = 500 + 500 + 100 = 1100
        expect(isParticleOutOfBounds(100, 1000, 1000, 500, 500)).toBe(false);
        expect(isParticleOutOfBounds(100, 1101, 1000, 500, 500)).toBe(true);
    });
});
