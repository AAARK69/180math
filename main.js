document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll setting
    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll', window.scrollY + 'px');
    }, { passive: true });

    // 2. Scramble Text Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789∫∑√∆∞≈";
    function scramble(el) {
        let iteration = 0;
        const originalText = el.innerText || el.textContent;
        if (el.dataset.scrambling === "true") return;
        el.dataset.scrambling = "true";

        const interval = setInterval(() => {
            el.innerText = el.innerText.split("").map((letter, index) => {
                if(index < iteration) return originalText[index];
                return letters[Math.floor(Math.random() * letters.length)];
            }).join("");
            if(iteration >= originalText.length) {
                clearInterval(interval);
                el.dataset.scrambling = "false";
            }
            iteration += 1 / 3;
        }, 30);
    }

    // 3. Reveal Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('decipher-text')) {
                    scramble(entry.target);
                    entry.target.classList.remove('decipher-text');
                }
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Cached rects for cards & mouse move
    window.cards = Array.from(document.querySelectorAll(".spotlight-card, .btn-glow"));

    let cachedRects = [];

    window.updateRects = function updateRects() {
        cachedRects = window.cards.map(card => {
            const rect = card.getBoundingClientRect();
            // Cache on element for mousemove
            card._cachedRect = {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            };
            // Return for particles
            return {
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY,
                left: rect.left,
                right: rect.right
            };
        });
    }

    window.resizeObserver = new ResizeObserver(() => {
        window.updateRects();
        if (typeof resizeCanvas === 'function') resizeCanvas();
    });

    window.cards.forEach(card => window.resizeObserver.observe(card));
    window.resizeObserver.observe(document.body);

    window.cards.forEach(card => {
        if(card.classList.contains('spotlight-card')) {
            card.addEventListener('mousemove', e => {
                if (window.innerWidth < 768) return;
                const rect = card._cachedRect;
                if (!rect) return;
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }, { passive: true });
        }
    });

    // 5. Math Snow Engine with Typed Arrays and Object Pooling
    const canvas = document.getElementById('math-physics');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    let width, height;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        updateRects();
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Mouse tracking
    let mouseX = -1000, mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY + window.scrollY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY + window.scrollY;
        }
    }, { passive: true });

    // Typed Arrays (Data-Oriented Design)
    let MAX_PARTICLES = window.innerWidth < 768 ? 75 : 150;
    const PARTICLE_STRIDE = 12;
    const particleData = new Float32Array(MAX_PARTICLES * PARTICLE_STRIDE);
    const symbols = ['∫','∑','√','∆','∞','≈','π','θ','Ω','α','β','γ','λ','μ','ρ','σ','φ','ω', 'x', 'y', '='];

    const symbolCanvas = document.createElement('canvas');
    const symbolCtx = symbolCanvas.getContext('2d');
    const maxSymbolSize = 40;
    symbolCanvas.width = maxSymbolSize * symbols.length;
    symbolCanvas.height = maxSymbolSize;
    symbolCtx.fillStyle = '#E5BE85';
    symbolCtx.textBaseline = 'middle';
    symbolCtx.textAlign = 'center';

    for (let i = 0; i < symbols.length; i++) {
        symbolCtx.font = `${maxSymbolSize * 0.8}px monospace`;
        symbolCtx.fillText(symbols[i], i * maxSymbolSize + maxSymbolSize/2, maxSymbolSize/2);
    }

    function spawnParticle(index, randomY = false) {
        const offset = index * PARTICLE_STRIDE;
        particleData[offset + 0] = Math.random() * width;
        particleData[offset + 1] = randomY ? (window.scrollY + Math.random() * height) : (window.scrollY - 50 - Math.random() * 100);
        particleData[offset + 2] = (Math.random() - 0.5) * 0.5;

        const baseVy = Math.random() * 0.8 + 0.8;
        particleData[offset + 3] = baseVy;
        particleData[offset + 4] = baseVy;

        particleData[offset + 5] = Math.random() * 16 + 14;
        particleData[offset + 6] = Math.random() * Math.PI * 2;
        particleData[offset + 7] = Math.random() * Math.PI * 2;
        particleData[offset + 8] = (Math.random() - 0.5) * 0.02;
        particleData[offset + 9] = 0.5 + Math.random() * 0.3;
        particleData[offset + 10] = 0;
        particleData[offset + 11] = Math.floor(Math.random() * symbols.length);
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
        spawnParticle(i, true);
    }

    function updateParticles() {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            const offset = i * PARTICLE_STRIDE;

            let x = particleData[offset + 0];
            let y = particleData[offset + 1];
            let vx = particleData[offset + 2];
            let vy = particleData[offset + 3];
            let baseVy = particleData[offset + 4];
            let size = particleData[offset + 5];
            let phase = particleData[offset + 6];
            let rot = particleData[offset + 7];
            let rotSpeed = particleData[offset + 8];
            let elasticity = particleData[offset + 9];
            let isBouncing = particleData[offset + 10];

            if (isBouncing === 0) {
                phase += 0.02;
                x += Math.sin(phase) * 0.5 + vx;
                particleData[offset + 6] = phase;
            } else {
                x += vx;
                vy += 0.1;
            }

            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                vx += (dx / dist) * force * 1.5;
                vy += (dy / dist) * force * 0.5;
            }

            vx *= 0.95;
            y += vy;
            rot += rotSpeed;

            let hit = false;
            for (let j = 0; j < cachedRects.length; j++) {
                const rect = cachedRects[j];
                if (x > rect.left && x < rect.right && y + size > rect.top && y < rect.bottom) {
                    if (vy > 0 && y < rect.top + 20) {
                        y = rect.top - size;
                        vy *= -elasticity;
                        vx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
                        isBouncing = 1;
                        hit = true;
                    }
                }
            }

            if (!hit && vy > baseVy) {
                vy *= 0.95;
                if (Math.abs(vy - baseVy) < 0.1) {
                    isBouncing = 0;
                    vy = baseVy;
                }
            }

            if (y > window.scrollY + height + 100 || x < -50 || x > width + 50) {
                spawnParticle(i, false);
            } else {
                particleData[offset + 0] = x;
                particleData[offset + 1] = y;
                particleData[offset + 2] = vx;
                particleData[offset + 3] = vy;
                particleData[offset + 7] = rot;
                particleData[offset + 10] = isBouncing;
            }
        }
    }

    function renderParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < MAX_PARTICLES; i++) {
            const offset = i * PARTICLE_STRIDE;
            const x = particleData[offset + 0];
            const y = particleData[offset + 1];
            const size = particleData[offset + 5];
            const rot = particleData[offset + 7];
            const symbolIndex = particleData[offset + 11];

            ctx.save();
            ctx.translate(x, y - window.scrollY);
            ctx.rotate(rot);

            ctx.globalAlpha = size / 40;
            const scale = size / maxSymbolSize;
            ctx.scale(scale, scale);
            ctx.drawImage(
                symbolCanvas,
                symbolIndex * maxSymbolSize, 0, maxSymbolSize, maxSymbolSize,
                -maxSymbolSize/2, -maxSymbolSize/2, maxSymbolSize, maxSymbolSize
            );

            ctx.restore();
        }
    }

    function animate() {
        updateParticles();
        renderParticles();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
});
