/**
 * @jest-environment node
 */

const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../main.js');
const mainJsCode = fs.readFileSync(mainJsPath, 'utf8');

describe('spawnParticle', () => {
    let spawnParticle;
    let PARTICLE_STRIDE = 12;
    let width = 1000;
    let height = 800;
    let symbols = ['A', 'B', 'C', 'D'];
    let particleData;

    beforeAll(() => {
        const match = mainJsCode.match(/function spawnParticle[^{]+\{([\s\S]+?)\n    \}/);
        if (!match) throw new Error("Could not extract spawnParticle function");

        spawnParticle = new Function('index', 'randomY', 'PARTICLE_STRIDE', 'particleData', 'width', 'height', 'symbols', `
            ${match[1]}
        `);
    });

    beforeEach(() => {
        global.window = { scrollY: 100 };
        particleData = new Float32Array(10 * PARTICLE_STRIDE);
    });

    it('should initialize particle at index correctly when randomY is false', () => {
        const index = 0;
        const offset = index * PARTICLE_STRIDE;

        spawnParticle(index, false, PARTICLE_STRIDE, particleData, width, height, symbols);

        // x coordinate
        expect(particleData[offset + 0]).toBeGreaterThanOrEqual(0);
        expect(particleData[offset + 0]).toBeLessThan(width);

        // y coordinate (randomY = false: window.scrollY - 50 - Math.random() * 100)
        expect(particleData[offset + 1]).toBeLessThanOrEqual(window.scrollY - 50);
        expect(particleData[offset + 1]).toBeGreaterThanOrEqual(window.scrollY - 150);

        // vx
        expect(particleData[offset + 2]).toBeGreaterThanOrEqual(-0.25);
        expect(particleData[offset + 2]).toBeLessThanOrEqual(0.25);

        // vy and baseVy
        const vy = particleData[offset + 3];
        expect(vy).toBeGreaterThanOrEqual(0.8);
        expect(vy).toBeLessThanOrEqual(1.6);
        expect(particleData[offset + 4]).toBe(vy);

        // size
        expect(particleData[offset + 5]).toBeGreaterThanOrEqual(14);
        expect(particleData[offset + 5]).toBeLessThanOrEqual(30);

        // phase
        expect(particleData[offset + 6]).toBeGreaterThanOrEqual(0);
        expect(particleData[offset + 6]).toBeLessThanOrEqual(Math.PI * 2);

        // rot
        expect(particleData[offset + 7]).toBeGreaterThanOrEqual(0);
        expect(particleData[offset + 7]).toBeLessThanOrEqual(Math.PI * 2);

        // rotSpeed
        expect(particleData[offset + 8]).toBeGreaterThanOrEqual(-0.01);
        expect(particleData[offset + 8]).toBeLessThanOrEqual(0.01);

        // elasticity
        expect(particleData[offset + 9]).toBeGreaterThanOrEqual(0.5);
        expect(particleData[offset + 9]).toBeLessThanOrEqual(0.8);

        // isBouncing
        expect(particleData[offset + 10]).toBe(0);

        // symbol index
        expect(particleData[offset + 11]).toBeGreaterThanOrEqual(0);
        expect(particleData[offset + 11]).toBeLessThan(symbols.length);
    });

    it('should initialize particle at index correctly when randomY is true', () => {
        const index = 1;
        const offset = index * PARTICLE_STRIDE;

        spawnParticle(index, true, PARTICLE_STRIDE, particleData, width, height, symbols);

        // y coordinate (randomY = true: window.scrollY + Math.random() * height)
        expect(particleData[offset + 1]).toBeGreaterThanOrEqual(window.scrollY);
        expect(particleData[offset + 1]).toBeLessThanOrEqual(window.scrollY + height);
    });
});
