"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import * as THREE from "three";

export default function RetroEnvironment() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "retro-futuristic";

  const { gridSpeed, sunColor } = useControls("Retro Environment", {
    gridSpeed: { value: 2.0, min: 0, max: 10 },
    sunColor: { value: "#ff7700" },
  }, { render: () => renderControls });

  const gridMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Sun Shader Material
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color("#ff7700") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          // Create gradient
          vec3 gradient = mix(vec3(1.0, 0.0, 0.5), uColor, vUv.y);

          // Create horizontal stripes
          float stripes = step(0.5, fract(vUv.y * 20.0 - 0.1));
          // Make bottom stripes wider
          float stripeWidth = vUv.y * 1.5;
          float variableStripes = step(stripeWidth, fract(vUv.y * 20.0));

          float alpha = vUv.y < 0.5 ? variableStripes : 1.0;

          // Make it circular if used on a plane
          float dist = distance(vUv, vec2(0.5));
          if (dist > 0.5) discard;

          gl_FragColor = vec4(gradient, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  // Update sun color when slider changes
  useEffect(() => {
    if (sunMaterial) {
      sunMaterial.uniforms.uColor.value.set(sunColor);
    }
  }, [sunColor, sunMaterial]);


  // Grid Shader Material
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xff00ff) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv * 20.0; // scale grid
          uv.y -= uTime; // move grid

          vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
          float line = min(grid.x, grid.y);

          float alpha = 1.0 - min(line, 1.0);

          // Fade out in distance
          float fade = smoothstep(1.0, 0.0, vUv.y);

          gl_FragColor = vec4(uColor, alpha * fade * 0.8);
        }
      `,
      transparent: true,
      wireframe: false,
    });
  }, []);

  useFrame((state, delta) => {
    if (gridMaterialRef.current) {
      gridMaterialRef.current.uniforms.uTime.value += delta * gridSpeed;
    }
  });

  return (
    <group>
      {/* Sun */}
      <mesh position={[0, 5, -20]}>
        <planeGeometry args={[20, 20]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Moving Grid Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <primitive ref={gridMaterialRef} object={gridMaterial} attach="material" />
      </mesh>
    </group>
  );
}
