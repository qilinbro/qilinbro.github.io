// Shared site interactions. Keep every feature guarded because this file is reused by multiple pages.
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const BASE_URL = 'https://www.loliapi.com/acg/pc/';
    const NUM_IMAGES = 5;
    let currentIndex = 0;
    let imageUrls = [];
    let isTransitioning = false;

    const loadImages = (count) => {
        const urls = [];
        for (let i = 0; i < count; i++) {
            const url = `${BASE_URL}?t=${Date.now() + i}`;
            urls.push(url);
        }
        return urls;
    };

    const setBackground = (imageUrl) => {
        if (isTransitioning || !imageUrl) return;
        isTransitioning = true;

        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.background = `linear-gradient(rgba(175, 63, 63, 0.6), rgba(0, 0, 0, 0.6)), url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.opacity = '1';

            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 300);
    };

    const initBackgrounds = () => {
        const prevBtn = document.getElementById('prevBg');
        const nextBtn = document.getElementById('nextBg');

        if (!prevBtn || !nextBtn || prefersReducedMotion) return;

        imageUrls = loadImages(NUM_IMAGES);
        setBackground(imageUrls[currentIndex]);

        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
            setBackground(imageUrls[currentIndex]);
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = (currentIndex + 1) % imageUrls.length;
            setBackground(imageUrls[currentIndex]);
        });

        setInterval(() => {
            if (!isTransitioning) {
                currentIndex = (currentIndex + 1) % imageUrls.length;
                setBackground(imageUrls[currentIndex]);
            }
        }, 20000);

        setInterval(() => {
            const nextIndex = (currentIndex + 1) % NUM_IMAGES;
            const newUrl = `${BASE_URL}?t=${Date.now()}`;
            const img = new Image();
            img.onload = () => {
                imageUrls[nextIndex] = newUrl;
            };
            img.src = newUrl;
        }, 15000);

        document.addEventListener('keydown', (event) => {
            if (isTransitioning) return;

            if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
                setBackground(imageUrls[currentIndex]);
            } else if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % imageUrls.length;
                setBackground(imageUrls[currentIndex]);
            }
        });
    };

    initBackgrounds();

    const initCursorTrail = () => {
        if (prefersReducedMotion || isTouchDevice) return;

        const trail = [];
        const trailLength = 12;
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;
        let movementTimeout;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.opacity = (1 - i / trailLength).toString();
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${1 - i / trailLength})`;
            document.body.appendChild(dot);
            trail.push({ element: dot, x: mouseX, y: mouseY });
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;

            clearTimeout(movementTimeout);
            movementTimeout = setTimeout(() => {
                isMoving = false;
            }, 100);

            requestAnimationFrame(updateTrail);
        });

        function updateTrail() {
            trail.forEach((dot, index) => {
                if (index === 0) {
                    dot.x = mouseX;
                    dot.y = mouseY;
                } else {
                    dot.x += (trail[index - 1].x - dot.x) * 0.3;
                    dot.y += (trail[index - 1].y - dot.y) * 0.3;
                }

                dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px) scale(${1 - index / trailLength})`;
                dot.element.style.opacity = isMoving ? (1 - index / trailLength).toString() : '0';
            });

            if (isMoving) {
                requestAnimationFrame(updateTrail);
            }
        }
    };

    initCursorTrail();

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transition = prefersReducedMotion ? 'none' : 'opacity 0.5s ease-in-out';
    });

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        sections.forEach(section => sectionObserver.observe(section));
    } else {
        sections.forEach(section => {
            section.style.opacity = '1';
        });
    }

    const profileContainer = document.querySelector('.profile-image-container');
    if (profileContainer) {
        profileContainer.addEventListener('click', () => {
            profileContainer.classList.toggle('zoomed');
        });

        document.addEventListener('click', (e) => {
            if (!profileContainer.contains(e.target) && profileContainer.classList.contains('zoomed')) {
                profileContainer.classList.remove('zoomed');
            }
        });
    }

    const socialLinks = document.querySelectorAll('.social-link[data-tooltip]');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });

    const initCharacter = () => {
        const character = document.querySelector('.cartoon-character');
        const eyes = document.querySelectorAll('.eye');
        const mouth = document.querySelector('.character-mouth');

        if (!character || eyes.length === 0 || !mouth) return;

        let isWinking = false;

        document.addEventListener('mousemove', (e) => {
            eyes.forEach(eye => {
                const rect = eye.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                const rad = Math.atan2(e.pageX - x, e.pageY - y);
                const rot = (rad * (180 / Math.PI) * -1) + 180;
                eye.style.transform = `rotate(${rot}deg)`;
            });
        });

        character.addEventListener('click', () => {
            if (isWinking) return;

            isWinking = true;
            const randomEye = eyes[Math.floor(Math.random() * eyes.length)];
            randomEye.style.height = '2px';
            mouth.style.borderRadius = '20px 20px 0 0';
            mouth.style.borderBottom = 'none';
            mouth.style.borderTop = '4px solid #333';

            setTimeout(() => {
                randomEye.style.height = '20px';
                mouth.style.borderRadius = '0 0 20px 20px';
                mouth.style.borderTop = 'none';
                mouth.style.borderBottom = '4px solid #333';
                isWinking = false;
            }, 300);
        });

        if (!prefersReducedMotion) {
            setInterval(() => {
                if (isWinking) return;

                const randomMove = Math.floor(Math.random() * 3);
                switch (randomMove) {
                    case 0:
                        character.style.transform = 'translateY(-20px)';
                        setTimeout(() => { character.style.transform = 'translateY(0)'; }, 200);
                        break;
                    case 1:
                        character.style.transform = 'rotate(360deg)';
                        setTimeout(() => { character.style.transform = 'rotate(0)'; }, 500);
                        break;
                    case 2:
                        character.style.transform = 'translateX(5px)';
                        setTimeout(() => {
                            character.style.transform = 'translateX(-5px)';
                            setTimeout(() => { character.style.transform = 'translateX(0)'; }, 100);
                        }, 100);
                        break;
                }
            }, 5000);
        }
    };

    initCharacter();
});
