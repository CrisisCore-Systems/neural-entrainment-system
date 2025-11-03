/**
 * Neural Visualization v2.0 - Sacred Geometry & Audio-Reactive WebGL
 * Synchronized with audio at 60 FPS with post-processing effects
 * Features: Flower of Life, Metatron's Cube, Sri Yantra, Merkaba, Fibonacci Spirals
 */

import { useRef, useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSessionStore } from '../store/sessionStore';
const LazyPostProcessingEffects = lazy(() => import('./PostProcessingEffects'));
import { audioService } from '../services/audioService';
import * as THREE from 'three';
import {
  generateFlowerOfLife,
  generateMetatronsCube,
  generateSriYantra,
  generateMerkaba,
  generateSeedOfLife,
  generateFibonacciSpiral,
} from '../utils/sacredGeometry';

// Audio-reactive hook - connects visual engine to audio service
function useAudioReactivity() {
  const audioDataRef = useRef({
    averageFrequency: 0,
    bass: 0,
    mid: 0,
    treble: 0,
  });

  useFrame(() => {
    const data = audioService.getFrequencyData();
    if (data && data.length > 0) {
      // Calculate average frequency
      const avg = Array.from(data).reduce((a, b) => a + b, 0) / data.length;
      audioDataRef.current.averageFrequency = avg / 255;
      
      // Split into frequency bands
      const third = Math.floor(data.length / 3);
      const bassData = data.slice(0, third);
      const midData = data.slice(third, third * 2);
      const trebleData = data.slice(third * 2);
      
      audioDataRef.current.bass = Array.from(bassData).reduce((a, b) => a + b, 0) / bassData.length / 255;
      audioDataRef.current.mid = Array.from(midData).reduce((a, b) => a + b, 0) / midData.length / 255;
      audioDataRef.current.treble = Array.from(trebleData).reduce((a, b) => a + b, 0) / trebleData.length / 255;
    }
  });

  return audioDataRef;
}

// Phase 1: Seed of Life - Sacred circles for calibration
function SacredSeedOfLife() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const lineGeometry = useMemo(() => {
    const pattern = generateSeedOfLife(1.5);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x, v.y, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    // Audio-reactive pulsing
    const audio = audioData.current;
    const scale = 1 + audio.averageFrequency * 0.3 + Math.sin(timeRef.current * 2) * 0.1;
    groupRef.current.scale.setScalar(scale);
    
    // Gentle rotation with bass response
    groupRef.current.rotation.z = timeRef.current * 0.2 + audio.bass * 0.5;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.8} />
      </lineSegments>
      
      {/* Center glow sphere */}
      <mesh>
        <sphereGeometry args={[0.15 + audioData.current.averageFrequency * 0.2, 32, 32]} />
        <meshBasicMaterial color="#20d48a" transparent opacity={0.7 + audioData.current.treble * 0.3} />
      </mesh>
    </group>
  );
}

// Phase 2: Flower of Life - Expanding sacred pattern
function SacredFlowerOfLife() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const lineGeometry = useMemo(() => {
    const pattern = generateFlowerOfLife(2, 0.8);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x, v.y, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    const audio = audioData.current;
    
    // Breathing expansion
    const breathe = 1 + Math.sin(timeRef.current * 1.5) * 0.15 + audio.mid * 0.2;
    groupRef.current.scale.setScalar(breathe);
    
    // Slow rotation
    groupRef.current.rotation.z = timeRef.current * 0.3;
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.75} />
      </lineSegments>
      
      {/* Particle burst on bass hits */}
      {audioData.current.bass > 0.6 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 4))}
              itemSize={3}
              args={[new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 4)), 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.05} color="#00cc99" transparent opacity={audioData.current.bass} />
        </points>
      )}
    </group>
  );
}

// Phase 3: Fibonacci Spiral - Golden ratio vortex
function SacredFibonacciSpiral() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const spiralGeometry = useMemo(() => {
    const pattern = generateFibonacciSpiral(4, 200);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x * 0.3, v.y * 0.3, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    const audio = audioData.current;
    
    // Spiral rotation with audio
    groupRef.current.rotation.z = timeRef.current * 0.5 + audio.mid * 2;
    
    // Depth pulsing
    groupRef.current.position.z = Math.sin(timeRef.current) * 0.5 + audio.bass * 0.3;
  });

  return (
    <group ref={groupRef}>
      {/* @ts-expect-error - line component accepts geometry prop */}
      <line geometry={spiralGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.9} linewidth={2} />
      </line>
      
      {/* Trailing particles along spiral */}
      <points geometry={spiralGeometry}>
        <pointsMaterial
          size={0.03 + audioData.current.treble * 0.02}
          vertexColors
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Phase 4: Metatron's Cube - All Platonic solids contained
function SacredMetatronsCube() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const cubeGeometry = useMemo(() => {
    const pattern = generateMetatronsCube(1.2);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x, v.y, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    const audio = audioData.current;
    
    // Complex 3D rotation
    groupRef.current.rotation.x = timeRef.current * 0.2 + audio.bass * 0.3;
    groupRef.current.rotation.y = timeRef.current * 0.3 + audio.mid * 0.3;
    groupRef.current.rotation.z = timeRef.current * 0.1 + audio.treble * 0.3;
    
    // Scale pulse
    const scale = 1 + audio.averageFrequency * 0.2;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={cubeGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.8 + audioData.current.mid * 0.2} />
      </lineSegments>
      
      {/* 13 glowing spheres at intersection points */}
      {[...Array(13)].map((_, i) => {
        const angle = (i / 13) * Math.PI * 2;
        const radius = i === 0 ? 0 : i < 7 ? 1.2 : 2.4;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(i / 13, 0.9, 0.6)}
              transparent
              opacity={0.7 + audioData.current.treble * 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Phase 5: Sri Yantra - Cosmic mandala at peak coherence
function SacredSriYantra() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const yantraGeometry = useMemo(() => {
    const pattern = generateSriYantra(2);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x, v.y, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    const audio = audioData.current;
    
    // Slow, hypnotic rotation
    groupRef.current.rotation.z = timeRef.current * 0.4;
    
    // Breathing scale with high coherence
    const breathe = 1 + Math.sin(timeRef.current * 2) * 0.1 + audio.averageFrequency * 0.3;
    groupRef.current.scale.setScalar(breathe);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={yantraGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85 + audioData.current.mid * 0.15}
          linewidth={1.5}
        />
      </lineSegments>
      
      {/* Central bindu point */}
      <mesh>
        <sphereGeometry args={[0.05 + audioData.current.averageFrequency * 0.1, 32, 32]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ff6600" 
          emissiveIntensity={1 + audioData.current.treble} 
        />
      </mesh>
      
      {/* Outer rings */}
      {[1, 1.5, 2, 2.5].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL((i / 4 + timeRef.current * 0.1) % 1, 0.8, 0.5)}
            transparent
            opacity={0.4 + audioData.current.bass * 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

// Phase 6: Merkaba - Star tetrahedron return integration
function SacredMerkaba() {
  const groupRef = useRef<THREE.Group>(null);
  const audioData = useAudioReactivity();
  const timeRef = useRef(0);

  const merkabaGeometry = useMemo(() => {
    const pattern = generateMerkaba(1.5);
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(pattern.vertices.flatMap(v => [v.x, v.y, v.z]));
    const colors = new Float32Array(pattern.colors!.flatMap(c => [c.r, c.g, c.b]));
    
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geom;
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    
    const audio = audioData.current;
    
    // Counter-rotating tetrahedrons
    groupRef.current.rotation.x = timeRef.current * 0.5 + audio.mid * 0.5;
    groupRef.current.rotation.y = -timeRef.current * 0.3 + audio.bass * 0.5;
    
    // Gentle pulsing
    const scale = 1 + Math.sin(timeRef.current * 1.5) * 0.1 + audio.averageFrequency * 0.15;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={merkabaGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.75 + audioData.current.mid * 0.25} linewidth={2} />
      </lineSegments>
      
      {/* Energy field glow */}
      <mesh>
        <octahedronGeometry args={[2 + audioData.current.bass * 0.5, 0]} />
        <meshBasicMaterial color="#9933ff" wireframe transparent opacity={0.2 + audioData.current.treble * 0.2} />
      </mesh>
    </group>
  );
}

// Main visualization component with post-processing
export const NeuralVisualization: React.FC = () => {
  const { visualEnabled, sessionActive, currentPhase } = useSessionStore();
  const [postFXReady, setPostFXReady] = useState(false);
  const [preferModels] = useState(true); // toggle to prefer 3D models when available

  // Defer post-processing until after the first painted frame
  useEffect(() => {
    const id = requestAnimationFrame(() => setPostFXReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visualEnabled) {
    return (
      <div className="visualization-disabled" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        color: 'rgba(255,255,255,0.5)'
      }}>
        <p>Visual entrainment disabled</p>
      </div>
    );
  }

  // Select sacred geometry (procedural fallback) based on current phase
  const renderSacredGeometry = () => {
    if (!sessionActive) {
      return <SacredSeedOfLife />;
    }

    switch (currentPhase) {
      case 0: // Neural Calibration
        return <SacredSeedOfLife />;
      case 1: // Resonance Field
        return <SacredFlowerOfLife />;
      case 2: // Depth Descent
        return <SacredFibonacciSpiral />;
      case 3: // Integration Matrix
        return <SacredMetatronsCube />;
      case 4: // Peak Coherence
        return <SacredSriYantra />;
      case 5: // Return Integration
        return <SacredMerkaba />;
      default:
        return <SacredSeedOfLife />;
    }
  };

  // 3D model-based sacred geometry (requires .glb files in /public/models)
  // (reserved) renderSacredModels helper removed; we render models via SceneRouter

  return (
    <div className="neural-visualization" style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6699ff" />
        
        {/* Sacred geometry visualization: prefer models, fallback to procedural */}
        {preferModels ? (
          <Suspense fallback={renderSacredGeometry()}>
            <SceneRouter currentPhase={sessionActive ? currentPhase : 0} />
          </Suspense>
        ) : (
          renderSacredGeometry()
        )}
        
        {/* Post-processing effects (deferred and code-split) */}
        {postFXReady && (
          <Suspense fallback={null}>
            <LazyPostProcessingEffects />
          </Suspense>
        )}

        {/* HUD inside Canvas using drei Html */}
        <Html fullscreen>
          {sessionActive && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.3,
                pointerEvents: 'none'
              }}
            >
              Phase {currentPhase + 1}/6 · Sacred Geometry Active
            </div>
          )}
        </Html>
        </Suspense>
      </Canvas>
    </div>
  );
};

// Small router that renders a specific model component by name without early binding
type SacredModelComp = React.ComponentType<unknown>;
type SacredModelModule = {
  ModelSeedOfLife: SacredModelComp;
  ModelFlowerOfLife: SacredModelComp;
  ModelFibonacci: SacredModelComp;
  ModelMetatron: SacredModelComp;
  ModelSriYantra: SacredModelComp;
  ModelMerkaba: SacredModelComp;
};

function SceneRouter({ currentPhase }: { currentPhase: number }) {
  // Late import to avoid pulling named exports before the chunk loads
  const [mods, setMods] = useState<SacredModelModule | null>(null);
  useEffect(() => {
    let mounted = true;
    import('./SacredModels').then((m) => { if (mounted) setMods(m as unknown as SacredModelModule); });
    return () => { mounted = false; };
  }, []);

  if (!mods) return null;

  // Map phase -> model component
  switch (currentPhase) {
    case 0: return <mods.ModelSeedOfLife />;
    case 1: return <mods.ModelFlowerOfLife />;
    case 2: return <mods.ModelFibonacci />;
    case 3: return <mods.ModelMetatron />;
    case 4: return <mods.ModelSriYantra />;
    case 5: return <mods.ModelMerkaba />;
    default: return <mods.ModelSeedOfLife />;
  }
}
