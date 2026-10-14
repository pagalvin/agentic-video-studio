import {Edges, Line} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {pillars} from './content';

const positions = pillars.map((_, index): [number, number, number] => {
  const angle = (index / pillars.length) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(angle) * 2.7, -1.2, Math.sin(angle) * 2.7];
});

export const PillarNetwork = ({active}: {active: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <ThreeCanvas
      width={920}
      height={760}
      camera={{position: [0, 6.5, 10.5], fov: 40}}
      gl={{alpha: true, antialias: true}}
      style={{width: 920, height: 760}}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 6, 5]} intensity={3} />
      <pointLight position={[0, 2, 0]} color="#2ee9d3" intensity={12} />
      <group rotation={[0, Math.sin(frame / 170) * 0.25, 0]}>
        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[3.8, 3.8, 0.16, 64]} />
          <meshStandardMaterial color="#0c2130" metalness={0.6} roughness={0.3} />
          <Edges color="#255169" />
        </mesh>
        <mesh position={[0, -1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.7, 0.025, 8, 80]} />
          <meshBasicMaterial color="#2ee9d3" />
        </mesh>
        {pillars.map((pillar, index) => {
          const reveal = spring({frame: frame - index * 10, fps, config: {damping: 18}});
          const selected = active === index || active === -1;
          const height = (selected ? 2.8 : 1.7) * reveal;
          const position = positions[index];
          const angle = (index / pillars.length) * Math.PI * 2;
          const pulseAngle = angle + frame / 45;
          return (
            <group key={pillar.title}>
              <Line
                points={[[0, -1.05, 0], [position[0], -1.05, position[2]]]}
                color={selected ? pillar.color : '#26445b'}
                lineWidth={selected ? 3 : 1}
              />
              <mesh position={[position[0], -1.1 + height / 2, position[2]]} scale={[1, Math.max(height, 0.001), 1]}>
                <boxGeometry args={[0.72, 1, 0.72]} />
                <meshStandardMaterial color={pillar.color} emissive={pillar.color} emissiveIntensity={selected ? 0.5 : 0.08} metalness={0.45} roughness={0.25} />
                <Edges color={selected ? '#ffffff' : pillar.color} />
              </mesh>
              <mesh position={[Math.cos(pulseAngle) * 2.7, -1.02, Math.sin(pulseAngle) * 2.7]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshBasicMaterial color={pillar.color} />
              </mesh>
              <mesh position={[position[0], height - 0.95, position[2]]} rotation={[Math.PI / 2, 0, frame / 70]}>
                <torusGeometry args={[0.63, 0.025, 8, 40]} />
                <meshBasicMaterial color={pillar.color} />
              </mesh>
            </group>
          );
        })}
        <mesh position={[0, 0.25, 0]} rotation={[frame / 80, frame / 100, 0]}>
          <icosahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial color="#e0ffff" emissive="#2ee9d3" emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
          <Edges color="#ffffff" />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
