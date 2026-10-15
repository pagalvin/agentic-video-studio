import {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {CatmullRomCurve3, Vector3} from 'three';
import {interpolate, useCurrentFrame} from 'remotion';
import {getDialogue} from './dialogue';

type Point = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Stroke = ({points, color, radius = 0.025}: {points: Point[]; color: string; radius?: number}) => {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
  return <mesh><tubeGeometry args={[curve, 20, radius, 8, false]} /><meshStandardMaterial color={color} roughness={0.75} /></mesh>;
};

const Ball = ({position, scale, color}: {position: Point; scale: Point; color: string}) => (
  <mesh position={position} scale={scale}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color={color} roughness={0.75} /></mesh>
);

const Character = ({name, x}: {name: 'Milo' | 'June'; x: number}) => {
  const frame = useCurrentFrame();
  const beat = getDialogue(frame);
  const local = frame - beat.start;
  const speaking = beat.speaker === name;
  const direction = name === 'Milo' ? 1 : -1;
  const reaction = interpolate(local, [0, 25, 55], [0, 0, 1], clamp);
  const deadpan = name === 'June' && beat.mood === 'deadpan';
  const surprised = name === 'June' && beat.mood === 'punchline';
  const laughing = beat.mood === 'laugh' || (name === 'Milo' && beat.mood === 'deadpan' && local > 65);
  const smile = laughing ? 0.14 : name === 'Milo' ? 0.1 : surprised ? 0.04 * reaction : deadpan ? -0.025 : 0.055;
  const phase = (frame + (name === 'June' ? 70 : 0)) % 137;
  const blink = phase >= 129 ? Math.max(0.08, Math.abs(phase - 133) / 4) : 1;
  const eyeHeight = (deadpan ? 0.055 : surprised ? 0.14 : 0.1) * blink;
  const skin = name === 'Milo' ? '#dca27b' : '#a9694e';
  const shirt = name === 'Milo' ? '#52a9a2' : '#dc9471';
  const mouthOpen = speaking && local < beat.end - beat.start - 18
    ? Math.max(0, Math.sin(local / 4)) * 0.038 : laughing ? 0.045 : 0;
  const lean = speaking ? Math.sin(local / 12) * 0.018 : Math.sin(frame / 45) * 0.01;

  return (
    <group position={[x, 0, -0.35]}>
      <mesh position={[0, 0.93, 0]}><boxGeometry args={[1.12, 0.15, 1]} /><meshStandardMaterial color="#684834" /></mesh>
      <mesh position={[0, 1.5, -0.5]}><boxGeometry args={[1.1, 1.1, 0.13]} /><meshStandardMaterial color="#684834" /></mesh>
      {[-0.4, 0.4].map((dx) => <mesh key={dx} position={[dx, 0.45, -0.3]}><cylinderGeometry args={[0.055, 0.055, 0.9, 10]} /><meshStandardMaterial color="#49362c" /></mesh>)}
      <Ball position={[-0.28, 0.74, 0.18]} scale={[0.22, 0.67, 0.23]} color="#344758" />
      <Ball position={[0.28, 0.74, 0.18]} scale={[0.22, 0.67, 0.23]} color="#344758" />
      <Ball position={[-0.28, 0.14, 0.36]} scale={[0.23, 0.14, 0.38]} color="#283338" />
      <Ball position={[0.28, 0.14, 0.36]} scale={[0.23, 0.14, 0.38]} color="#283338" />
      <group rotation={[lean, 0, direction * (laughing ? Math.sin(frame / 5) * 0.015 : 0)]}>
        <Ball position={[0, 1.64, 0]} scale={[0.58, 0.73, 0.38]} color={shirt} />
        <Ball position={[0, 2.2, 0]} scale={[0.18, 0.25, 0.18]} color={skin} />
        <Stroke points={[[-0.45, 1.95, 0], [-0.63, 1.5, 0.2], [-0.4, 1.52, 0.64]]} radius={0.13} color={shirt} />
        <Ball position={[-0.4, 1.52, 0.66]} scale={[0.14, 0.09, 0.16]} color={skin} />
        <group position={[0.43, 1.94, 0]} rotation={[speaking ? -0.2 - Math.sin(local / 15) * 0.18 : 0, 0, speaking ? -0.1 : 0.1]}>
          <Stroke points={[[0, 0, 0], [0.24, -0.4, 0.15], [0.12, -0.32, 0.6]]} radius={0.13} color={shirt} />
          <Ball position={[0.12, -0.32, 0.63]} scale={[0.14, 0.1, 0.18]} color={skin} />
        </group>
        <group position={[0, 2.85, 0]} rotation={[laughing ? -0.09 : speaking ? Math.sin(local / 14) * 0.04 : 0.02, direction * 0.23, deadpan ? -0.11 : !speaking && beat.mood === 'question' ? 0.1 : 0]}>
          <Ball position={[0, 0, 0]} scale={[0.58, 0.65, 0.51]} color={skin} />
          <Ball position={[-0.57, 0, 0]} scale={[0.11, 0.17, 0.1]} color={skin} />
          <Ball position={[0.57, 0, 0]} scale={[0.11, 0.17, 0.1]} color={skin} />
          <Ball position={[0, 0.35, -0.12]} scale={[0.6, 0.42, 0.48]} color={name === 'Milo' ? '#573c2c' : '#252b35'} />
          {name === 'June' && <Ball position={[0.38, 0.13, -0.42]} scale={[0.28, 0.4, 0.24]} color="#252b35" />}
          {[-1, 1].map((side) => (
            <group key={side}>
              <Ball position={[side * 0.21, 0.08, 0.47]} scale={[0.13, eyeHeight, 0.055]} color="#fff3df" />
              <Ball position={[side * 0.21 + direction * 0.025, 0.08, 0.516]} scale={[0.052, eyeHeight * 0.85, 0.025]} color="#263c42" />
              <Stroke points={[[side * 0.21 - 0.12, 0.28 + (deadpan && side === -1 ? 0.1 : 0), 0.46], [side * 0.21, 0.31 + (surprised ? 0.1 * reaction : 0), 0.49], [side * 0.21 + 0.12, 0.28, 0.46]]} color="#493328" radius={0.026} />
            </group>
          ))}
          <Ball position={[0, -0.07, 0.53]} scale={[0.08, 0.1, 0.09]} color={skin} />
          <Stroke points={[[-0.22, -0.2, 0.46], [0, -0.2 - smile, 0.515], [0.22, -0.2, 0.46]]} radius={0.018 + mouthOpen * 0.45} color="#62312c" />
          <Ball position={[-0.34, -0.12, 0.42]} scale={[0.1, 0.055, 0.02]} color={name === 'Milo' ? '#d98c74' : '#ae685b'} />
          <Ball position={[0.34, -0.12, 0.42]} scale={[0.1, 0.055, 0.02]} color={name === 'Milo' ? '#d98c74' : '#ae685b'} />
        </group>
      </group>
    </group>
  );
};

export const CafeScene = () => (
  <ThreeCanvas width={1920} height={1080} camera={{position: [0, 4.5, 10], fov: 38}}
    onCreated={({camera}) => camera.lookAt(0, 1.75, 0)}
    gl={{alpha: true, antialias: true}} style={{width: 1920, height: 1080}}>
    <ambientLight intensity={1.3} />
    <directionalLight position={[-3, 7, 5]} intensity={2.8} color="#ffe3ba" />
    <directionalLight position={[4, 3, -2]} intensity={1.2} color="#c2e6ee" />
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[20, 0.1, 15]} /><meshStandardMaterial color="#d5c7ae" /></mesh>
    <mesh position={[0, 2.5, -3]}><boxGeometry args={[20, 5, 0.1]} /><meshStandardMaterial color="#8bb2a5" /></mesh>
    {[-4, 4].map((x) => <group key={x} position={[x, 2.6, -2.9]}>
      <mesh><boxGeometry args={[1.6, 1.9, 0.08]} /><meshStandardMaterial color="#f0d8a8" /></mesh>
      <mesh position={[0, 0, 0.06]}><boxGeometry args={[1.3, 1.6, 0.04]} /><meshStandardMaterial color="#bbcfbd" /></mesh>
    </group>)}
    <Character name="Milo" x={-1.85} />
    <Character name="June" x={1.85} />
    <mesh position={[0, 1.35, 0.65]}><boxGeometry args={[3.1, 0.16, 1.8]} /><meshStandardMaterial color="#986647" roughness={0.7} /></mesh>
    {[-1.18, 1.18].map((x) => <mesh key={x} position={[x, 0.66, 0.65]}><boxGeometry args={[0.12, 1.3, 1.4]} /><meshStandardMaterial color="#493c35" /></mesh>)}
    {[-0.95, 0.95].map((x) => <group key={x} position={[x, 1.45, 0.45]}>
      <mesh><cylinderGeometry args={[0.25, 0.21, 0.3, 32]} /><meshStandardMaterial color="#fff4d9" /></mesh>
      <mesh position={[0, 0.155, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.21, 24]} /><meshStandardMaterial color="#4d2d20" /></mesh>
      <mesh position={[0.27, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.12, 0.035, 8, 20]} /><meshStandardMaterial color="#fff4d9" /></mesh>
    </group>)}
    <mesh position={[0, 1.52, 0.7]}><cylinderGeometry args={[0.15, 0.12, 0.18, 24]} /><meshStandardMaterial color="#e0a16b" /></mesh>
    <Stroke points={[[0, 1.6, 0.7], [-0.06, 1.85, 0.7], [0.04, 2.05, 0.7]]} radius={0.025} color="#527950" />
    <Ball position={[0.02, 1.92, 0.7]} scale={[0.18, 0.06, 0.08]} color="#527950" />
  </ThreeCanvas>
);
