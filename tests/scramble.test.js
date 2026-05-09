/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

describe('scramble function', () => {
    let scrambleFn;
    let mockEl;

    beforeAll(() => {
        // Extract the scramble function code
        // We match from 'const letters = ' to the closing brace of the scramble function
        const match = mainJsCode.match(/const letters = "[^"]+";[\s\S]*?function scramble\(el\) \{[\s\S]*?clearInterval\(interval\);\s*el\.dataset\.scrambling = "false";\s*\}\s*iteration \+= 1 \/ 3;\s*\}, 30\);\s*\}/);

        if (!match) {
            throw new Error("Could not extract scramble function from main.js");
        }

        // Expose it by wrapping in a function that returns the scramble function
        const wrapper = new Function(`
            ${match[0]}
            return scramble;
        `);
        scrambleFn = wrapper();
    });

    beforeEach(() => {
        jest.useFakeTimers();
        mockEl = document.createElement('div');
        mockEl.innerText = 'TEST';
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should set dataset.scrambling to "true" immediately', () => {
        scrambleFn(mockEl);
        expect(mockEl.dataset.scrambling).toBe("true");
    });

    it('should return immediately if dataset.scrambling is already "true"', () => {
        mockEl.dataset.scrambling = "true";
        mockEl.innerText = "INITIAL";
        scrambleFn(mockEl);

        // Advance timers to make sure no scrambling happens
        jest.advanceTimersByTime(100);

        // It shouldn't change
        expect(mockEl.innerText).toBe("INITIAL");
    });

    it('should gradually reveal the original text over time', () => {
        const originalText = "TEST";
        mockEl.innerText = originalText;
        scrambleFn(mockEl);

        // At start, text length should be preserved
        jest.advanceTimersByTime(30);
        expect(mockEl.innerText.length).toBe(originalText.length);

        // Some characters might be scrambled.
        // It takes iteration to reach originalText.length.
        // Iteration increases by 1/3 every 30ms.
        // To reach iteration = 4, it takes 4 / (1/3) = 12 steps = 12 * 30ms = 360ms.

        // Advance enough to be halfway through
        jest.advanceTimersByTime(150);

        // At iteration = 180 / 30 * (1/3) = 6 * 1/3 = 2,
        // the first 2 characters should match the original text.
        expect(mockEl.innerText.substring(0, 2)).toBe("TE");

        // The remaining characters might be scrambled, but at least the first two are fixed.
    });

    it('should clear interval and set dataset.scrambling to "false" when finished', () => {
        const originalText = "TEST";
        mockEl.innerText = originalText;
        scrambleFn(mockEl);

        // iteration increases by 1/3 every 30ms.
        // For text length 4, it needs 4 / (1/3) = 12 intervals.
        // 12 * 30 = 360ms. Let's advance by 400ms to be safe.
        jest.advanceTimersByTime(400);

        expect(mockEl.innerText).toBe(originalText);
        expect(mockEl.dataset.scrambling).toBe("false");
    });
});
