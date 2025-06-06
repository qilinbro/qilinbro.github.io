// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://www.loliapi.com/acg/pc/';
    const NUM_IMAGES = 5;
    let currentIndex = 0;
    let imageUrls = [];
    let isTransitioning = false;

    // Load multiple images
    const loadImages = async (count) => {
        console.log('Loading initial images...');
        const urls = [];
        for (let i = 0; i < count; i++) {
            const url = `${BASE_URL}?t=${Date.now() + i}`;
            urls.push(url);
        }
        return urls;
    };

    // Update background with transition effect
    const setBackground = (imageUrl) => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imageUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.opacity = '1';
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }, 300);
    };

    // Initialize background system
    const initBackgrounds = async () => {
        try {
            // Load initial set of images
            imageUrls = await loadImages(NUM_IMAGES);
            console.log('Loaded image URLs:', imageUrls);
            
            // Set initial background
            setBackground(imageUrls[currentIndex]);

            // Setup navigation buttons
            const prevBtn = document.getElementById('prevBg');
            const nextBtn = document.getElementById('nextBg');

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

            // Auto-advance timer
            setInterval(() => {
                if (!isTransitioning) {
                    currentIndex = (currentIndex + 1) % imageUrls.length;
                    setBackground(imageUrls[currentIndex]);
                }
            }, 20000);

            // Preload next image
            setInterval(async () => {
                const nextIndex = (currentIndex + 1) % NUM_IMAGES;
                const newUrl = `${BASE_URL}?t=${Date.now()}`;
                const img = new Image();
                img.onload = () => {
                    imageUrls[nextIndex] = newUrl;
                    console.log('Preloaded next image:', newUrl);
                };
                img.src = newUrl;
            }, 15000);

        } catch (error) {
            console.error('Error initializing backgrounds:', error);
        }
    };

    // Initialize background system
    initBackgrounds();

    // Mouse trail effect
    const cursor = document.querySelector('.cursor-trail');
    const trail = [];
    const trailLength = 20;
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let movementTimeout;

    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.opacity = (1 - i / trailLength).toString();
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${1 - i / trailLength})`;
        document.body.appendChild(dot);
        trail.push({
            element: dot,
            x: mouseX,
            y: mouseY
        });
    }

    // Update cursor position
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

    // Update trail positions
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

    // Add fade-in animation to all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.5s ease-in-out';
    });

    // Animate sections when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Add keyboard navigation
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
    // Cartoon character interaction
    const character = document.querySelector('.cartoon-character');
    const eyes = document.querySelectorAll('.eye');
    const mouth = document.querySelector('.character-mouth');
    let isWinking = false;

    // Make eyes follow mouse
    document.addEventListener('mousemove', (e) => {
        eyes.forEach(eye => {
            const rect = eye.getBoundingClientRect();
            const x = (rect.left + rect.width / 2);
            const y = (rect.top + rect.height / 2);
            const rad = Math.atan2(e.pageX - x, e.pageY - y);
            const rot = (rad * (180 / Math.PI) * -1) + 180;
            eye.style.transform = `rotate(${rot}deg)`;
        });
    });

    // Character interactions
    character.addEventListener('click', () => {
        if (!isWinking) {
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
        }
    });

    // Random movements
    setInterval(() => {
        if (!isWinking) {
            const randomMove = Math.floor(Math.random() * 3);
            switch(randomMove) {
                case 0: // Bounce
                    character.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        character.style.transform = 'translateY(0)';
                    }, 200);
                    break;
                case 1: // Spin
                    character.style.transform = 'rotate(360deg)';
                    setTimeout(() => {
                        character.style.transform = 'rotate(0)';
                    }, 500);
                    break;
                case 2: // Shake
                    character.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        character.style.transform = 'translateX(-5px)';
                        setTimeout(() => {
                            character.style.transform = 'translateX(0)';
                        }, 100);
                    }, 100);
                    break;
            }
        }
    }, 5000);
});