// Shared site interactions. Every feature is guarded because this file is reused by multiple pages.
document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const initReveal = () => {
        const revealItems = document.querySelectorAll('[data-reveal]');
        if (!revealItems.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealItems.forEach(item => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

        revealItems.forEach(item => observer.observe(item));
    };

    const initReadingProgress = () => {
        const progress = document.querySelector('.reading-progress');
        const article = document.querySelector('.post-article');
        if (!progress || !article) return;

        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight - window.innerHeight;
            const percent = Math.min(100, Math.max(0, ((scrollTop - articleTop) / articleHeight) * 100));
            progress.style.width = `${Number.isFinite(percent) ? percent : 0}%`;
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);
    };

    const initFilters = () => {
        const chips = document.querySelectorAll('.filter-chip[data-filter]');
        const cards = document.querySelectorAll('.post-card[data-tags]');
        if (!chips.length || !cards.length) return;

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter;
                chips.forEach(item => item.setAttribute('aria-pressed', String(item === chip)));

                cards.forEach(card => {
                    const tags = card.dataset.tags || '';
                    const shouldShow = filter === 'all' || tags.includes(filter);
                    card.hidden = !shouldShow;
                });
            });
        });
    };

    const initCopyButtons = () => {
        const copyButtons = document.querySelectorAll('[data-copy]');
        if (!copyButtons.length) return;

        copyButtons.forEach(button => {
            const originalText = button.textContent;
            button.addEventListener('click', async () => {
                const value = button.dataset.copy;
                if (!value) return;

                try {
                    if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(value);
                    } else {
                        const input = document.createElement('input');
                        input.value = value;
                        document.body.appendChild(input);
                        input.select();
                        document.execCommand('copy');
                        document.body.removeChild(input);
                    }
                    button.textContent = 'Copied ✓';
                } catch (error) {
                    button.textContent = value;
                }

                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            });
        });
    };

    const initProfileZoom = () => {
        const profileContainer = document.querySelector('.profile-image-container');
        if (!profileContainer) return;

        profileContainer.addEventListener('click', () => {
            profileContainer.classList.toggle('zoomed');
        });

        document.addEventListener('click', event => {
            if (!profileContainer.contains(event.target)) {
                profileContainer.classList.remove('zoomed');
            }
        });
    };

    initReveal();
    initReadingProgress();
    initFilters();
    initCopyButtons();
    initProfileZoom();
});
