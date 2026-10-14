import {useMemo} from 'react';
import {CatmullRomCurve3, DoubleSide, Vector2, Vector3} from 'three';

const steel = {color: '#c4ccd0', metalness: 0.82, roughness: 0.24};

export const Rod = ({from, to, radius = 0.055, color = '#c4ccd0'}: {
  from: [number, number, number]; to: [number, number, number]; radius?: number; color?: string;
}) => {
  const curve = useMemo(() => new CatmullRomCurve3([new Vector3(...from), new Vector3(...to)]), [from, to]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 1, radius, 8, false]} />
      <meshStandardMaterial {...steel} color={color} />
    </mesh>
  );
};

export const Bean = ({position, scale = 1, rotation = 0}: {position: [number, number, number]; scale?: number; rotation?: number}) => (
  <group position={position} rotation={[0.4, rotation, 0.6]} scale={scale}>
    <mesh scale={[0.1, 0.07, 0.15]}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#59301e" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.055, 0.01, 4, 12, Math.PI]} />
      <meshStandardMaterial color="#26130c" />
    </mesh>
  </group>
);

export const Cup = ({fill = 0}: {fill?: number}) => {
  const profile = useMemo(() => [
    new Vector2(0.01, 0.05), new Vector2(0.43, 0.05), new Vector2(0.53, 0.13),
    new Vector2(0.62, 0.82), new Vector2(0.63, 0.87), new Vector2(0.57, 0.87),
    new Vector2(0.56, 0.8), new Vector2(0.47, 0.15), new Vector2(0.01, 0.15),
  ], []);
  return (
    <group>
      <mesh>
        <latheGeometry args={[profile, 48]} />
        <meshStandardMaterial color="#fff9e9" roughness={0.22} side={DoubleSide} />
      </mesh>
      <mesh position={[0.68, 0.48, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.85, 1, 1]}>
        <torusGeometry args={[0.29, 0.075, 10, 32]} />
        <meshStandardMaterial color="#fff9e9" roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.95, 0.88, 0.06, 48]} />
        <meshStandardMaterial color="#fff9e9" roughness={0.3} />
      </mesh>
      {fill > 0 && (
        <mesh position={[0, 0.16 + fill * 0.57, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.46 + fill * 0.09, 40]} />
          <meshStandardMaterial color="#392013" roughness={0.16} />
        </mesh>
      )}
    </group>
  );
};

export const Press = ({cutaway = false, fill = 0, grounds = 0, plunge = 0, lid = true, lidLift = 0, brewed = false}: {
  cutaway?: boolean; fill?: number; grounds?: number; plunge?: number; lid?: boolean; lidLift?: number; brewed?: boolean;
}) => {
  const liquidHeight = Math.max(0.01, fill * 1.95);
  return (
    <group>
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 2.4, 64, 1, true, cutaway ? Math.PI / 2 : 0, cutaway ? Math.PI : Math.PI * 2]} />
        <meshStandardMaterial {...steel} side={DoubleSide} />
      </mesh>
      {[0.07, 2.45].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 8, 64]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.7, 0.65, 0.12, 48]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <Rod from={[0.65, 2.18, 0]} to={[1.12, 2.18, 0]} radius={0.07} />
      <Rod from={[1.12, 0.52, 0]} to={[1.12, 2.3, 0]} radius={0.09} />
      <Rod from={[0.65, 0.55, 0]} to={[1.12, 0.55, 0]} radius={0.05} />
      <mesh position={[-0.7, 2.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.22, 0.4, 4]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {grounds > 0 && (
        <mesh position={[0, 0.17 + grounds * 0.1, 0]}>
          <cylinderGeometry args={[0.64, 0.64, grounds * 0.2, 40]} />
          <meshStandardMaterial color="#321c12" roughness={1} />
        </mesh>
      )}
      {fill > 0 && (
        <mesh position={[0, 0.3 + liquidHeight / 2, 0]}>
          <cylinderGeometry args={[0.63, 0.63, liquidHeight, 48]} />
          <meshStandardMaterial color={brewed ? '#4c2814' : '#9a6735'} transparent opacity={0.82} roughness={0.2} />
        </mesh>
      )}
      {lid && (
        <group position={[0, lidLift, 0]}>
          <mesh position={[0, 2.48, 0]}>
            <cylinderGeometry args={[0.74, 0.7, 0.12, 48]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <Rod from={[0, 2.22 - plunge * 1.72, 0]} to={[0, 4.28 - plunge * 1.72, 0]} radius={0.035} />
          <mesh position={[0, 2.2 - plunge * 1.72, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.07, 48]} />
            <meshStandardMaterial color="#50595c" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 4.31 - plunge * 1.72, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
            <meshStandardMaterial {...steel} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const Kettle = () => (
  <group>
    <mesh position={[0, 0.7, 0]} scale={[0.72, 0.75, 0.72]}>
      <sphereGeometry args={[1, 40, 24]} />
      <meshStandardMaterial {...steel} />
    </mesh>
    <mesh position={[0, 1.25, 0]}>
      <cylinderGeometry args={[0.38, 0.43, 0.1, 32]} />
      <meshStandardMaterial {...steel} />
    </mesh>
    <mesh position={[0, 1.36, 0]}>
      <sphereGeometry args={[0.1, 16, 12]} />
      <meshStandardMaterial color="#26282a" />
    </mesh>
    <Rod from={[0.47, 0.55, 0]} to={[0.95, 0.9, 0]} radius={0.12} />
    <Rod from={[0.95, 0.9, 0]} to={[1.25, 1.3, 0]} radius={0.085} />
    <mesh position={[1.25, 1.31, 0]}>
      <cylinderGeometry args={[0.072, 0.072, 0.03, 20]} />
      <meshStandardMaterial color="#141a1b" />
    </mesh>
    <mesh position={[-0.72, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, 1.4, 1]}>
      <torusGeometry args={[0.35, 0.065, 10, 32]} />
      <meshStandardMaterial color="#22282b" roughness={0.55} />
    </mesh>
  </group>
);

export const Grinder = ({frame, cutaway = false}: {frame: number; cutaway?: boolean}) => (
  <group>
    <mesh position={[0, cutaway ? 0.45 : 0.7, 0]}>
      <boxGeometry args={[1.1, cutaway ? 0.9 : 1.4, 0.95]} />
      <meshStandardMaterial color="#25302f" metalness={0.45} roughness={0.4} />
    </mesh>
    {cutaway && (
      <>
        <mesh position={[0, 1.14, -0.4]}>
          <boxGeometry args={[1.1, 0.5, 0.15]} />
          <meshStandardMaterial color="#25302f" metalness={0.45} roughness={0.4} />
        </mesh>
        <Rod from={[-0.48, 0.9, 0]} to={[-0.48, 1.42, 0]} radius={0.035} />
        <Rod from={[0.48, 0.9, 0]} to={[0.48, 1.42, 0]} radius={0.035} />
        <mesh position={[0, 1.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.045, 8, 24]} />
          <meshStandardMaterial {...steel} />
        </mesh>
      </>
    )}
    <mesh position={[0, 1.75, 0]}>
      <cylinderGeometry args={[0.65, 0.3, 0.7, 40, 1, true]} />
      <meshStandardMaterial color="#d9eff1" transparent opacity={0.22} roughness={0.12} side={DoubleSide} />
    </mesh>
    {Array.from({length: 24}, (_, i) => (
      <Bean key={i} position={[Math.sin(i * 2.4) * 0.35, 1.58 + (i % 4) * 0.09, Math.cos(i * 2.4) * 0.35]} rotation={i} />
    ))}
    <group position={[0, 1.36, 0]} rotation={[0, frame / 5, 0]}>
      <mesh>
        <coneGeometry args={[0.26, 0.35, 16]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {Array.from({length: 12}, (_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 6) * 0.23, 0, Math.sin(i * Math.PI / 6) * 0.23]} rotation={[0, -i * Math.PI / 6, 0]}>
          <boxGeometry args={[0.025, 0.22, 0.07]} />
          <meshStandardMaterial color="#717b80" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
    <Rod from={[0, 1.1, 0.45]} to={[0, 0.9, 0.7]} radius={0.11} color="#22282b" />
    <mesh position={[0, 0.14, 0.74]}>
      <cylinderGeometry args={[0.39, 0.33, 0.22, 32]} />
      <meshStandardMaterial {...steel} />
    </mesh>
    <mesh position={[0, 0.265, 0.74]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.34, 24]} />
      <meshStandardMaterial color="#4f2c17" side={DoubleSide} />
    </mesh>
  </group>
);
