// Main JavaScript for Eric Raymond Portfolio
class Portfolio {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.loadProjects();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
    }
    
    setupNavigation() {
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('.nav__link');
        
        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
            
            // Navigation background on scroll
            if (window.pageYOffset > 50) {
                nav.style.background = 'rgba(10, 25, 47, 0.95)';
                nav.style.backdropFilter = 'blur(15px)';
            } else {
                nav.style.background = 'rgba(10, 25, 47, 0.9)';
                nav.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.about__description, .stat, .project-card, .skill-category, .contact__item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    loadProjects() {
        const projectsData = [
            {
                title: "Robotic Imitation System",
                description: "Enhanced system responsiveness by 40% using machine learning control algorithms for real-time robotic imitation. Integrated MonoDepth2 algorithms for high spatial accuracy in human-robot interaction.",
                technologies: ["Python", "ROS", "PyTorch", "OpenCV", "MonoDepth2"],
                highlights: "University of Wyoming REU Internship"
            },
            {
                title: "Malicious PDF Detection",
                description: "Designed scalable data pipeline on Google Cloud Platform for large-scale threat identification. Utilized Google Cloud Storage and BigQuery for efficient processing and analysis.",
                technologies: ["Python", "GCP", "BigQuery", "Cloud Storage", "Machine Learning"],
                highlights: "Scalable threat detection system"
            },
            {
                title: "Nano Vision AR App",
                description: "Developed iOS AR application in Unity and C#, increasing user engagement with nanoscience concepts by 25%. Featured novel 'Accessibility Mode' for users with physical disabilities.",
                technologies: ["Unity", "C#", "ARKit", "iOS", "Xcode"],
                highlights: "Inclusive STEM education"
            }
        ];
        
        const projectsGrid = document.querySelector('.projects__grid');
        
        projectsData.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.2}s`;
        
        card.innerHTML = `
            <h3 class="project-card__title">${project.title}</h3>
            <p class="project-card__description">${project.description}</p>
            <div class="project-card__tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-card__highlight">
                <strong>Highlight:</strong> ${project.highlights}
            </div>
        `;
        
        // Add tilt effect
        this.addTiltEffect(card);
        
        return card;
    }
    
    addTiltEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
    
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
            
            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav__link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }
}

// Performance optimizations
class PerformanceOptimizer {
    static init() {
        // Preload critical fonts
        this.preloadFonts();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup lazy loading
        this.setupLazyLoading();
    }
    
    static preloadFonts() {
        const fontPreloads = [
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap'
        ];
        
        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
    
    static optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for better performance
            img.loading = 'lazy';
            
            // Add intersection observer for fade-in effect
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            observer.observe(img);
        });
    }
    
    static setupLazyLoading() {
        // Lazy load Three.js if not immediately needed
        const roboticArmCanvas = document.getElementById('roboticArm');
        
        if (roboticArmCanvas) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Three.js is already loaded via CDN
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(roboticArmCanvas);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance optimizations first
    PerformanceOptimizer.init();
    
    // Initialize main portfolio functionality
    new Portfolio();
    
    // Add some loading animations
    const loadingElements = document.querySelectorAll('.hero__content, .hero__visual');
    loadingElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Handle resize events efficiently
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Trigger resize events for 3D canvas
        const event = new Event('resize');
        window.dispatchEvent(event);
    }, 250);
});