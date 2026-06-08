class ParticleAnimation {
    constructor() {
        this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

        if (this.reduceMotion) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePos = { x: 0, y: 0 };
        this.mouseMoveThrottle = this.isSmallScreen ? 600 : 300;
        this.lastMouseMoveTime = 0;
        this.minParticles = this.isSmallScreen ? 12 : 30;
        this.initialParticles = this.isSmallScreen ? 18 : 50;

        this.init();
        this.createInitialParticles();
        this.animate();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.canvas);

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        if (!this.isSmallScreen) {
            window.addEventListener('mousemove', (e) => {
                const currentTime = Date.now();
                if (currentTime - this.lastMouseMoveTime > this.mouseMoveThrottle) {
                    this.mousePos = { x: e.clientX, y: e.clientY };
                    this.createParticleAtMouse();
                    this.lastMouseMoveTime = currentTime;
                }
            });
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createInitialParticles() {
        for (let i = 0; i < this.initialParticles; i++) {
            this.particles.push(this.createParticle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }
    }

    createParticle(x, y) {
        const baseSize = Math.random() * 3 + 1;
        return {
            x,
            y,
            size: baseSize,
            originalSize: baseSize,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 1,
            color: `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`,
            update: function() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.speedY += 0.02;
                this.speedX *= 0.99;
                this.size = this.originalSize * this.life;
                this.life *= 0.99;

                if (this.y > window.innerHeight) {
                    this.speedY = -this.speedY * 0.6;
                    this.y = window.innerHeight;
                }
            }
        };
    }

    createParticleAtMouse() {
        for (let i = 0; i < 2; i++) {
            this.particles.push(this.createParticle(this.mousePos.x, this.mousePos.y));
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(particle => {
            particle.update();
            this.drawParticle(particle);
            return particle.life > 0.01;
        });

        while (this.particles.length < this.minParticles) {
            this.particles.push(this.createParticle(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height
            ));
        }

        this.drawParticleConnections();
        requestAnimationFrame(() => this.animate());
    }

    drawParticleConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(150, 150, 150, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleAnimation();
});
