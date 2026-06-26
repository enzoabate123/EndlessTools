"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Define the shader material
const ColorFlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#ff0000"),
    uColorB: new THREE.Color("#00ff00"),
    uColorC: new THREE.Color("#0000ff"),
    uNoiseScale: 1.0,
    uSpeed: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uNoiseScale;
    uniform float uSpeed;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex 3D Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

      // Permutations
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients
      float n_ = 0.142857142857; // 1.0/7.0
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Noise coordinates
      vec3 noiseCoord = vPosition * uNoiseScale + uTime * uSpeed;

      // Calculate noise (-1 to 1)
      float n = snoise(noiseCoord);

      // Map noise to 0-1
      float pattern = n * 0.5 + 0.5;

      // Mix colors based on the pattern
      vec3 color = mix(uColorA, uColorB, smoothstep(0.0, 0.5, pattern));
      color = mix(color, uColorC, smoothstep(0.5, 1.0, pattern));

      gl_FragColor = vec4(color, 1.0);

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

// Register the material with R3F
extend({ ColorFlowMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colorFlowMaterial: any;
  }
}

export default function ColorFlowTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "color-flow";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);

  const { colorA, colorB, colorC, noiseScale, speed } = useControls("Color Flow", {
    colorA: { value: "#ffb6c1" }, // Soft pink
    colorB: { value: "#87ceeb" }, // Sky blue
    colorC: { value: "#e6e6fa" }, // Lavender
    noiseScale: { value: 1.5, min: 0.1, max: 10, step: 0.1 },
    speed: { value: 0.5, min: 0.0, max: 2.0, step: 0.01 }
  }, { render: () => renderControls });

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <colorFlowMaterial
      ref={materialRef}
      uColorA={new THREE.Color(colorA)}
      uColorB={new THREE.Color(colorB)}
      uColorC={new THREE.Color(colorC)}
      uNoiseScale={noiseScale}
      uSpeed={speed}
      transparent={false}
      depthWrite={true}
    />
  );
}
