"use client";

import { useControls } from "leva";
import { useToolStore } from "@/store/useToolStore";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const snoise = `
// Simplex 3D Noise
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0 );
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

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

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

export default function LiquidMetalTool() {
  const activeSidebarTab = useToolStore(s => s.activeSidebarTab);
  const renderControls = activeSidebarTab === "liquid-metal";

  const { roughness, metalness, color, speed } = useControls("Liquid Metal", {
    roughness: { value: 0.1, min: 0, max: 1 },
    metalness: { value: 1, min: 0, max: 1 },
    color: { value: "#c0c0c0" },
    speed: { value: 1, min: 0, max: 5 }
  }, { render: () => renderControls });

  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderRef = useRef<any>(null);

  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uSpeed.value = speed;
    }
  }, [speed]);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onBeforeCompile = (shader: any) => {
    shaderRef.current = shader;
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uSpeed = { value: speed };

    shader.vertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      ${snoise}

      vec3 orthogonal(vec3 v) {
        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
      }
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <beginnormal_vertex>',
      `
      #include <beginnormal_vertex>

      float eps = 0.01;
      vec3 tangent = orthogonal(objectNormal);
      vec3 bitangent = normalize(cross(objectNormal, tangent));

      vec3 p = position;
      vec3 pA = position + tangent * eps;
      vec3 pB = position + bitangent * eps;

      float noiseFreq = 2.0;
      float noiseAmp = 0.2;

      float h = snoise(p * noiseFreq + uTime * uSpeed) * noiseAmp;
      float hA = snoise(pA * noiseFreq + uTime * uSpeed) * noiseAmp;
      float hB = snoise(pB * noiseFreq + uTime * uSpeed) * noiseAmp;

      vec3 displaced = p + objectNormal * h;
      vec3 displacedA = pA + objectNormal * hA;
      vec3 displacedB = pB + objectNormal * hB;

      objectNormal = normalize(cross(displacedA - displaced, displacedB - displaced));
      `
    );

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      vec3 transformed = displaced;
      `
    );
  };

  return (
    <meshStandardMaterial 
      ref={materialRef}
      color={color} 
      roughness={roughness} 
      metalness={metalness}
      envMapIntensity={2}
      onBeforeCompile={onBeforeCompile}
      customProgramCacheKey={() => 'liquid-metal-shader'}
    />
  );
}
