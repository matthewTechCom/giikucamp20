import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface ModelProps {
  url: string;
  scale: number;
  position: number[];
  rotation: number[];
}

const Model = ({ url, scale, position, rotation }: ModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // モデルの中心を計算して、シーンを中心に合わせる
  useEffect(() => {
    // シーン全体のバウンディングボックスを計算
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    // シーン内の全てのオブジェクトがこの中心を原点に持つようにオフセット
    scene.position.x -= center.x;
    scene.position.y -= center.y;
    scene.position.z -= center.z;
  }, [scene]);

  // 毎フレームごとにグループを上下に揺らし、回転させる
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.4;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </group>
  );
};

export const ThreeModel = () => {
  return (
    <motion.div
      initial={{ x: 150, opacity: 1 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        duration: 0.8,
        delay: 0.9,
        stiffness: 200,
      }}
      className="w-full h-[500px]"
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={3.5} />
        <Model
          url="/models/scene.gltf"
          scale={0.1}
          position={[0, -3, 0]}
          rotation={[Math.PI / 10, 0, Math.PI / 6]}
        />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </motion.div>
  );
};
