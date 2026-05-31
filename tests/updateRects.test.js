/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

const updateRectsMatch = mainJsCode.match(/function updateRects\(\) \{[\s\S]*?\n    \}/);
if (!updateRectsMatch) throw new Error('Could not find updateRects');
const updateRectsCode = updateRectsMatch[0];

describe('updateRects', () => {
    let mockCard1, mockCard2;
    let cards;
    let updateRects;

    beforeEach(() => {
        cards = [];
        mockCard1 = {
            getBoundingClientRect: jest.fn(() => ({ left: 10, top: 20, width: 100, height: 200, right: 110, bottom: 220 }))
        };
        mockCard2 = {
            getBoundingClientRect: jest.fn(() => ({ left: 300, top: 400, width: 50, height: 50, right: 350, bottom: 450 }))
        };
        cards.push(mockCard1, mockCard2);

        global.window = { scrollY: 100 };
        // Create a local function out of the string

        eval(updateRectsCode.replace('function updateRects()', 'updateRects = function()'));

    });

    it('should assign _cachedRect to each card', () => {
        updateRects();
        expect(mockCard1._cachedRect).toBeDefined();
        expect(mockCard2._cachedRect).toBeDefined();
    });
});
