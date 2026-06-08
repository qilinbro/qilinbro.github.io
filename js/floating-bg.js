class FloatingBackground {
    constructor() {
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

        if (this.reduceMotion || this.isSmallScreen) return;

        this.container = document.createElement('div');
        this.container.className = 'floating-background';
        this.container.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.container);
        this.init();
    }

    init() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-background {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            .floating-shape {
                position: absolute;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
                border-radius: 50%;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .floating-shape.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        `;
        document.head.appendChild(style);

        let lastTime = 0;
        const throttleDelay = 220;

        document.addEventListener('mousemove', (e) => {
            const currentTime = Date.now();
            if (currentTime - lastTime >= throttleDelay) {
                this.createShape(e.clientX, e.clientY);
                lastTime = currentTime;
            }
        });
    }

    createShape(x, y) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';

        const size = Math.random() * 80 + 40;
        const duration = Math.random() * 1800 + 1800;

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;

        this.container.appendChild(shape);

        setTimeout(() => shape.classList.add('visible'), 10);

        setTimeout(() => {
            shape.style.opacity = '0';
            shape.style.transform = 'translate(-50%, -50%) scale(0.5)';
            setTimeout(() => {
                shape.remove();
            }, 800);
        }, duration);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FloatingBackground();
});
