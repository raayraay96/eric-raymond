/**
 * Main JavaScript for Eric Raymond's Portfolio
 * Modern, performant, and accessible implementation
 */

// Initialize components when DOM is ready
function init() {
    initThemeToggle();
    initRoboticArmScene();
    initTypewriter();
    initSmoothScroll();
    initMagneticButtons();
    initIntersectionObserver();
    createProjectCards();
}

// Check if Three.js is loaded before initializing
if (typeof THREE !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
} else {
    console.error('Three.js not loaded. Robotic arm will not be available.');
}

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
 * Initialize 3D Robotic Arm Scene with Three.js and Inverse Kinematics
 */
function initRoboticArmScene() {
    console.log('Initializing robotic arm scene...');
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Cannot initialize 3D scene.');
        return;
    }
    
    console.log('Three.js version:', THREE.REVISION);

    const container = document.getElementById('robotic-arm-scene');
    if (!container) {
        console.error('Robotic arm scene container not found.');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create renderer with alpha and antialiasing
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add the renderer to the container
    container.innerHTML = ''; // Clear any existing content
    container.appendChild(renderer.domElement);
    
    // Debug: Add border to canvas for visibility
    renderer.domElement.style.border = '1px solid red'; // Temporary for debugging

    // Set camera position
    camera.position.set(0, 3, 15);
    camera.lookAt(0, 3, 0);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create arm parts with proper hierarchy
    const armGroup = new THREE.Group();
    armGroup.position.y = 0;

    // Materials
    const metalMaterial = new THREE.MeshPhongMaterial({
        color: 0x555555,
        shininess: 100,
        flatShading: true
    });

    const accentMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e88e5,
        shininess: 50,
        flatShading: true
    });

    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.5, 0.8, 32),
        metalMaterial
    );
    base.rotation.x = Math.PI / 2;
    base.position.y = 0.4;
    armGroup.add(base);

    // Shoulder (rotation point for entire arm)
    const shoulder = new THREE.Group();
    shoulder.position.y = 0.8;
    armGroup.add(shoulder);

    // Upper arm
    const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, 3, 8),
        accentMaterial
    );
    upperArm.rotation.z = Math.PI / 2;
    upperArm.position.y = 1.5;
    shoulder.add(upperArm);

    // Elbow joint
    const elbow = new THREE.Group();
    elbow.position.set(3, 0, 0);
    upperArm.add(elbow);

    // Lower arm
    const lowerArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.25, 2.5, 8),
        metalMaterial
    );
    lowerArm.rotation.z = Math.PI / 2;
    lowerArm.position.x = 1.25;
    elbow.add(lowerArm);

    // Wrist joint
    const wrist = new THREE.Group();
    wrist.position.set(2.5, 0, 0);
    lowerArm.add(wrist);

    // Gripper (two fingers)
    const gripperGroup = new THREE.Group();
    
    const gripperBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.3, 0.3),
        accentMaterial
    );
    gripperGroup.add(gripperBase);
    
    // Left finger
    const leftFinger = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.15, 0.8),
        metalMaterial
    );
    leftFinger.position.set(0.15, 0, 0.3);
    gripperGroup.add(leftFinger);
    
    // Right finger
    const rightFinger = leftFinger.clone();
    rightFinger.position.z = -0.3;
    gripperGroup.add(rightFinger);
    
    // Position gripper
    gripperGroup.position.set(0.5, 0, 0);
    gripperGroup.rotation.z = -Math.PI / 2;
    wrist.add(gripperGroup);

    // Add to scene
    scene.add(armGroup);
    
    console.log('Robotic arm added to scene');
    console.log('Renderer:', renderer);
    console.log('Camera:', camera);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Track mouse position
    const targetPosition = new THREE.Vector3(4, 3, 0);
    const currentPosition = new THREE.Vector3();
    
    // Track hovered elements
    let hoveredElement = null;
    let isClicking = false;

    // Handle mouse move
    function onMouseMove(event) {
        // Normalize mouse position to -1 to 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update target position for arm
        const x = (mouse.x * 8);
        const y = (mouse.y * 4) + 3; // Offset Y to keep arm visible
        targetPosition.set(x, y, 0);
        
        // Check for hovered elements
        checkIntersections();
    }

    // Check for intersections with clickable elements
    function checkIntersections() {
        // Reset previous hover
        if (hoveredElement) {
            hoveredElement.classList.remove('arm-hover');
            hoveredElement = null;
        }
        
        // Check for navigation items
        const navItems = document.querySelectorAll('a[href^="#"], button, .project-card');
        const elements = [];
        
        navItems.forEach(item => {
            if (item.offsetParent !== null) { // Only visible elements
                const rect = item.getBoundingClientRect();
                elements.push({
                    element: item,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    width: rect.width,
                    height: rect.height
                });
            }
        });
        
        // Check if mouse is over any element
        for (const element of elements) {
            if (
                mouse.x >= (element.left / window.innerWidth) * 2 - 1 &&
                mouse.x <= (element.right / window.innerWidth) * 2 - 1 &&
                mouse.y >= -((element.bottom / window.innerHeight) * 2 - 1) &&
                mouse.y <= -((element.top / window.innerHeight) * 2 - 1)
            ) {
                hoveredElement = element.element;
                hoveredElement.classList.add('arm-hover');
                break;
            }
        }
    }
    
    // Handle click
    function onClick() {
        if (hoveredElement && !isClicking) {
            isClicking = true;
            
            // Animate gripper close
            const leftFinger = gripperGroup.children[1];
            const rightFinger = gripperGroup.children[2];
            
            // Close gripper
            leftFinger.position.z = 0.4;
            rightFinger.position.z = -0.4;
            
            // Trigger click after a short delay
            setTimeout(() => {
                if (hoveredElement.tagName === 'A' || hoveredElement.tagName === 'BUTTON') {
                    hoveredElement.click();
                } else if (hoveredElement.closest('a, button')) {
                    hoveredElement.closest('a, button').click();
                }
                
                // Open gripper
                leftFinger.position.z = 0.3;
                rightFinger.position.z = -0.3;
                isClicking = false;
            }, 300);
        }
    }

    // Inverse Kinematics function
    function updateArmIK(target) {
        const upperArm = shoulder.children[0];
        const lowerArm = upperArm.children[0].children[0];
        const wrist = lowerArm.parent;
        
        // Arm lengths
        const upperArmLength = 3;
        const lowerArmLength = 2.5;
        
        // Convert target to local space
        const localTarget = new THREE.Vector3();
        localTarget.copy(target);
        shoulder.worldToLocal(localTarget);
        
        // Calculate distance to target
        const dx = localTarget.x;
        const dy = localTarget.y - 0.8; // Adjust for shoulder height
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if target is reachable
        if (distance > 0) {
            // Calculate angles using law of cosines
            const a = upperArmLength;
            const b = lowerArmLength;
            const c = Math.min(distance, a + b - 0.1); // Prevent over-extension
            
            const cosAngle0 = (a * a + c * c - b * b) / (2 * a * c);
            const angle0 = Math.acos(Math.max(-1, Math.min(1, cosAngle0)));
            
            const angle1 = Math.atan2(dy, dx);
            const angle2 = Math.atan2(localTarget.y - 0.8 - a * Math.sin(angle1 + angle0), 
                                    localTarget.x - a * Math.cos(angle1 + angle0));
            
            // Apply rotations
            shoulder.rotation.z = angle1 + angle0 - Math.PI / 2;
            elbow.rotation.z = angle2 - angle0 - angle1;
            
            // Rotate wrist to point at target
            if (wrist) {
                wrist.rotation.z = -elbow.rotation.z - shoulder.rotation.z - Math.PI / 2;
            }
        }
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    let frameCount = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        // Smoothly interpolate to target position
        currentPosition.lerp(targetPosition, 0.1);
        
        // Update arm IK
        updateArmIK(currentPosition);
        
        // Rotate base slightly based on mouse X position
        armGroup.rotation.y = mouse.x * 0.5;
        
        renderer.render(scene, camera);
        
        // Log first few frames for debugging
        if (frameCount < 5) {
            console.log(`Frame ${frameCount}:`, {
                renderer,
                scene: {
                    children: scene.children.length,
                    position: scene.position
                },
                camera: {
                    position: camera.position,
                    rotation: camera.rotation
                }
            });
            frameCount++;
        }
    }

    // Event listeners
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', onClick, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation
    animate();
    
    // Cleanup function
    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('click', onClick);
        window.removeEventListener('resize', onWindowResize);
        container.removeChild(renderer.domElement);
    };
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
