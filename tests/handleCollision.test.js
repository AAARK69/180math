/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

// Extract the handleCollision function
const handleCollisionRegex = /function handleCollision\([\s\S]*?\n    \}/;
const match = mainJsCode.match(handleCollisionRegex);

if (!match) {
    throw new Error('Could not find handleCollision function in main.js');
}

const handleCollisionCode = match[0];

describe('handleCollision', () => {
    let handleCollision;
    let cachedRects;
    let collisionResult;
    let originalMathRandom;

    beforeAll(() => {
        // Save original Math.random
        originalMathRandom = global.Math.random;
    });

    afterAll(() => {
        // Restore original Math.random
        global.Math.random = originalMathRandom;
    });

    beforeEach(() => {
        // Reset shared state
        cachedRects = [];
        collisionResult = {
            y: 0,
            vx: 0,
            vy: 0,
            isBouncing: 0
        };

        // Reset Math.random in case it was mocked
        if (global.Math.random.mockRestore) {
            global.Math.random.mockRestore();
        } else {
            global.Math.random = originalMathRandom;
        }

        // Create an evaluation context
        const contextCode = `
            ${handleCollisionCode}
            // Return the function so we can call it from the test scope
            handleCollision;
        `;

        // Evaluate the context and capture the function, binding to local state
        // We need to use eval in a way that captures the local cachedRects and collisionResult
        handleCollision = eval(`
            (function(cachedRects, collisionResult) {
                ${handleCollisionCode}
                return handleCollision;
            })
        `)(cachedRects, collisionResult);
    });

    it('should be extracted correctly', () => {
        expect(typeof handleCollision).toBe('function');
    });

    it('should bounce when hitting the top area of a bounding box with positive vy', () => {
        cachedRects.push({ left: 10, right: 110, top: 100, bottom: 200 });

        // Mock Math.random to return known values:
        // First call: 0.6 (>0.5 means positive vx)
        // Second call: 0.5 (vx = 1 * (0.5 * 2 + 1) = 2)
        global.Math.random = jest.fn()
            .mockReturnValueOnce(0.6)
            .mockReturnValueOnce(0.5);

        // Arguments: x, y, vx, vy, size, elasticity, baseVy, isBouncing
        handleCollision(50, 105, 0, 5, 10, 0.8, 1, 0);

        expect(collisionResult.y).toBe(90); // rect.top - size (100 - 10)
        expect(collisionResult.vy).toBe(-4); // 5 * -0.8
        expect(collisionResult.vx).toBe(2);
        expect(collisionResult.isBouncing).toBe(1);

        // Ensure random was called twice for the bounce calculation
        expect(global.Math.random).toHaveBeenCalledTimes(2);
    });

    it('should not bounce if hitting the bounding box below the top 20px threshold', () => {
        cachedRects.push({ left: 10, right: 110, top: 100, bottom: 200 });

        // Hit happens at y = 125, so y < rect.top + 20 is false
        handleCollision(50, 125, 3, 5, 10, 0.8, 1, 0);

        expect(collisionResult.y).toBe(125); // Unchanged
        expect(collisionResult.vx).toBe(3); // Unchanged
        // It didn't "hit" the top so hit remains false, and vy > baseVy (5 > 1), so dampening applies
        expect(collisionResult.vy).toBe(4.75); // 5 * 0.95
        expect(collisionResult.isBouncing).toBe(0); // Unchanged
    });

    it('should not bounce if vy <= 0 (moving upwards)', () => {
        cachedRects.push({ left: 10, right: 110, top: 100, bottom: 200 });

        // Moving upwards (vy = -5)
        handleCollision(50, 105, 3, -5, 10, 0.8, 1, 0);

        // Does not bounce, but vy > baseVy (-5 > 1) is false, so no dampening either
        expect(collisionResult.y).toBe(105);
        expect(collisionResult.vy).toBe(-5);
        expect(collisionResult.vx).toBe(3);
    });

    it('should dampen vy if no collision and vy > baseVy', () => {
        // No rects in cachedRects
        handleCollision(50, 105, 3, 10, 10, 0.8, 2, 1);

        expect(collisionResult.y).toBe(105); // Unchanged
        expect(collisionResult.vx).toBe(3); // Unchanged
        // vy *= 0.95 -> 10 * 0.95 = 9.5
        expect(collisionResult.vy).toBe(9.5);
        // Math.abs(vy - baseVy) = Math.abs(9.5 - 2) = 7.5 > 0.1, so isBouncing remains 1
        expect(collisionResult.isBouncing).toBe(1);
    });

    it('should settle and reset isBouncing when vy is close to baseVy', () => {
        // No rects in cachedRects
        // BaseVy is 2. The code applies dampening first: vy *= 0.95.
        // We need vy such that vy * 0.95 is close to 2 (e.g. diff < 0.1).
        // If vy = 2.05, then 2.05 * 0.95 = 1.9475. Math.abs(1.9475 - 2) = 0.0525 < 0.1.
        handleCollision(50, 105, 3, 2.05, 10, 0.8, 2, 1);

        expect(collisionResult.y).toBe(105);
        expect(collisionResult.vx).toBe(3);

        // Settling condition met: vy becomes baseVy, isBouncing becomes 0
        expect(collisionResult.vy).toBe(2);
        expect(collisionResult.isBouncing).toBe(0);
    });
});
