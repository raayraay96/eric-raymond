import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Individual joint component with smooth rotation
function ArmJoint({ position, rotation, children, targetRotation }: {
  position: [number, number, number];
  rotation: [number, number, number];
  children?: React.ReactNode;
  targetRotation: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Smooth interpolation to target rotation
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation[0], 0.05);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation[1], 0.05);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotation[2], 0.05);
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {children}
    </group>
  );
}

// Individual arm segment
function ArmSegment({ length, radius, color }: {
  length: number;
  radius: number;
  color: string;
}) {
  return (
    <mesh position={[0, length / 2, 0]}>
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Joint connector
function Joint({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

// Main robotic arm component
function RoboticArm({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { viewport } = useThree();
  
  // Convert mouse position to 3D world coordinates
  const target = useMemo(() => {
    const x = (mousePosition.x / window.innerWidth) * 2 - 1;
    const y = -(mousePosition.y / window.innerHeight) * 2 + 1;
    
    return {
      x: x * viewport.width / 2,
      y: y * viewport.height / 2,
      z: 0
    };
  }, [mousePosition, viewport]);

  // Calculate inverse kinematics (simplified approach)
  const armConfig = useMemo(() => {
    const baseHeight = 1;
    // Note: segment lengths could be used for more complex IK calculations
    
    // Distance from base to target
    const distance = Math.sqrt(target.x * target.x + (target.y - baseHeight) * (target.y - baseHeight));
    
    // Base rotation (Y-axis) - follow X movement
    const baseRotationY = Math.atan2(target.x, target.z + 3);
    
    // Shoulder joint (X-axis) - main vertical movement
    const shoulderAngle = Math.atan2(target.y - baseHeight, Math.abs(target.x)) - 0.3;
    
    // Elbow joint - bend to reach target
    const elbowAngle = Math.PI / 4 + Math.sin(distance * 0.5) * 0.5;
    
    // Wrist joint - fine adjustment
    const wristAngle = -shoulderAngle * 0.7 - elbowAngle * 0.3;
    
    return {
      base: [0, baseRotationY, 0] as [number, number, number],
      shoulder: [shoulderAngle, 0, 0] as [number, number, number],
      elbow: [elbowAngle, 0, 0] as [number, number, number],
      wrist: [wristAngle, 0, 0] as [number, number, number]
    };
  }, [target]);

  return (
    <group position={[0, -2, 0]}>
      {/* Base */}
      <ArmJoint position={[0, 0, 0]} rotation={[0, 0, 0]} targetRotation={armConfig.base}>
        <Joint radius={0.3} color="#2563eb" />
        <ArmSegment length={1} radius={0.15} color="#1e40af" />
        
        {/* Shoulder */}
        <ArmJoint position={[0, 1, 0]} rotation={[0, 0, 0]} targetRotation={armConfig.shoulder}>
          <Joint radius={0.25} color="#dc2626" />
          <ArmSegment length={2} radius={0.12} color="#b91c1c" />
          
          {/* Elbow */}
          <ArmJoint position={[0, 2, 0]} rotation={[0, 0, 0]} targetRotation={armConfig.elbow}>
            <Joint radius={0.2} color="#16a34a" />
            <ArmSegment length={1.8} radius={0.1} color="#15803d" />
            
            {/* Wrist */}
            <ArmJoint position={[0, 1.8, 0]} rotation={[0, 0, 0]} targetRotation={armConfig.wrist}>
              <Joint radius={0.15} color="#ca8a04" />
              <ArmSegment length={1.5} radius={0.08} color="#a16207" />
              
              {/* End Effector */}
              <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[0.3, 0.1, 0.3]} />
                <meshStandardMaterial color="#7c3aed" metalness={0.8} roughness={0.2} />
              </mesh>
              
              {/* Targeting laser (visual effect) */}
              <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 10, 4]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
              </mesh>
            </ArmJoint>
          </ArmJoint>
        </ArmJoint>
      </ArmJoint>
    </group>
  );
}

// Main scene component
export default function RoboticArmScene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Robotic Arm */}
        <RoboticArm mousePosition={mousePosition} />
        
        {/* Ground plane */}
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}