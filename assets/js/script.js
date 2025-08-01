// ===== PERFORMANCE OPTIMIZATIONS =====
// Passive event listeners for better scroll performance
const passiveEvents = { passive: true };

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Enhanced smooth scrolling with offset for fixed headers
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, passiveEvents);
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            animateOnScroll.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    animateOnScroll.observe(el);
});

// ===== STAGGERED ANIMATIONS =====
const staggeredAnimations = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
            staggeredAnimations.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply staggered animations to skill cards and project cards
document.querySelectorAll('.skills-grid, .projects-grid').forEach(container => {
    // Set initial state for children
    Array.from(container.children).forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    staggeredAnimations.observe(container);
});

// ===== TYPING ANIMATION FOR HERO =====
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.wordIndex = 0;
        this.text = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        this.element.innerHTML = `<span class="typing-text">${this.text}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing animation if element exists
const typingElement = document.querySelector('.typing-animation');
if (typingElement) {
    new TypeWriter(typingElement, [
        'APIs REST',
        'Python & JavaScript',
        'Soluciones con IA',
        'Apps Móviles'
    ]);
}

// ===== PARALLAX SCROLLING =====
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    ticking = false;
}

function requestParallax() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallax, passiveEvents);

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (navbar) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('navbar-hidden');
        }
        
        // Add background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
    
    lastScrollTop = scrollTop;
}, passiveEvents);

// ===== MOUSE CURSOR EFFECTS =====
class CursorTracker {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(this.cursorDot);
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                this.cursorDot.style.left = e.clientX + 'px';
                this.cursorDot.style.top = e.clientY + 'px';
            }, 50);
        });
        
        // Add hover effects for interactive elements
        document.querySelectorAll('a, button, .btn, .skill-tag').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorDot.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorDot.classList.remove('cursor-hover');
            });
        });
    }
}

// Initialize cursor tracker on desktop only
if (window.innerWidth > 768) {
    new CursorTracker();
}

// ===== SKILL PROGRESS ANIMATION =====
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.dataset.progress || 90;
        const progressBar = bar.querySelector('.progress-fill');
        
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = progress + '%';
            }, 200);
        }
    });
}

// Trigger skill animation when skills section is visible
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillsObserver.observe(skillsSection);
}

// ===== CONTACT FORM ENHANCEMENT =====
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showNotification('¡Mensaje enviado correctamente!', 'success');
            contactForm.reset();
            
        } catch (error) {
            showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// ===== PERFORMANCE MONITORING =====
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            // Track Core Web Vitals
            if ('web-vital' in window) {
                // This would integrate with actual web vitals library
                console.log('Core Web Vitals tracking enabled');
            }
        });
    }
}

measurePerformance();

// ===== THEME TOGGLE (DARK/LIGHT MODE) =====
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

new ThemeManager();

// ===== LAZY LOADING FOR IMAGES =====
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
}, passiveEvents);

// ===== EMAIL PROTECTION =====
function protectEmail() {
    const emailElements = document.querySelectorAll('[data-email]');
    emailElements.forEach(el => {
        const email = atob(el.dataset.email);
        el.href = `mailto:${email}`;
        el.textContent = email;
    });
}

protectEmail();

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Focus management for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // Could send to analytics service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to analytics service
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully');
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== RESPONSIVE UTILITIES =====
function handleResize() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', handleResize, passiveEvents);
handleResize(); // Initial call

// ===== PRELOAD CRITICAL RESOURCES =====
function preloadResources() {
    const criticalImages = [
        // Add paths to critical images
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

preloadResources();