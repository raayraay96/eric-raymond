// Robotic Arm 3D Visualization with PBR Materials and Interactive Navigation
class RoboticArm {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.arm = {
            base: null,
            shoulder: null,
            elbow: null,
            wrist: null,
            gripper: null
        };
        this.mouse = { x: 0, y: 0 };
        this.target = { x: 0, y: 0, z: 0 };
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        const canvas = document.getElementById('roboticArm');
        const container = canvas.parentElement;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0A192F);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            60,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 3, 5);
        this.camera.lookAt(0, 1, 0);
        
        // Renderer setup with high-quality settings
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Lighting setup - Dramatic studio lighting
        this.setupLighting();
        
        // Create robotic arm
        this.createRoboticArm();
        
        // Add environment
        this.createEnvironment();
    }

    setupLighting() {
        // Key light - Main illumination
        const keyLight = new THREE.DirectionalLight(0x64FFDA, 2);
        keyLight.position.set(10, 10, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        this.scene.add(keyLight);
        
        // Fill light - Soften shadows
        const fillLight = new THREE.DirectionalLight(0xCCD6F6, 0.8);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);
        
        // Rim light - Edge definition
        const rimLight = new THREE.DirectionalLight(0x8892B0, 1);
        rimLight.position.set(0, 2, -10);
        this.scene.add(rimLight);
        
        // Ambient light - Base illumination
        const ambientLight = new THREE.AmbientLight(0x233554, 0.3);
        this.scene.add(ambientLight);
        
        // Point light for accent
        const accentLight = new THREE.PointLight(0x64FFDA, 1, 20);
        accentLight.position.set(3, 4, 3);
        this.scene.add(accentLight);
    }

    createPBRMaterial(color, metalness = 0.8, roughness = 0.2) {
        return new THREE.MeshStandardMaterial({
            color: color,
            metalness: metalness,
            roughness: roughness,
            envMapIntensity: 1.0
        });
    }

    createRoboticArm() {
        // Materials with different metallic properties
        const baseMaterial = this.createPBRMaterial(0x64FFDA, 0.9, 0.1);
        const shoulderMaterial = this.createPBRMaterial(0xCCD6F6, 0.8, 0.2);
        const elbowMaterial = this.createPBRMaterial(0x8892B0, 0.7, 0.3);
        const wristMaterial = this.createPBRMaterial(0x64FFDA, 0.9, 0.1);
        const gripperMaterial = this.createPBRMaterial(0xFF6B6B, 0.6, 0.4);
        
        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.8, 1.2, 0.3, 16);
        this.arm.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.arm.base.position.y = 0.15;
        this.arm.base.castShadow = true;
        this.arm.base.receiveShadow = true;
        this.arm.base.userData = { clickable: true, action: 'scrollToSkills' };
        this.scene.add(this.arm.base);
        
        // Shoulder joint
        const shoulderGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
        this.arm.shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        this.arm.shoulder.position.set(0, 1.05, 0);
        this.arm.shoulder.castShadow = true;
        this.arm.shoulder.receiveShadow = true;
        this.scene.add(this.arm.shoulder);
        
        // Elbow joint
        const elbowGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3);
        this.arm.elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
        this.arm.elbow.position.set(0, 2.4, 0);
        this.arm.elbow.castShadow = true;
        this.arm.elbow.receiveShadow = true;
        this.scene.add(this.arm.elbow);
        
        // Wrist joint
        const wristGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.2);
        this.arm.wrist = new THREE.Mesh(wristGeometry, wristMaterial);
        this.arm.wrist.position.set(0, 3.4, 0);
        this.arm.wrist.castShadow = true;
        this.arm.wrist.receiveShadow = true;
        this.scene.add(this.arm.wrist);
        
        // Gripper
        const gripperGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        this.arm.gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
        this.arm.gripper.position.set(0, 4, 0);
        this.arm.gripper.castShadow = true;
        this.arm.gripper.receiveShadow = true;
        this.arm.gripper.userData = { clickable: true, action: 'scrollToProjects' };
        this.scene.add(this.arm.gripper);
        
        // Add connecting joints
        this.createJoints();
        
        // Add laser guide line
        this.createLaserGuide();
    }

    createJoints() {
        const jointMaterial = this.createPBRMaterial(0x233554, 0.9, 0.1);
        
        // Base to shoulder joint
        const joint1Geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const joint1 = new THREE.Mesh(joint1Geometry, jointMaterial);
        joint1.position.set(0, 0.75, 0);
        joint1.castShadow = true;
        this.scene.add(joint1);
        
        // Shoulder to elbow joint
        const joint2 = new THREE.Mesh(joint1Geometry, jointMaterial);
        joint2.position.set(0, 1.8, 0);
        joint2.castShadow = true;
        this.scene.add(joint2);
        
        // Elbow to wrist joint
        const joint3 = new THREE.Mesh(joint1Geometry, jointMaterial);
        joint3.position.set(0, 3, 0);
        joint3.castShadow = true;
        this.scene.add(joint3);
    }

    createLaserGuide() {
        const points = [];
        points.push(new THREE.Vector3(0, 4, 0));
        points.push(new THREE.Vector3(0, 0, 0));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x64FFDA,
            transparent: true,
            opacity: 0.6
        });
        
        this.laserGuide = new THREE.Line(geometry, material);
        this.scene.add(this.laserGuide);
    }

    createEnvironment() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x112240,
            metalness: 0.1,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Grid pattern
        const gridHelper = new THREE.GridHelper(20, 20, 0x233554, 0x233554);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        this.scene.add(gridHelper);
    }

    updateArmPosition() {
        // Simple inverse kinematics
        const targetDistance = Math.sqrt(
            this.target.x * this.target.x + 
            this.target.z * this.target.z
        );
        
        // Base rotation
        const baseRotation = Math.atan2(this.target.x, this.target.z);
        this.arm.base.rotation.y = THREE.MathUtils.lerp(
            this.arm.base.rotation.y, 
            baseRotation, 
            0.05
        );
        
        // Shoulder angle
        const shoulderAngle = Math.atan2(this.target.y - 1, targetDistance);
        this.arm.shoulder.rotation.z = THREE.MathUtils.lerp(
            this.arm.shoulder.rotation.z,
            Math.max(-Math.PI/3, Math.min(Math.PI/3, shoulderAngle)),
            0.05
        );
        
        // Elbow angle
        const elbowAngle = -shoulderAngle * 0.7;
        this.arm.elbow.rotation.z = THREE.MathUtils.lerp(
            this.arm.elbow.rotation.z,
            elbowAngle,
            0.05
        );
        
        // Wrist follows
        this.arm.wrist.rotation.z = THREE.MathUtils.lerp(
            this.arm.wrist.rotation.z,
            -elbowAngle * 0.5,
            0.05
        );
        
        // Update gripper position for laser guide
        const gripperWorldPos = new THREE.Vector3();
        this.arm.gripper.getWorldPosition(gripperWorldPos);
        
        const points = [gripperWorldPos, this.target];
        this.laserGuide.geometry.setFromPoints(points);
    }

    setupEventListeners() {
        const canvas = document.getElementById('roboticArm');
        
        // Mouse movement
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Update target position
            this.target.x = this.mouse.x * 3;
            this.target.y = Math.max(0.5, 2 + this.mouse.y * 2);
            this.target.z = this.mouse.x * 2;
        });
        
        // Click events for navigation
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects([this.arm.base, this.arm.gripper]);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                if (clicked.userData.clickable) {
                    this.handleNavigation(clicked.userData.action);
                }
            }
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleNavigation(action) {
        switch (action) {
            case 'scrollToProjects':
                document.getElementById('projects').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                break;
            case 'scrollToSkills':
                document.getElementById('skills').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                break;
        }
    }

    handleResize() {
        const canvas = document.getElementById('roboticArm');
        const container = canvas.parentElement;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update arm position
        this.updateArmPosition();
        
        // Subtle camera movement
        const time = Date.now() * 0.0005;
        this.camera.position.x = Math.cos(time) * 0.5 + 5;
        this.camera.position.z = Math.sin(time) * 0.5 + 5;
        this.camera.lookAt(0, 2, 0);
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to load
    if (typeof THREE !== 'undefined') {
        new RoboticArm();
    } else {
        // Fallback if Three.js doesn't load
        console.warn('Three.js not loaded, robotic arm visualization disabled');
    }
});