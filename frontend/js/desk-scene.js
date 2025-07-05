
class DeskScene {
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
        const canvas = document.getElementById('desk-canvas');
        const container = canvas.parentElement;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0A192F);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 4, 8);
        this.camera.lookAt(0, 1, 0);

        // Renderer setup
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
        this.renderer.toneMappingExposure = 1.0;

        // Lighting
        this.setupLighting();

        // Create desk and arm
        this.createDesk();
        this.createRoboticArm();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x64FFDA, 1, 100);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }

    createDesk() {
        // Desk top
        const deskGeometry = new THREE.BoxGeometry(10, 0.2, 4);
        const deskMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.1,
            roughness: 0.8
        });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = 0;
        desk.receiveShadow = true;
        this.scene.add(desk);

        // Wall
        const wallGeometry = new THREE.PlaneGeometry(10, 6);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x112240,
            metalness: 0.5,
            roughness: 0.5
        });
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.y = 3;
        wall.position.z = -2;
        this.scene.add(wall);
    }

    createPBRMaterial(color, metalness = 0.8, roughness = 0.2) {
        return new THREE.MeshStandardMaterial({
            color: color,
            metalness: metalness,
            roughness: roughness,
        });
    }

    createRoboticArm() {
        const baseMaterial = this.createPBRMaterial(0x64FFDA, 0.9, 0.1);
        const shoulderMaterial = this.createPBRMaterial(0xCCD6F6, 0.8, 0.2);
        const elbowMaterial = this.createPBRMaterial(0x8892B0, 0.7, 0.3);
        const wristMaterial = this.createPBRMaterial(0x64FFDA, 0.9, 0.1);
        const gripperMaterial = this.createPBRMaterial(0xFF6B6B, 0.6, 0.4);

        const armGroup = new THREE.Group();
        this.scene.add(armGroup);
        armGroup.position.x = 2; // Move arm to the right

        // Base
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.7, 0.2, 32);
        this.arm.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.arm.base.position.y = 0.2;
        this.arm.base.castShadow = true;
        this.arm.base.userData = { clickable: true, action: 'scrollToSkills' };
        armGroup.add(this.arm.base);

        // Shoulder
        const shoulderGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.4);
        this.arm.shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        this.arm.shoulder.position.y = 0.8;
        this.arm.shoulder.castShadow = true;
        this.arm.base.add(this.arm.shoulder);

        // Elbow
        const elbowGeometry = new THREE.BoxGeometry(0.3, 1.0, 0.3);
        this.arm.elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
        this.arm.elbow.position.y = 0.6;
        this.arm.elbow.castShadow = true;
        this.arm.shoulder.add(this.arm.elbow);

        // Wrist
        const wristGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.2);
        this.arm.wrist = new THREE.Mesh(wristGeometry, wristMaterial);
        this.arm.wrist.position.y = 0.5;
        this.arm.wrist.castShadow = true;
        this.arm.elbow.add(this.arm.wrist);

        // Gripper
        const gripperGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        this.arm.gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
        this.arm.gripper.position.y = 0.3;
        this.arm.gripper.castShadow = true;
        this.arm.gripper.userData = { clickable: true, action: 'scrollToProjects' };
        this.arm.wrist.add(this.arm.gripper);
    }

    updateArmPosition() {
        const targetPos = new THREE.Vector3(this.target.x, this.target.y, this.target.z);

        // Base rotation
        const baseRotation = Math.atan2(targetPos.x - this.arm.base.parent.position.x, targetPos.z);
        this.arm.base.rotation.y = THREE.MathUtils.lerp(this.arm.base.rotation.y, baseRotation, 0.1);

        // Simple IK for shoulder and elbow
        const armBasePos = new THREE.Vector3();
        this.arm.shoulder.getWorldPosition(armBasePos);

        const distance = targetPos.distanceTo(armBasePos);
        const l1 = 1.2; // Length of shoulder
        const l2 = 1.0; // Length of elbow

        if (distance < l1 + l2) {
            const angle1 = Math.acos((l1 * l1 + distance * distance - l2 * l2) / (2 * l1 * distance));
            const angle2 = Math.atan2(targetPos.y - armBasePos.y, Math.sqrt(Math.pow(targetPos.x - armBasePos.x, 2) + Math.pow(targetPos.z - armBasePos.z, 2)));
            this.arm.shoulder.rotation.z = THREE.MathUtils.lerp(this.arm.shoulder.rotation.z, (angle1 + angle2) - Math.PI / 2, 0.1);

            const elbowAngle = Math.acos((l1 * l1 + l2 * l2 - distance * distance) / (2 * l1 * l2));
            this.arm.elbow.rotation.z = THREE.MathUtils.lerp(this.arm.elbow.rotation.z, elbowAngle - Math.PI, 0.1);
        }
    }

    setupEventListeners() {
        const canvas = document.getElementById('desk-canvas');

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.target.x = this.mouse.x * 4;
            this.target.y = this.mouse.y * 2 + 1;
            this.target.z = -2;
        });

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects([this.arm.base, this.arm.gripper], true);

            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                if (clicked.userData.clickable) {
                    this.handleNavigation(clicked.userData.action);
                }
            }
        });

        window.addEventListener('resize', () => this.handleResize());
    }

    handleNavigation(action) {
        const element = document.getElementById(action.replace('scrollTo', '').toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    handleResize() {
        const canvas = document.getElementById('desk-canvas');
        const container = canvas.parentElement;

        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateArmPosition();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        new DeskScene();
    } else {
        console.warn('Three.js not loaded, desk scene visualization disabled');
    }
});
