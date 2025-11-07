import React, { Suspense } from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export type ModelProps = {
  url: string;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  toneMapped?: boolean;
  color?: string;
  fallback?: React.ReactNode;
};

class ModelBoundary extends React.Component<React.PropsWithChildren<{ fallback?: React.ReactNode }>, { err: unknown | null }> {
  state = { err: null as unknown | null };
  static getDerivedStateFromError(err: unknown) { return { err }; }
  render() {
    if (this.state.err) {
      return this.props.fallback ?? null;
    }
    return this.props.children as React.ReactElement;
  }
}

function ModelCore({ url, scale = 1, position = [0,0,0], rotation = [0,0,0], autoRotate = true, toneMapped = true, color }: ModelProps) {
  const { scene } = useGLTF(url, true);
  const ref = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    if (autoRotate) {
      ref.current.rotation.y += delta * 0.2;
    }
  });

  // Optional color override
  if (color) {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = (obj as THREE.Mesh).material as THREE.Material & { color?: THREE.Color };
        if (m && m.color) {
          m.color = new THREE.Color(color);
        }
      }
    });
  }

  // Ensure toneMapping
  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mat = (obj as THREE.Mesh).material as THREE.Material & { toneMapped?: boolean };
      if (mat && typeof mat.toneMapped === 'boolean') {
        mat.toneMapped = toneMapped;
      }
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale as number | [number, number, number]}>
      <primitive object={scene} />
    </group>
  );
}

export function SacredModel(props: ModelProps) {
  const { fallback } = props;
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback ?? null}>
        <ModelCore {...props} />
      </Suspense>
    </ModelBoundary>
  );
}

// Convenience wrappers (can be customized per shape)
export const ModelSeedOfLife = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/seed_of_life.glb'} scale={p.scale ?? 1.4} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelTreeOfLife = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/tree_of_life.glb'} scale={p.scale ?? 1.5} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelFlowerOfLife = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/flower-of-life.glb'} scale={p.scale ?? 1.8} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelFibonacci = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/fibonacci-spiral.glb'} scale={p.scale ?? 1.6} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelMetatron = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/metatrons-cube.glb'} scale={p.scale ?? 1.4} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelSriYantra = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/sri-yantra.glb'} scale={p.scale ?? 1.4} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);
export const ModelMerkaba = (p: Partial<ModelProps>) => (
  <SacredModel url={p.url ?? '/models/merkaba.glb'} scale={p.scale ?? 1.6} position={p.position ?? [0,0,0]} color={p.color} fallback={p.fallback} />
);

useGLTF.preload('/models/seed_of_life.glb');
useGLTF.preload('/models/tree_of_life.glb');
useGLTF.preload('/models/flower-of-life.glb');
useGLTF.preload('/models/fibonacci-spiral.glb');
useGLTF.preload('/models/metatrons-cube.glb');
useGLTF.preload('/models/sri-yantra.glb');
useGLTF.preload('/models/merkaba.glb');
