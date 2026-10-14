import {Edges} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
import {story} from './story';

export const WorkflowScene = ({step}: {step: number}) => {
  const frame = useCurrentFrame();

  return (
    <ThreeCanvas
      width={860}
      height={660}
      camera={{position: [0, 1.5, 10], fov: 42}}
      style={{width: 860, height: 660}}
      gl={{alpha: true, antialias: true}}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} intensity={3} />
      <group rotation={[0.18, Math.sin(frame / 120) * 0.22, -0.08]}>
        {story.map((scene, index) => {
          const x = (index % 3 - 1) * 2.4;
          const y = index < 3 ? 1.4 : -1.4;
          const active = index === step;
          const scale = active ? 1.12 + Math.sin(frame / 12) * 0.04 : 0.85;
          return (
            <mesh
              key={scene.label}
              position={[x, y, active ? 0.5 : 0]}
              rotation={[frame / 180, frame / 150 + index * 0.3, 0]}
              scale={scale}
            >
              <boxGeometry args={[1.3, 1.3, 1.3]} />
              <meshStandardMaterial
                color={scene.color}
                emissive={scene.color}
                emissiveIntensity={active ? 0.35 : 0.04}
                roughness={0.35}
                metalness={0.25}
              />
              <Edges color={active ? '#ffffff' : '#334155'} />
            </mesh>
          );
        })}
        <mesh position={[0, 0, -0.4]}>
          <torusGeometry args={[2.9, 0.025, 8, 80]} />
          <meshStandardMaterial color={story[step].color} />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
