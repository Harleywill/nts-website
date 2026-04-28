"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ColorBends.css";

const MAX_COLORS = 8;

const frag = `
uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec3 uColors[8];
uniform int uColorCount;
uniform float uRotation;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;

varying vec2 vUv;

float hash(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

float perlin(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float n00 = hash(i + vec2(0.0, 0.0));
  float n10 = hash(i + vec2(1.0, 0.0));
  float n01 = hash(i + vec2(0.0, 1.0));
  float n11 = hash(i + vec2(1.0, 1.0));
  
  float nx0 = mix(n00, n10, f.x);
  float nx1 = mix(n01, n11, f.x);
  return mix(nx0, nx1, f.y);
}

void main() {
  vec2 uv = vUv;
  
  // Apply rotation
  float angle = uRotation * 3.14159 / 180.0;
  vec2 center = vec2(0.5, 0.5);
  uv -= center;
  uv = vec2(
    cos(angle) * uv.x - sin(angle) * uv.y,
    sin(angle) * uv.x + cos(angle) * uv.y
  );
  uv += center;
  
  // Apply scale
  uv = (uv - 0.5) / uScale + 0.5;
  
  // Warp with noise
  float noise = perlin(uv * uFrequency + uTime * 0.5) * uWarpStrength;
  uv += noise * 0.1;
  
  // Create wave pattern
  float wave = sin(uv.x * 10.0 + uTime) * 0.5 + 0.5;
  wave *= sin(uv.y * 10.0 + uTime * 0.7) * 0.5 + 0.5;
  
  // Determine color based on wave pattern
  vec3 color = vec3(0.0);
  if (uColorCount > 0) {
    int idx = int(mod(wave * float(uColorCount), float(uColorCount)));
    color = uColors[idx];
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

interface ColorBendsProps {
  className?: string;
  style?: React.CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
}

export default function ColorBends({
  className,
  style,
  rotation = 90,
  speed = 0.2,
  colors = [],
  transparent = true,
  autoRotate = 0,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
}: ColorBendsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    rendererRef.current = renderer;

    // Convert colors to THREE.Color objects
    const threeColors = colors.slice(0, MAX_COLORS).map((c) => new THREE.Color(c));
    while (threeColors.length < MAX_COLORS) {
      threeColors.push(new THREE.Color(0x000000));
    }

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uResolution: { value: new THREE.Vector2(width, height) },
        uTime: { value: 0 },
        uTexture: { value: null },
        uColors: { value: threeColors },
        uColorCount: { value: Math.min(colors.length, MAX_COLORS) },
        uRotation: { value: rotation },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
      },
    });

    materialRef.current = material;

    // Create geometry and mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += speed;

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = time;
        if (autoRotate !== 0) {
          materialRef.current.uniforms.uRotation.value =
            rotation + time * autoRotate;
        }
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = canvasRef.current?.clientWidth || width;
      const newHeight = canvasRef.current?.clientHeight || height;

      renderer.setSize(newWidth, newHeight);
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value = new THREE.Vector2(
          newWidth,
          newHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [rotation, speed, colors, transparent, autoRotate, scale, frequency, warpStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", ...style }}
    />
  );
}
