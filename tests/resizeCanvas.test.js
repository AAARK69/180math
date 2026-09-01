/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

describe('resizeCanvas', () => {
    let mockCanvas;
    let resizeCanvas;
    let testWidth, testHeight;
    let updateRectsCalled = 0;

    beforeEach(() => {
        // Setup mock objects
        mockCanvas = {
            width: 0,
            height: 0
        };

        updateRectsCalled = 0;

        const mockWindow = {
            innerWidth: 1024,
            innerHeight: 768,
        };

        const mockUpdateRects = () => { updateRectsCalled++; };

        // Extract and eval the specific function since it's enclosed in an IIFE
        const match = mainJsCode.match(/function resizeCanvas\(\) \{[\s\S]*?\n\s*\}/);
        if (match) {
            // Provide the context and evaluate
            const codeToEval = `
                (function() {
                    let canvas = mockCanvas;
                    let width, height;
                    let window = mockWindow;
                    let updateRects = mockUpdateRects;
                    ${match[0]}
                    // Return closures to access the let variables
                    return {
                        func: resizeCanvas,
                        getWidth: () => width,
                        getHeight: () => height
                    };
                })()
            `;
            const result = eval(codeToEval);
            resizeCanvas = result.func;
            testWidth = result.getWidth;
            testHeight = result.getHeight;
        } else {
            throw new Error("Could not find resizeCanvas function in main.js");
        }
    });

    it('should update width and height variables', () => {
        resizeCanvas();
        expect(testWidth()).toBe(1024);
        expect(testHeight()).toBe(768);
    });

    it('should update canvas dimensions', () => {
        resizeCanvas();
        expect(mockCanvas.width).toBe(1024);
        expect(mockCanvas.height).toBe(768);
    });

    it('should call updateRects', () => {
        resizeCanvas();
        expect(updateRectsCalled).toBe(1);
    });
});
