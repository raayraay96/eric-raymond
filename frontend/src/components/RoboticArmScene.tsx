import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Industrial robotic joint with realistic movement
function ArmJoint({ 
  position, 
  children, 
  targetRotation,
  axis = 'y',
  speed = 0.1,
  minAngle = -Math.PI * 2,
  maxAngle = Math.PI * 2
}: {
  position: [number, number, number];
  children?: React.ReactNode;
  targetRotation: [number, number, number];
  axis?: 'x' | 'y' | 'z';
  speed?: number;
  minAngle?: number;
  maxAngle?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Smooth interpolation with angle constraints
      const currentRot = ref.current.rotation[axis];
      let targetRot = targetRotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2];
      
      // Apply angle constraints
      targetRot = Math.max(minAngle, Math.min(maxAngle, targetRot));
      
      // Smooth movement with easing
      const newRot = THREE.MathUtils.lerp(currentRot, targetRot, speed);
      ref.current.rotation[axis] = newRot;
    }
  });

  return (
    <group position={position}>
      <group ref={ref}>
        {/* Joint visual */}
        <mesh 
          castShadow 
          receiveShadow
        >
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial 
            color="#808080" 
            metalness={0.8}
            roughness={0.3}
            envMapIntensity={0.5}
          />
        </mesh>
        {children}
      </group>
    </group>
  );
}

// Industrial arm segment with better materials and details
function ArmSegment({ 
  length, 
  radius = 0.4,
  detail = 16
}: {
  length: number;
  radius?: number;
  detail?: number;
}) {
  return (
    <group>
      {/* Main arm segment */}
      <mesh 
        position={[0, length / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[radius, radius * 0.9, length, detail]} />
        <meshStandardMaterial 
          color="#808080"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Arm details */}
      <mesh position={[0, length, 0]} castShadow>
        <boxGeometry args={[radius * 1.8, radius * 0.4, radius * 1.8]} />
        <meshStandardMaterial 
          color="#808080" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

// Industrial joint connector with better details
function Joint({ 
  radius = 0.5
}: { 
  radius?: number;
}) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial 
        color="#808080" 
        metalness={0.95} 
        roughness={0.05}
      />
    </mesh>
  );
}

// Target sphere that follows mouse
function TargetSphere({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ref.current) {
      ref.current.position.lerp(new THREE.Vector3(...position), 0.1);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#808080" transparent opacity={0.6} />
    </mesh>
  );
}

// Main enhanced robotic arm component with 7-DOF
function RoboticArm({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const armRef = useRef<THREE.Group>(null);
  
  // Convert mouse position to 3D world coordinates
  const target = useMemo(() => {
    const x = (mousePosition.x / window.innerWidth - 0.5) * 2;
    const y = -(mousePosition.y / window.innerHeight - 0.5) * 2;
    
    // Mapping adjusted for the scale and positioning similar to the template
    const targetX = x * 10;
    const targetY = y * 10 + 5;
    const targetZ = x * 5;
    
    return { x: targetX, y: targetY, z: targetZ };
  }, [mousePosition]);

  // Enhanced inverse kinematics calculation based on the template
  const armConfig = useMemo(() => {
    const baseHeight = -5; // Adjusted for the arm's base position
    const l1 = 9 * 2; // Upper arm length scaled
    const l2 = (4 + 4) * 2; // Total forearm length scaled
    
    // Base rotation (Y-axis) - follows horizontal movement
    const baseRotationY = Math.atan2(target.x, target.z + 4);
    
    // Shoulder joint calculation
    const flatDist = Math.sqrt(target.x * target.x + target.z * target.z);
    const dist = Math.sqrt(flatDist * flatDist + (target.y - baseHeight) * (target.y - baseHeight));
    let shoulderTargetRot = 0;
    let totalBendRot = 0;
    
    if (dist > l1 + l2) {
      shoulderTargetRot = Math.atan2(target.y - baseHeight, flatDist);
      totalBendRot = 0;
    } else {
      const a1 = Math.atan2(target.y - baseHeight, flatDist);
      const cos_a2 = THREE.MathUtils.clamp((dist * dist + l1 * l1 - l2 * l2) / (2 * dist * l1), -1, 1);
      const a2 = Math.acos(cos_a2);
      shoulderTargetRot = a1 + a2;
      
      const cos_b = THREE.MathUtils.clamp((l1 * l1 + l2 * l2 - dist * dist) / (2 * l1 * l2), -1, 1);
      totalBendRot = Math.acos(cos_b) - Math.PI;
    }
    
    shoulderTargetRot = THREE.MathUtils.clamp(shoulderTargetRot, -Math.PI / 2, Math.PI / 2);
    totalBendRot = THREE.MathUtils.clamp(totalBendRot, -Math.PI * 0.9, 0);
    
    const elbowRot = totalBendRot * 0.6;
    const midJointRot = totalBendRot * 0.4;
    
    // Wrist rotation to look at target
    const wristRot = -shoulderTargetRot * 0.5 - elbowRot * 0.3;
    
    return {
      base: [0, baseRotationY, 0] as [number, number, number],
      shoulder: [shoulderTargetRot, 0, 0] as [number, number, number],
      elbow: [elbowRot, 0, 0] as [number, number, number],
      midJoint: [midJointRot, 0, 0] as [number, number, number],
      wrist: [wristRot, 0, 0] as [number, number, number],
      target: [target.x, target.y, target.z] as [number, number, number]
    };
  }, [target]);

  // Scale factor for the arm to match the template's proportions
  const scale = 2.0;

  return (
    <group ref={armRef} position={[12, -20, 0]}>
      {/* Base Platform */}
      <mesh position={[0, -0.2 * scale, 0]} receiveShadow>
        <cylinderGeometry args={[2.5 * scale, 3.5 * scale, 1.5 * scale, 32]} />
        <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base Joint */}
      <ArmJoint position={[0, 0.75 * scale, 0]} targetRotation={armConfig.base}>
        <Joint radius={1.5 * scale} />
        
        {/* Shoulder Joint */}
        <ArmJoint position={[0, 0, 0]} targetRotation={armConfig.shoulder}>
          <Joint radius={1.1 * scale} />
          <ArmSegment length={9 * scale} radius={1.2 * scale} />
          
          {/* Elbow Joint */}
          <ArmJoint position={[0, 9 * scale, 0]} targetRotation={armConfig.elbow}>
            <Joint radius={0.9 * scale} />
            <ArmSegment length={4 * scale} radius={0.9 * scale} />
            
            {/* Mid Joint */}
            <ArmJoint position={[0, 4 * scale, 0]} targetRotation={armConfig.midJoint}>
              <Joint radius={0.9 * scale} />
              <ArmSegment length={4 * scale} radius={0.8 * scale} />
              
              {/* Wrist Joint */}
              <ArmJoint position={[0, 4 * scale, 0]} targetRotation={armConfig.wrist}>
                <Joint radius={0.8 * scale} />
                <ArmSegment length={1 * scale} radius={0.6 * scale} />
                
                {/* End Effector */}
                <group position={[0, 1 * scale, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.6 * scale, 0.6 * scale, 1 * scale, 20]} />
                    <meshStandardMaterial 
                      color="#808080" 
                      metalness={0.9} 
                      roughness={0.1}
                    />
                  </mesh>
                </group>
              </ArmJoint>
            </ArmJoint>
          </ArmJoint>
        </ArmJoint>
      </ArmJoint>

      {/* Target sphere */}
      <TargetSphere position={armConfig.target} />
      
      {/* Grid floor */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#808080" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Main scene component with enhanced lighting and environment
export default function RoboticArmScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <div id="desk-canvas" className="w-full h-full">
      <Canvas
        camera={{ position: [0, 16, 50], fov: 75 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="bg-transparent"
      >
        {/* Enhanced Lighting Setup */}
        <ambientLight intensity={0.5} />
        
        {/* Key light */}
        <pointLight position={[10, 20, 10]} intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="studio" />
        
        {/* Robotic Arm */}
        <RoboticArm mousePosition={mousePosition} />
        
        {/* Enhanced ground shadows */}
        <ContactShadows
          opacity={0.6}
          scale={30}
          blur={2}
          far={40}
          resolution={512}
          color="#000000"
        />
        
        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
          maxDistance={60}
          minDistance={20}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
