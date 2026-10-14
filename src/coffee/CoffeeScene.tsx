import {Environment, Lightformer} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {interpolate, useCurrentFrame} from 'remotion';
import {Euler, Vector3} from 'three';
import {COFFEE_SCENE_FRAMES} from './recipe';
import {Bean, Cup, Grinder, Kettle, Press, Rod} from './objects';
import {PourStream, Steam} from './effects';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const CoffeeScene = ({scene}: {scene: number}) => {
  const frame = useCurrentFrame();
  const localFrame = frame % COFFEE_SCENE_FRAMES;
  const progress = localFrame / (COFFEE_SCENE_FRAMES - 1);
  const pourProgress = interpolate(progress, [0.15, 0.82], [0, 1], clamp);
  const pouring = progress > 0.15 && progress < 0.82;
  const kettleTilt = -0.55 * interpolate(progress, [0.05, 0.15, 0.82, 0.95], [0, 1, 1, 0], clamp);
  const kettlePosition: [number, number, number] = [-1.8, 2.65, 0];
  const waterStart = new Vector3(1.25, 1.3, 0).applyEuler(new Euler(0, 0, kettleTilt)).add(new Vector3(...kettlePosition));
  const serveProgress = interpolate(progress, [0.2, 0.78], [0, 1], clamp);
  const serving = progress > 0.2 && progress < 0.78;
  const pressTilt = 0.7 * interpolate(progress, [0.08, 0.2, 0.78, 0.92], [0, 1, 1, 0], clamp);
  const servePosition: [number, number, number] = [0.8, 1.15, 0];
  const coffeeStart = new Vector3(-0.9, 2.3, 0).applyEuler(new Euler(0, 0, pressTilt)).add(new Vector3(...servePosition));
  const cupPosition: [number, number, number] = [-1.4, 0.1, 0];
  const waterSurface = 0.3 + pourProgress * 1.95;

  return (
    <ThreeCanvas
      width={1120}
      height={880}
      camera={{position: [5.4, 4.6, 9], fov: 38}}
      onCreated={({camera}) => camera.lookAt(0, 1.7, 0)}
      gl={{alpha: true, antialias: true}}
      style={{width: 1120, height: 880}}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[-3, 7, 5]} intensity={3} color="#ffe2b9" />
      <directionalLight position={[4, 4, -4]} intensity={2} color="#c1dfea" />
      <Environment resolution={128} frames={1}>
        <Lightformer position={[-4, 4, 3]} intensity={4} scale={[3, 6, 1]} />
        <Lightformer position={[4, 3, 2]} intensity={3} scale={[2, 5, 1]} />
        <Lightformer position={[0, 6, -3]} intensity={3} scale={[6, 2, 1]} />
      </Environment>
      <mesh position={[0, -0.07, 0]}>
        <boxGeometry args={[12, 0.15, 8]} />
        <meshStandardMaterial color="#7c5237" roughness={0.78} />
      </mesh>
      {Array.from({length: 12}, (_, i) => (
        <mesh key={i} position={[0, 0.012, -3.7 + i * 0.65]}>
          <boxGeometry args={[12, 0.002, 0.012]} />
          <meshStandardMaterial color="#60432f" roughness={1} />
        </mesh>
      ))}
      {scene === 0 && (
        <>
          <Press plunge={1} />
          <group position={[-1.9, 0.1, 0.9]}><Cup fill={0.8} /></group>
          <Steam frame={frame} position={[-1.9, 0.85, 0.9]} />
          <group position={[2.1, 0.05, -1.7]}><Grinder frame={0} /></group>
          {Array.from({length: 16}, (_, i) => <Bean key={i} position={[1.1 + Math.sin(i * 2.4) * 0.6, 0.12, 1.1 + Math.cos(i * 2.4) * 0.45]} rotation={i} />)}
        </>
      )}
      {scene === 1 && (
        <group scale={1.35} position={[0, 0, 0]}>
          <Grinder frame={localFrame} cutaway />
          {Array.from({length: 16}, (_, i) => {
            const fall = ((localFrame + i * 17) % 100) / 100;
            return <Bean key={i} position={[Math.sin(i * 2.4) * 0.26, 3.4 - fall * 1.5, Math.cos(i * 2.4) * 0.26]} rotation={i + frame / 30} />;
          })}
          {Array.from({length: 28}, (_, i) => {
            const fall = ((localFrame + i * 7) % 40) / 40;
            return (
              <mesh key={i} position={[Math.sin(i * 2.4) * 0.08, 0.89 - fall * 0.61, 0.72 + Math.cos(i * 2.4) * 0.08]}>
                <sphereGeometry args={[0.018, 4, 4]} />
                <meshStandardMaterial color="#633b24" />
              </mesh>
            );
          })}
        </group>
      )}
      {scene === 2 && (
        <group scale={1.65} position={[0, 0.15, 0]}>
          <mesh position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.85, 0.88, 0.12, 48]} />
            <meshStandardMaterial color="#202628" roughness={0.35} metalness={0.45} />
          </mesh>
          <Kettle />
          <Steam frame={frame} position={[0, 1.48, 0]} strength={interpolate(progress, [0, 0.4, 1], [0.2, 1.2, 0.6], clamp)} />
        </group>
      )}
      {scene === 3 && (
        <>
          <Press cutaway lid={false} grounds={interpolate(progress, [0.12, 0.75], [0.05, 1], clamp)} />
          <group position={[0, 3.2, 0]} rotation={[0, 0, 0.8]}>
            <mesh><cylinderGeometry args={[0.4, 0.32, 0.5, 32, 1, true]} /><meshStandardMaterial color="#929a9f" metalness={0.75} roughness={0.25} /></mesh>
          </group>
          {progress < 0.8 && Array.from({length: 40}, (_, i) => {
            const fall = ((localFrame + i * 11) % 75) / 75;
            return (
              <mesh key={i} position={[Math.sin(i * 2.4) * 0.28, 2.9 - fall * 2.5, Math.cos(i * 2.4) * 0.28]}>
                <sphereGeometry args={[0.025, 4, 4]} /><meshStandardMaterial color="#4a2917" />
              </mesh>
            );
          })}
        </>
      )}
      {scene === 4 && (
        <>
          <Press cutaway lid={false} grounds={1} fill={pourProgress} />
          <group position={kettlePosition} rotation={[0, 0, kettleTilt]}><Kettle /></group>
          {pouring && <PourStream start={[waterStart.x, waterStart.y, waterStart.z]} end={[0, waterSurface + 0.03, 0]} frame={frame} />}
          {progress > 0.85 && (
            <group position={[Math.sin(frame / 12) * 0.18, 0, Math.cos(frame / 12) * 0.18]}>
              <Rod from={[0, 0.7, 0]} to={[0, 3.1, 0]} radius={0.025} />
            </group>
          )}
          <Steam frame={frame} position={[0, waterSurface + 0.1, 0]} strength={pourProgress} />
        </>
      )}
      {scene === 5 && (
        <>
          <Press cutaway grounds={1} fill={1} brewed lidLift={interpolate(progress, [0, 0.16], [0.5, 0], clamp)} />
          <Steam frame={frame} position={[-0.85, 2.45, 0]} strength={0.6} />
        </>
      )}
      {scene === 6 && (
        <Press cutaway grounds={1} fill={1} brewed plunge={interpolate(progress, [0.12, 0.87], [0, 1], clamp)} />
      )}
      {scene === 7 && (
        <>
          <group position={servePosition} rotation={[0, 0, pressTilt]}><Press fill={1 - serveProgress * 0.5} grounds={1} brewed plunge={1} /></group>
          <group position={cupPosition}><Cup fill={serveProgress * 0.85} /></group>
          {serving && <PourStream start={[coffeeStart.x, coffeeStart.y, coffeeStart.z]} end={[cupPosition[0], cupPosition[1] + 0.16 + serveProgress * 0.85 * 0.57, 0]} frame={frame} coffee />}
          <Steam frame={frame} position={[cupPosition[0], 0.9, 0]} strength={serveProgress} />
          {Array.from({length: 8}, (_, i) => <Bean key={i} position={[0.5 + Math.sin(i * 2.4) * 0.4, 0.12, 1.1 + Math.cos(i * 2.4) * 0.3]} rotation={i} />)}
        </>
      )}
    </ThreeCanvas>
  );
};
