const { scramble, spawnParticle, updateParticles, PARTICLE_STRIDE } = require('../main');

describe('main.js core functions', () => {
    describe('scramble', () => {
        let el;
        beforeEach(() => {
            el = {
                innerText: 'Test',
                dataset: {}
            };
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should set scrambling dataset to true', () => {
            scramble(el);
            expect(el.dataset.scrambling).toBe('true');
        });

        test('should eventually restore original text', () => {
            const originalText = 'Hello';
            el.innerText = originalText;
            scramble(el);

            // Fast-forward till it's done
            jest.advanceTimersByTime(5000);
            expect(el.innerText).toBe(originalText);
            expect(el.dataset.scrambling).toBe('false');
        });
    });

    describe('spawnParticle', () => {
        let data;
        const width = 1000;
        const height = 800;
        const scrollY = 0;

        beforeEach(() => {
            data = new Float32Array(PARTICLE_STRIDE);
        });

        test('should initialize particle data correctly', () => {
            spawnParticle(data, 0, width, height, scrollY, true);
            expect(data[0]).toBeGreaterThanOrEqual(0);
            expect(data[0]).toBeLessThanOrEqual(width);
            expect(data[1]).toBeGreaterThanOrEqual(0);
            expect(data[1]).toBeLessThanOrEqual(height);
            expect(data[5]).toBeGreaterThanOrEqual(14); // size
            expect(data[5]).toBeLessThanOrEqual(30);
        });
    });

    describe('updateParticles', () => {
        let data;
        const width = 1000;
        const height = 800;
        const scrollY = 0;

        beforeEach(() => {
            data = new Float32Array(PARTICLE_STRIDE);
            spawnParticle(data, 0, width, height, scrollY, true);
        });

        test('should update particle position', () => {
            const initialY = data[1];
            const vy = data[3];
            updateParticles(data, 1, -1000, -1000, scrollY, width, height, []);
            // Use toBeCloseTo with lower precision for Float32Array
            expect(data[1]).toBeCloseTo(initialY + vy, 4);
        });

        test('should respawn particle if out of bounds', () => {
            data[1] = height + 200; // Force out of bounds
            updateParticles(data, 1, -1000, -1000, scrollY, width, height, []);
            expect(data[1]).toBeLessThan(scrollY); // Should have respawned above
        });
    });
});
