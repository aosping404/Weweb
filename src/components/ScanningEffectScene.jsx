import { useAspect, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';

const WIDTH = 1600;
const HEIGHT = 900;

const ScanningEffectScene = () => {
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState(new THREE.Vector2(0, 0));
  
  const [rawMap, depthMap, edgeMap] = useTexture([
    '/assets/raw-2.png',
    '/assets/depth-2.png', 
    '/assets/edge-2.png'
  ]);

  const material = useMemo(() => {
    if (!rawMap || !depthMap || !edgeMap) return null;

    const strength = 0.01;

    // 创建着色器材质
    return new THREE.ShaderMaterial({
      uniforms: {
        uPointer: { value: pointer },
        uProgress: { value: progress },
        tRawMap: { value: rawMap },
        tDepthMap: { value: depthMap },
        tEdgeMap: { value: edgeMap },
        uStrength: { value: strength }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 uPointer;
        uniform float uProgress;
        uniform sampler2D tRawMap;
        uniform sampler2D tDepthMap;
        uniform sampler2D tEdgeMap;
        uniform float uStrength;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          
          // 获取深度图
          vec4 depthSample = texture2D(tDepthMap, uv);
          float depth = depthSample.r;
          
          // 获取边缘图
          vec4 edgeSample = texture2D(tEdgeMap, uv);
          float edge = edgeSample.r;
          
          // 计算流动效果
          vec2 offset = uPointer * uStrength;
          vec2 distortedUv = uv + offset * depth;
          
          // 获取原始纹理
          vec4 rawSample = texture2D(tRawMap, distortedUv);
          
          // 计算扫描线效果
          float flow = 1.0 - smoothstep(0.0, 0.02, abs(depth - uProgress));
          
          // 创建遮罩
          vec3 mask = (1.0 - edge) * flow * vec3(10.0, 0.4, 10.0);
          
          // 混合颜色
          vec3 finalColor = rawSample.rgb * 0.5 + mask;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });
  }, [rawMap, depthMap, edgeMap, pointer, progress]);

  // 使用响应式尺寸，确保适应屏幕
  const [w, h] = useAspect(WIDTH, HEIGHT);

  // 动画进度
  useGSAP(() => {
    gsap.to({ value: 0 }, {
      value: 1,
      repeat: -1,
      duration: 3,
      ease: 'power1.out',
      onUpdate: function() {
        setProgress(this.targets()[0].value);
      }
    });
  }, []);

  useFrame(({ pointer }) => {
    setPointer(pointer);
  });

  if (!material) return null;

  return (
    <mesh scale={[w, h, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export default ScanningEffectScene;
