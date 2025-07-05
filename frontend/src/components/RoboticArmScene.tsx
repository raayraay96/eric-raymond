import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced joint component with smooth rotation
function ArmJoint({ position, children, targetRotation }: {
  position: [number, number, number];
  children?: React.ReactNode;
  targetRotation: [number, number, number];
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      // Smooth interpolation to target rotation with easing
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation[0], 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation[1], 0.08);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotation[2], 0.08);
    }
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

// Enhanced arm segment with better materials
function ArmSegment({ length, radius, color, emissive = "#000000" }: {
  length: number;
  radius: number;
  color: string;
  emissive?: string;
}) {
  return (
    <mesh position={[0, length / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius * 0.8, length, 12]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.1}
        emissive={emissive}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Enhanced joint connector
function Joint({ radius, color, emissive = "#000000" }: { 
  radius: number; 
  color: string;
  emissive?: string;
}) {
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.95} 
        roughness={0.05}
        emissive={emissive}
        emissiveIntensity={0.2}
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
      <meshBasicMaterial color="#ff4444" transparent opacity={0.6} />
    </mesh>
  );
}

// Main enhanced robotic arm component
function RoboticArm({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { viewport } = useThree();
  
  // Convert mouse position to 3D world coordinates with enhanced reach
  const target = useMemo(() => {
    const x = (mousePosition.x / window.innerWidth - 0.5) * 2;
    const y = -(mousePosition.y / window.innerHeight - 0.5) * 2;
    
    // Enhanced mapping for wider reach - robot can reach any webpage element
    const targetX = x * viewport.width * 1.2;
    const targetY = y * viewport.height * 1.2 + 1;
    const targetZ = Math.sin(x * Math.PI) * 3;
    
    return { x: targetX, y: targetY, z: targetZ };
  }, [mousePosition, viewport]);

  // Enhanced inverse kinematics calculation
  const armConfig = useMemo(() => {
    const baseHeight = 0;
    
    // Calculate distance and angles with enhanced reach
    const distance = Math.sqrt(target.x * target.x + (target.y - baseHeight) * (target.y - baseHeight));
    const maxReach = 7.0; // Enhanced total arm reach for better webpage coverage
    const clampedDistance = Math.min(distance, maxReach);
    
    // Base rotation (Y-axis) - follows horizontal movement
    const baseRotationY = Math.atan2(target.x, target.z + 4);
    
    // Shoulder joint - main positioning
    const shoulderAngle = Math.atan2(target.y - baseHeight, Math.abs(target.x)) * 0.8;
    
    // Elbow joint - reaches toward target
    const elbowAngle = Math.PI * 0.3 + Math.sin(clampedDistance * 0.3) * 0.8;
    
    // Wrist joint - fine adjustment
    const wristAngle = -shoulderAngle * 0.5 - elbowAngle * 0.3;
    
    return {
      base: [0, baseRotationY, 0] as [number, number, number],
      shoulder: [shoulderAngle, 0, 0] as [number, number, number],
      elbow: [elbowAngle, 0, 0] as [number, number, number],
      wrist: [wristAngle, 0, 0] as [number, number, number],
      target: [target.x, target.y, target.z] as [number, number, number]
    };
  }, [target]);

  return (
    <group position={[3, -1, 0]}>
      {/* Realistic wooden desk */}
      <group position={[0, -2, 0]}>
        {/* Desk surface */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[8, 0.2, 4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Desk legs */}
        <mesh position={[-3.5, -1, 1.5]} receiveShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[3.5, -1, 1.5]} receiveShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[-3.5, -1, -1.5]} receiveShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[3.5, -1, -1.5]} receiveShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial color="#654321" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Desk drawers */}
        <mesh position={[-2, -0.5, 1.8]} receiveShadow>
          <boxGeometry args={[1.5, 0.8, 0.4]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh position={[2, -0.5, 1.8]} receiveShadow>
          <boxGeometry args={[1.5, 0.8, 0.4]} />
          <meshStandardMaterial color="#A0522D" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Drawer handles */}
        <mesh position={[-2, -0.5, 2.05]} receiveShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[2, -0.5, 2.05]} receiveShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Base Platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <cylinderGeometry args={[1, 1.2, 0.4, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base Joint */}
      <ArmJoint position={[0, 0, 0]} targetRotation={armConfig.base}>
        <Joint radius={0.3} color="#3b82f6" emissive="#1d4ed8" />
        <ArmSegment length={1.2} radius={0.15} color="#1e40af" emissive="#1e3a8a" />
        
        {/* Shoulder Joint */}
        <ArmJoint position={[0, 1.2, 0]} targetRotation={armConfig.shoulder}>
          <Joint radius={0.25} color="#ef4444" emissive="#dc2626" />
          <ArmSegment length={2} radius={0.12} color="#dc2626" emissive="#b91c1c" />
          
          {/* Elbow Joint */}
          <ArmJoint position={[0, 2, 0]} targetRotation={armConfig.elbow}>
            <Joint radius={0.2} color="#10b981" emissive="#059669" />
            <ArmSegment length={1.8} radius={0.1} color="#059669" emissive="#047857" />
            
            {/* Wrist Joint */}
            <ArmJoint position={[0, 1.8, 0]} targetRotation={armConfig.wrist}>
              <Joint radius={0.15} color="#f59e0b" emissive="#d97706" />
              <ArmSegment length={1} radius={0.08} color="#d97706" emissive="#b45309" />
              
              {/* End Effector */}
              <group position={[0, 1, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.4, 0.15, 0.4]} />
                  <meshStandardMaterial 
                    color="#8b5cf6" 
                    metalness={0.9} 
                    roughness={0.1}
                    emissive="#7c3aed"
                    emissiveIntensity={0.2}
                  />
                </mesh>
                
                {/* Laser sight */}
                <mesh position={[0, 0.08, 0]}>
                  <cylinderGeometry args={[0.005, 0.005, 8, 4]} />
                  <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
                </mesh>
              </group>
            </ArmJoint>
          </ArmJoint>
        </ArmJoint>
      </ArmJoint>

      {/* Target sphere */}
      <TargetSphere position={armConfig.target} />
      
      {/* Grid floor */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0f172a" 
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
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 60 }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="bg-transparent"
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting Setup */}
          <ambientLight intensity={0.2} color="#4338ca" />
          
          {/* Key light */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            color="#ffffff"
          />
          
          {/* Fill lights */}
          <pointLight position={[-5, 5, 5]} intensity={0.4} color="#3b82f6" />
          <pointLight position={[5, 5, -5]} intensity={0.4} color="#8b5cf6" />
          <spotLight position={[0, 8, 0]} intensity={0.6} angle={0.6} penumbra={0.5} color="#06b6d4" />
          
          {/* Environment for reflections */}
          <Environment preset="studio" />
          
          {/* Robotic Arm */}
          <RoboticArm mousePosition={mousePosition} />
          
          {/* Enhanced ground shadows */}
          <ContactShadows
            opacity={0.6}
            scale={15}
            blur={2}
            far={20}
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
            maxDistance={15}
            minDistance={5}
            autoRotate={false}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
