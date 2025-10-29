class FloatingBackground {
    constructor() {
        this.shapes = [];
        this.container = document.createElement('div');
        this.container.className = 'floating-background';
        document.body.appendChild(this.container);
        this.init();
    }

    init() {
        // 添加基础样式
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

        // 监听鼠标移动
        let lastTime = 0;
        const throttleDelay = 150; // 节流延迟

        document.addEventListener('mousemove', (e) => {
            const currentTime = Date.now();
            if (currentTime - lastTime >= throttleDelay) {
                this.createShape(e.clientX, e.clientY);
                lastTime = currentTime;
            }
        });

        // 监听触摸移动
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const currentTime = Date.now();
            if (currentTime - lastTime >= throttleDelay) {
                this.createShape(touch.clientX, touch.clientY);
                lastTime = currentTime;
            }
        }, { passive: true });
    }

    createShape(x, y) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        
        // 随机大小和持续时间
        const size = Math.random() * 100 + 50;
        const duration = Math.random() * 2000 + 2000;
        
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${x}px`;
        shape.style.top = `${y}px`;

        this.container.appendChild(shape);
        
        // 触发重绘以启动动画
        setTimeout(() => shape.classList.add('visible'), 10);

        // 移除元素
        setTimeout(() => {
            shape.style.opacity = '0';
            shape.style.transform = 'translate(-50%, -50%) scale(0.5)';
            setTimeout(() => {
                if (shape.parentNode) {
                    shape.parentNode.removeChild(shape);
                }
            }, 800);
        }, duration);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new FloatingBackground();
});