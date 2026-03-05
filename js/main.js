/* ============================================================
   ADIFAL — Main JavaScript
   Scroll effects, mobile menu, form handling, animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // === MOBILE MENU TOGGLE ===
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 10;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // === SCROLL REVEAL ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.about-card, .feature-card, .contact-card, .download-card, .about-meaning, .screenshot-frame'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // === ACTIVE NAV LINK HIGHLIGHT ===
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    link.style.color = '#2E5935';
                    link.style.fontWeight = '700';
                } else {
                    link.style.color = '';
                    link.style.fontWeight = '';
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // === CONTACT FORM HANDLING ===
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Create mailto link as fallback (no backend)
            const subject = encodeURIComponent(`[ADIFAL Web] ${data.assunto} - ${data.nome}`);
            const body = encodeURIComponent(
                `Nome: ${data.nome}\nEmail: ${data.email}\nAssunto: ${data.assunto}\n\nMensagem:\n${data.mensagem}`
            );
            const mailto = `mailto:AdifalContacto@gmail.com?subject=${subject}&body=${body}`;

            // Show success message
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = '✓ A abrir email...';
            btn.style.background = '#5B9A3A';

            // Open mailto
            window.location.href = mailto;

            // Reset after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // === DOWNLOAD BUTTON CLICK TRACKING ===
    const downloadBtn = document.querySelector('.download-btn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            // Visual feedback
            const original = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<span class="btn-icon">✓</span> A transferir...';

            setTimeout(() => {
                downloadBtn.innerHTML = original;
            }, 3000);
        });
    }

    // === PARALLAX EFFECT ON HERO (subtle) ===
    const hero = document.querySelector('.hero');

    if (hero && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scroll * 0.15}px)`;
                    heroContent.style.opacity = 1 - (scroll / (window.innerHeight * 0.8));
                }
            }
        }, { passive: true });
    }

    // === CAROUSEL (Implementações Futuras) ===
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev  = document.getElementById('carouselPrev');
    const carouselNext  = document.getElementById('carouselNext');
    const carouselDots  = document.getElementById('carouselDots');

    if (carouselTrack) {
        const slides    = carouselTrack.querySelectorAll('.carousel-slide');
        const totalSlides = slides.length;
        let currentSlide  = 0;
        let autoPlayTimer = null;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            carouselDots.appendChild(dot);
        });

        const dots = carouselDots.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
            carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
            resetAutoPlay();
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        carouselNext.addEventListener('click', nextSlide);
        carouselPrev.addEventListener('click', prevSlide);

        // Auto-play every 7 s
        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(nextSlide, 7000);
        }
        resetAutoPlay();

        // Pause on hover
        carouselTrack.closest('.carousel').addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        carouselTrack.closest('.carousel').addEventListener('mouseleave', resetAutoPlay);

        // Touch / swipe support
        let touchStartX = 0;
        let touchEndX   = 0;

        carouselTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });

        // Keyboard arrows (when section is in view)
        document.addEventListener('keydown', e => {
            const section = document.getElementById('futuro');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft')  prevSlide();
            }
        });
    }

    // === CONSOLE BRANDING ===
    console.log(
        '%c🌿 ADIFAL — Inteligência Agrícola',
        'color: #2E5935; font-size: 16px; font-weight: bold; padding: 8px;'
    );
    console.log(
        '%cAutomação · Desenvolvimento · Implementação · Futuro AgrícoL',
        'color: #5BA8C8; font-size: 11px; padding: 4px;'
    );

});
