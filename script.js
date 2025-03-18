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
});