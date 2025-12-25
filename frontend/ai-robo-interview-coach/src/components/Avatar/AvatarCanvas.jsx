import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AvatarModel from "./AvatarModel";

export default function AvatarCanvas({ state }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 3] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 2]} />

      <AvatarModel state={state} />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
