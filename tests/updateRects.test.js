/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

describe('window.updateRects', () => {
    let mockCard1, mockCard2;

    beforeAll(() => {
        // Load the script exactly once for this file
        eval(mainJsCode);
    });

    beforeEach(() => {
        // Setup DOM for each test
        document.body.innerHTML = `
            <div class="spotlight-card" id="card1"></div>
            <div class="btn-glow" id="card2"></div>
            <div class="other" id="card3"></div>
            <canvas id="math-physics"></canvas>
        `;

        // Mock getBoundingClientRect
        mockCard1 = document.getElementById('card1');
        mockCard1.getBoundingClientRect = jest.fn(() => ({
            left: 10,
            top: 20,
            width: 100,
            height: 200,
            right: 110,
            bottom: 220
        }));

        mockCard2 = document.getElementById('card2');
        mockCard2.getBoundingClientRect = jest.fn(() => ({
            left: 30,
            top: 40,
            width: 300,
            height: 400,
            right: 330,
            bottom: 440
        }));

        // Reset scroll
        window.scrollY = 0;

        // Mock Observers
        window.IntersectionObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            disconnect: jest.fn()
        }));

        window.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            disconnect: jest.fn()
        }));

        // Canvas context mock
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            clearRect: jest.fn(),
            save: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            scale: jest.fn(),
            drawImage: jest.fn(),
            restore: jest.fn(),
            fillText: jest.fn()
        }));

        // requestAnimationFrame mock
        window.requestAnimationFrame = jest.fn();

        // Trigger DOMContentLoaded
        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(event);
    });

    it('should set window.cards correctly based on DOM query', () => {
        expect(window.cards).toBeDefined();
        expect(window.cards.length).toBe(2);
        expect(window.cards).toContain(mockCard1);
        expect(window.cards).toContain(mockCard2);
    });

    it('should assign _cachedRect to each card when updateRects is called', () => {
        // Clear previous calls and cached state if any
        mockCard1._cachedRect = null;
        mockCard2._cachedRect = null;

        window.updateRects();

        expect(mockCard1.getBoundingClientRect).toHaveBeenCalled();
        expect(mockCard1._cachedRect).toEqual({
            left: 10,
            top: 20,
            width: 100,
            height: 200
        });

        expect(mockCard2.getBoundingClientRect).toHaveBeenCalled();
        expect(mockCard2._cachedRect).toEqual({
            left: 30,
            top: 40,
            width: 300,
            height: 400
        });
    });

    it('should be called automatically when resizeObserver triggers', () => {
        const updateRectsSpy = jest.spyOn(window, 'updateRects');

        // Find the callback passed to ResizeObserver
        const resizeObserverCallback = window.ResizeObserver.mock.calls[0][0];

        // Trigger callback
        resizeObserverCallback();

        expect(updateRectsSpy).toHaveBeenCalled();
        updateRectsSpy.mockRestore();
    });
});
