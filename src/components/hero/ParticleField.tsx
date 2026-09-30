'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Interactive particle field: a rotating cloud of points tinted electric→cyan
 * that gently reacts to the pointer. Lightweight (single BufferGeometry, no
 * postprocessing) to keep it lazy-load-friendly.
 */
function Points({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = new THREE.Color('#3b82f6');
    const cB = new THREE.Color('#06b6d4');
    const cC = new THREE.Color('#7c3aed');
    for (let i = 0; i < count; i++) {
      // Distribute in a flattened sphere shell for depth.
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const c = t < 0.5 ? cA.clone().lerp(cB, t * 2) : cB.clone().lerp(cC, (t - 0.5) * 2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.06;
    // Ease toward pointer for parallax tilt.
    p.rotation.x += (pointer.y * 0.25 - p.rotation.x) * 0.04;
    p.rotation.z += (-pointer.x * 0.15 - p.rotation.z) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      dpr={[1, 1.6]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Points />
    </Canvas>
  );
}
