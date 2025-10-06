import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';

export const PostProcessing = ({
  strength = 1,
  threshold = 1,
}) => {
  const { gl, scene, camera } = useThree();

  const render = useMemo(() => {
    // 简化的后处理效果，使用基本的渲染
    return {
      render: () => {
        gl.render(scene, camera);
      }
    };
  }, [camera, gl, scene, strength, threshold]);

  useFrame(() => {
    render.render();
  }, 1);

  return null;
};
