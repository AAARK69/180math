const { scramble } = require('../main.js');

describe('scramble function', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should eventually set the element text back to the original text', () => {
        const el = document.createElement('div');
        el.innerText = 'HELLO';
        scramble(el);

        expect(el.dataset.scrambling).toBe('true');

        jest.runAllTimers();

        expect(el.innerText).toBe('HELLO');
        expect(el.dataset.scrambling).toBe('false');
    });

    test('should not run multiple intervals if already scrambling', () => {
        const el = document.createElement('div');
        el.innerText = 'TEST';
        el.dataset.scrambling = 'true';

        // Mock setInterval to check if it gets called
        const spy = jest.spyOn(global, 'setInterval');

        scramble(el);

        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    test('should replace characters with allowed symbols during scrambling', () => {
        const el = document.createElement('div');
        el.innerText = 'WORLD';

        scramble(el);

        // Advance timer by one step (30ms)
        jest.advanceTimersByTime(30);

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∫∑√∆∞≈";
        const textArray = el.innerText.split('');

        textArray.forEach(char => {
            if (char !== 'W' && char !== 'O' && char !== 'R' && char !== 'L' && char !== 'D') {
                expect(letters).toContain(char);
            }
        });

        jest.runAllTimers();
    });

    test('should handle elements using textContent instead of innerText', () => {
        const el = document.createElement('div');
        Object.defineProperty(el, 'innerText', { value: undefined, writable: true });
        el.textContent = 'CONTENT';

        scramble(el);
        jest.runAllTimers();

        expect(el.textContent).toBe('CONTENT');
        expect(el.dataset.scrambling).toBe('false');
    });
});
