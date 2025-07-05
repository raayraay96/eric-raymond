/**
 * Main JavaScript for Eric Raymond's Portfolio
 * Modern, performant, and accessible implementation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initThemeToggle();
    initRoboticArmScene();
    initTypewriter();
    initSmoothScroll();
    initMagneticButtons();
    initIntersectionObserver();
    
    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Get user's preferred color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Dispatch custom event for any theme-dependent components
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Initialize 3D Robotic Arm Scene with Three.js
 */
function initRoboticArmScene() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Cannot initialize 3D scene.');
        return;
    }

    const container = document.getElementById('robotic-arm-scene');
    if (!container) {
        console.error('Robotic arm scene container not found.');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Set camera position
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Add lighting for dramatic effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1);
    keyLight.position.set(5, 10, 5);
    keyLight.lookAt(0, 0, 0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-5, 8, -5);
    fillLight.lookAt(0, 0, 0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(0, 5, -10);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Create a simple robotic arm placeholder (cylinders to simulate arm parts)
    const armGroup = new THREE.Group();

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1, 2, 1, 32);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 100 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.5;
    armGroup.add(base);

    // Lower arm
    const lowerArmGeometry = new THREE.CylinderGeometry(0.3, 0.5, 3, 32);
    const lowerArmMaterial = new THREE.MeshPhongMaterial({ color: 0x555555, shininess: 100 });
    const lowerArm = new THREE.Mesh(lowerArmGeometry, lowerArmMaterial);
    lowerArm.position.y = 2;
    armGroup.add(lowerArm);

    // Upper arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 32);
    const upperArm = new THREE.Mesh(upperArmGeometry, lowerArmMaterial);
    upperArm.position.y = 4;
    armGroup.add(upperArm);

    // Gripper
    const gripperGeometry = new THREE.BoxGeometry(0.2, 0.2, 1);
    const gripperMaterial = new THREE.MeshPhongMaterial({ color: 0x777777, shininess: 100 });
    const gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
    gripper.position.y = 5;
    gripper.position.z = 0.5;
    armGroup.add(gripper);

    scene.add(armGroup);

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse position for arm movement
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener('mousemove', (e) => {
        // Convert mouse position to 3D space
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = 1 - (e.clientY / window.innerHeight); // Invert Y for intuitive control
    });

    // Navigation click events on arm parts (simplified for placeholder)
    container.addEventListener('click', (e) => {
        // For simplicity, this is a placeholder. In a full implementation, raycasting would detect specific parts.
        // Here, we'll simulate clicking the gripper if near the top of the screen, base if near bottom.
        const clickY = e.clientY / window.innerHeight;
        if (clickY < 0.3) {
            // Simulate clicking gripper -> go to projects
            window.scrollTo({
                top: document.getElementById('projects').offsetTop - 80,
                behavior: 'smooth'
            });
        } else if (clickY > 0.7) {
            // Simulate clicking base -> go to about (assuming there will be an about section)
            const aboutSection = document.querySelector('#about') || document.querySelector('#projects');
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate arm based on mouse position (simplified movement)
        armGroup.rotation.y = mouseX * Math.PI / 2;
        lowerArm.rotation.x = (mouseY - 0.5) * Math.PI / 2;
        upperArm.rotation.x = (mouseY - 0.5) * Math.PI / 4;

        renderer.render(scene, camera);
    }

    animate();
}

/**
 * Initialize typewriter effect for power statements
 */
function initTypewriter() {
    const powerStatements = [
        'I build intelligent systems.',
        'From robotics to augmented reality.'
    ];
    
    const powerStatementElement = document.getElementById('power-statement');
    if (!powerStatementElement) return;
    
    let currentStatementIndex = 0;
    let isDeleting = false;
    let text = '';
    let typeSpeed = 100;
    let deleteSpeed = 50;
    let waitTime = 2000;
    
    function type() {
        const currentStatement = powerStatements[currentStatementIndex];
        
        // Check if deleting
        if (isDeleting) {
            // Remove char
            text = currentStatement.substring(0, text.length - 1);
        } else {
            // Add char
            text = currentStatement.substring(0, text.length + 1);
        }
        
        // Update element
        powerStatementElement.textContent = text;
        
        // Set type speed
        let typeSpeedVariation = Math.random() * 50 + 50; // Randomize speed slightly
        
        if (!isDeleting && text === currentStatement) {
            // At the end of the statement, pause then start deleting
            typeSpeed = waitTime;
            isDeleting = true;
        } else if (isDeleting && text === '') {
            // Finished deleting, move to next statement
            isDeleting = false;
            currentStatementIndex = (currentStatementIndex + 1) % powerStatements.length;
            typeSpeed = 100; // Typing speed
        } else if (isDeleting) {
            // Adjust delete speed
            typeSpeed = deleteSpeed;
            typeSpeedVariation = typeSpeedVariation / 2; // Faster when deleting
        }
        
        // Call next step
        setTimeout(type, isDeleting ? typeSpeed : typeSpeed + typeSpeedVariation);
    }
    
    // Start the typewriter effect after a delay
    setTimeout(type, 1000);
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Calculate the target position
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        });
    });
}

/**
 * Initialize magnetic button effect
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('[data-magnetic]');
    
    buttons.forEach(button => {
        const buttonRect = button.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;
        
        button.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from center
            const distanceX = mouseX - buttonCenterX;
            const distanceY = mouseY - buttonCenterY;
            
            // Apply transform based on distance from center
            const transformX = distanceX * 0.2; // Adjust multiplier for sensitivity
            const transformY = distanceY * 0.2;
            
            button.style.transform = `translate(${transformX}px, ${transformY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Initialize Intersection Observer for scroll animations
 */
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Parallax Scrolling Effect
function handleParallax() {
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-parallax-speed'));
        const yPos = -(window.pageYOffset * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}

window.addEventListener('scroll', handleParallax);

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set the theme and update the UI
function setTheme(theme) {
    // Update the HTML attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update the toggle button icon
    updateThemeToggleIcon(theme);
    
    // Dispatch a custom event in case other components need to react to theme changes
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

// Function to update the theme toggle icon based on the current theme
function updateThemeToggleIcon(theme) {
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.sun');
    const moonIcon = themeToggle.querySelector('.moon');
    
    if (sunIcon && moonIcon) {
        const isDark = theme === 'dark';
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
        
        // Update ARIA label
        themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
}

// Function to initialize the theme
function initializeTheme() {
    // Check for saved theme preference, fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    // Set the initial theme
    setTheme(theme);
    
    // Add a class to the body to prevent transitions on initial load
    document.body.classList.add('theme-loaded');
}

// Toggle theme when button is clicked
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Add a class to the body to enable transitions after first interaction
        document.body.classList.add('theme-transitions');
    });
}

// Listen for system theme changes (if no preference is set)
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add a class to the body to enable transitions after page loads
    setTimeout(() => {
        document.body.classList.add('theme-transitions');
    }, 100);
    
    // Initialize the theme
    initializeTheme();
});

// Vanilla Tilt for Project Cards
document.addEventListener('DOMContentLoaded', () => {
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });
});

// ScrollReveal for Animations
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('.reveal', {
        distance: '20px',
        duration: 600,
        easing: 'ease-out',
        origin: 'bottom',
        reset: false
    });
}

// Project Modal Handling
const projectData = [
    {
        title: "Robotics Machine Learning Intern",
        challenge: "To overcome hardware limitations and enable a robot to perceive and mimic human motion in real-time.",
        approach: "Engineered a modular solution using ROS, PyTorch, and OpenCV. Integrated MonoDepth2 algorithms to generate real-time depth maps.",
        results: "Significantly enhancing system responsiveness and achieving high spatial accuracy.",
        techBadges: ["Python", "ROS", "PyTorch", "OpenCV", "Computer Vision"],
        videoSrc: "assets/robotics-ml-demo.mp4",
        liveDemo: "#",
        githubRepo: "#"
    },
    {
        title: "Cloud-Based Threat Detection",
        challenge: "To classify a massive dataset of PDF files as benign or malicious in a scalable way.",
        approach: "Designed and deployed a scalable data pipeline on Google Cloud Platform (GCP), using Google Cloud Storage for data ingestion and BigQuery for large-scale analysis.",
        results: "Created a robust system for threat identification.",
        techBadges: ["Google Cloud Platform (GCP)", "BigQuery", "Python"],
        videoSrc: "assets/cloud-threat-detection-demo.mp4",
        liveDemo: "#",
        githubRepo: "#"
    },
    {
        title: "Augmented Reality Research",
        challenge: "To make complex nanoscience concepts understandable and accessible for educational purposes.",
        approach: "Developed 'Nano Vision,' an iOS AR application using Unity, C#, and ARKit, and collaborated in an Agile environment.",
        results: "Delivered a novel 'Accessibility Mode' for users with physical disabilities, demonstrating a commitment to inclusive design.",
        techBadges: ["Unity", "C#", "ARKit", "iOS"],
        videoSrc: "assets/ar-nano-vision-demo.mp4",
        liveDemo: "#",
        githubRepo: "#"
    }
];

function createProjectCards() {
    const grid = document.querySelector('.project-grid');
    if (!grid) return;
    
    projectData.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('project-card', 'reveal');
        card.setAttribute('data-index', index);
        let badgesHTML = project.techBadges.map(badge => `<span style="display: inline-block; background: var(--primary); color: white; padding: 0.2rem 0.5rem; margin-right: 0.5rem; margin-bottom: 0.5rem; border-radius: 0.25rem; font-size: 0.8rem;">${badge}</span>`).join('');
        card.innerHTML = `
            <h3>${project.title}</h3>
            <div class="video-container">
                <video muted loop playsinline src="${project.videoSrc}" type="video/mp4" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"></video>
                <div class="video-fallback" style="display: none; text-align: center; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 10px; margin-top: 1rem;">
                    <p>Video not available</p>
                    <p style="font-size: 0.9rem; color: var(--text-secondary);">${project.challenge}</p>
                </div>
            </div>
            <div class="tech-badges">
                ${badgesHTML}
            </div>
            <div class="project-links">
                <a href="${project.liveDemo}" class="project-link" target="_blank">Live Demo</a>
                <a href="${project.githubRepo}" class="project-link" target="_blank">GitHub Repo</a>
            </div>
        `;
        card.addEventListener('click', () => openModal(index));
        grid.appendChild(card);
    });
}

function openModal(index) {
    const project = projectData[index];
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" aria-label="Close modal">&times;</button>
            <h2>${project.title}</h2>
            <h3>Core Challenge</h3>
            <p>${project.challenge}</p>
            <h3>My Approach & Solution</h3>
            <p>${project.approach}</p>
            <h3>Impact & Results</h3>
            <p>${project.results}</p>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    setTimeout(() => modalOverlay.classList.add('active'), 10);
    
    modalOverlay.querySelector('.close-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        setTimeout(() => modalOverlay.remove(), 300);
    }
}

// Initialize project cards on load
document.addEventListener('DOMContentLoaded', createProjectCards);

// Magnetic Effect for CTA Button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mousemove', (e) => {
        const rect = ctaButton.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;
        if (distance < maxDistance) {
            const moveX = x / maxDistance * 10;
            const moveY = y / maxDistance * 10;
            ctaButton.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        }
    });
    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translate(0, 0) scale(1)';
    });
}
