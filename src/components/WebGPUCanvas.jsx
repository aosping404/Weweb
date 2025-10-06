import { Canvas } from '@react-three/fiber';

export const WebGPUCanvas = (props) => {
  return (
    <Canvas
      {...props}
      flat
      camera={{ position: [0, 0, 1], fov: 75 }}
    >
      {props.children}
    </Canvas>
  );
};
