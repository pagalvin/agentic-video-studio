import {useMemo} from 'react';
import {CatmullRomCurve3, Vector3} from 'three';

export const PourStream = ({start, end, frame, coffee = false}: {
  start: [number, number, number]; end: [number, number, number]; frame: number; coffee?: boolean;
}) => {
  const curve = useMemo(() => {
    const points = Array.from({length: 9}, (_, i) => {
      const t = i / 8;
      return new Vector3(
        start[0] + (end[0] - start[0]) * t + Math.sin(t * 15 + frame / 3) * 0.016 * Math.sin(t * Math.PI),
        start[1] + (end[1] - start[1]) * t,
        start[2] + (end[2] - start[2]) * t,
      );
    });
    return new CatmullRomCurve3(points);
  }, [start, end, frame]);
  const color = coffee ? '#6b3518' : '#add9e7';
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 24, coffee ? 0.045 : 0.038, 8, false]} />
        <meshStandardMaterial color={color} transparent opacity={coffee ? 0.92 : 0.72} roughness={0.12} metalness={0.1} />
      </mesh>
      {Array.from({length: 8}, (_, i) => {
        const phase = ((frame + i * 5) % 32) / 32;
        const angle = i * 2.4;
        return (
          <mesh key={i} position={[end[0] + Math.cos(angle) * phase * 0.24, end[1] + Math.sin(phase * Math.PI) * 0.18, end[2] + Math.sin(angle) * phase * 0.24]} scale={1 - phase * 0.8}>
            <sphereGeometry args={[0.028, 6, 6]} />
            <meshStandardMaterial color={color} transparent opacity={0.7 * (1 - phase)} />
          </mesh>
        );
      })}
      {[0, 1, 2].map((i) => {
        const phase = ((frame + i * 12) % 40) / 40;
        return (
          <mesh key={i} position={[end[0], end[1] + 0.012, end[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.04 + phase * 0.45, 0.05 + phase * 0.45, 32]} />
            <meshBasicMaterial color={color} transparent opacity={(1 - phase) * 0.45} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Steam = ({position, frame, strength = 1}: {
  position: [number, number, number]; frame: number; strength?: number;
}) => (
  <group position={position}>
    {Array.from({length: 10}, (_, i) => {
      const life = ((frame + i * 13) % 100) / 100;
      return (
        <mesh key={i} position={[Math.sin(life * 5 + i) * 0.13, life * 1.3, Math.cos(i * 2.4) * 0.1]} scale={[0.08 + life * 0.15, 0.14 + life * 0.22, 0.08 + life * 0.15]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#fff5e4" transparent opacity={Math.sin(life * Math.PI) * 0.07 * strength} depthWrite={false} />
        </mesh>
      );
    })}
  </group>
);
