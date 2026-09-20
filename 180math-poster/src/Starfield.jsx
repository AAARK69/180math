import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Starfield() {
  const starsRef = useRef();
  const count = 3000;

  const [initialData] = useState(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    const color1 = new THREE.Color('#ffffff'); // white
    const color2 = new THREE.Color('#88ccff'); // light blue
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50;

      tempColor.lerpColors(color1, color2, Math.random());
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;

      sizes[i] = Math.random() * 2.0;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.05 + 0.01;
    }

    return { positions, colors, sizes, phases, speeds };
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={initialData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={initialData.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={count}
          array={initialData.phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={count}
          array={initialData.speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          attribute float size;
          attribute float phase;
          attribute float speed;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            vAlpha = 0.5 + 0.5 * sin(time * speed * 20.0 + phase);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            float strength = (0.5 - r) * 2.0;
            gl_FragColor = vec4(vColor, vAlpha * strength);
          }
        `}
      />
    </points>
  );
}

export function ShootingStars() {
  const count = 10;
  const meshRef = useRef();

  const [data] = useState(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const delays = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100 + 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100 + 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 25;

      speeds[i] = Math.random() * 5 + 20;
      delays[i] = Math.random() * 20;
    }

    return { positions, speeds, delays };
  });

  // Store mutable runtime state out of react rendering
  const delaysRef = useRef(data.delays);
  const speedsRef = useRef(data.speeds);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array;
    const delays = delaysRef.current;
    const speeds = speedsRef.current;

    for (let i = 0; i < count; i++) {
      delays[i] -= delta;

      if (delays[i] <= 0) {
        pos[i * 3] -= speeds[i] * delta;
        pos[i * 3 + 1] -= speeds[i] * delta;

        if (pos[i * 3] < -100 || pos[i * 3 + 1] < -100) {
           pos[i * 3] = (Math.random() - 0.5) * 100 + 50;
           pos[i * 3 + 1] = (Math.random() - 0.5) * 100 + 50;
           pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 25;
           delays[i] = Math.random() * 10;
        }
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="white" transparent opacity={0.8} />
    </points>
  );
}
