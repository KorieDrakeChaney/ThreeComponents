import { Canvas, Props } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { PropsWithChildren } from "react";
import { Vector3 } from "three";

type SceneProps = PropsWithChildren<
  Props & {
    cameraFov?: number;
    cameraPosition?: Vector3;
    lights?: boolean;
    controls?: boolean;
  }
>;

const Scene = ({
  children,
  cameraFov = 75,
  cameraPosition = new Vector3(0, 0, 10),
  controls = true,
  lights = true,
  ...props
}: SceneProps) => {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: cameraFov }}
      {...props}
    >
      {children}
      {lights && (
        <>
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[0, 6, 0]} />
        </>
      )}
      {controls && <OrbitControls />}
      <Preload all />
    </Canvas>
  );
};

export default Scene;
