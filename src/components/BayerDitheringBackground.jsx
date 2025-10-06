import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';

const BayerDitheringBackground = ({ 
  shape = 'diamond', 
  pixelSize = 3, 
  color = '#f6cf3e',
  className = '' 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  const SHAPE_MAP = {
    square: 0,
    circle: 1,
    triangle: 2,
    diamond: 3,
  };

  useEffect(() => {
    if (!mountRef.current) return;
    
    // 初始化WebGL

    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // 渲染器创建完成并添加到DOM

    // 创建uniforms
    const MAX_CLICKS = 10;
    const uniforms = {
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPE_MAP[shape] ?? 3 },
      uPixelSize: { value: pixelSize },
    };

    // 创建材质
    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    // 创建几何体和网格
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 点击涟漪效果
    let clickIx = 0;
    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const fx = (e.clientX - rect.left) * (window.innerWidth / rect.width);
      const fy = (rect.height - (e.clientY - rect.top)) * (window.innerHeight / rect.height);

      uniforms.uClickPos.value[clickIx].set(fx, fy);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    };

    renderer.domElement.addEventListener('pointerdown', handleClick);

    // 窗口大小调整
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 动画循环
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 清理函数
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        renderer.domElement.removeEventListener('pointerdown', handleClick);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && renderer.domElement.parentNode) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [shape, pixelSize, color]);

  return (
    <div 
      ref={mountRef} 
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default BayerDitheringBackground;
