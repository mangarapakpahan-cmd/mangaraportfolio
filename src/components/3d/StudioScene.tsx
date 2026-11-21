'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';
import { WorkstationSpatialPosition, WorkstationCategory } from '@/lib/types';
import { audioEngine } from '@/lib/audioEngine';

export const WORKSTATION_SPATIAL_DATA: WorkstationSpatialPosition[] = [
  {
    id: 'led_broadcast',
    name: 'LED & Broadcast',
    shortTag: 'LED & BROADCAST',
    portfolioTag: 'MAIN LED WALL & BROADCAST',
    position: [-13, 0, -3],
    lookAt: [-13, 2.5, -8],
    inspectCamPosition: [-13, 2.0, 0],
    radarCoord: { x: -0.72, y: -0.3 },
  },
  {
    id: 'foh_av',
    name: 'FOH Audio-Visual & Stage',
    shortTag: 'FOH',
    portfolioTag: 'LEAD FOH & LIVE EVENT',
    position: [-1.5, 0, -2],
    lookAt: [-1.5, 1.5, -6],
    inspectCamPosition: [-1.5, 1.5, 1],
    radarCoord: { x: -0.08, y: -0.2 },
  },
  {
    id: 'uiux_motion',
    name: 'Designer / UI/UX & Motion',
    shortTag: 'UI/UX & MOTION',
    portfolioTag: 'CREATIVE MOTION & UI/UX',
    position: [5, 0, -4],
    lookAt: [5, 1.8, -8],
    inspectCamPosition: [5, 1.6, -1],
    radarCoord: { x: 0.28, y: -0.4 },
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics Hub',
    shortTag: 'DATA ANALYTICS',
    portfolioTag: 'DATA SCIENCE & SEM-PLS',
    position: [11, 0, -3],
    lookAt: [11, 2.5, -8],
    inspectCamPosition: [11, 2.0, 0],
    radarCoord: { x: 0.61, y: -0.3 },
  },
  {
    id: 'web_dev',
    name: 'Web Dev & Software Lab',
    shortTag: 'WEB DEV LAB',
    portfolioTag: 'FULL-STACK & IOT',
    position: [-7, 0, 4],
    lookAt: [-7, 1.5, 7],
    inspectCamPosition: [-7, 1.5, 2],
    radarCoord: { x: -0.39, y: 0.44 },
  },
];

export const SERVER_RACK_COORDS: [number, number, number] = [16, 0, -2];

function LEDWall({ position, size, color, emissive, images }: any) {
  const screens = images || [];
  return (
    <group position={position}>
      {/* Frame LED Wall */}
      <mesh>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, 0.12]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* LED Screen Surface */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[size[0], size[1], 0.03]} />
        <meshStandardMaterial
          color={color || '#061520'}
          emissive={emissive || '#0284c7'}
          emissiveIntensity={0.7}
        />
      </mesh>
      {/* Grid dividers to simulate multi-panel LED Wall */}
      {[-size[0] / 3, 0, size[0] / 3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.09]}>
          <boxGeometry args={[0.025, size[1], 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
      {[-size[1] / 3, 0, size[1] / 3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.09]}>
          <boxGeometry args={[size[0], 0.025, 0.03]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}
    </group>
  );
}

function MixerConsole({ position }: any) {
  return (
    <group position={position}>
      {/* Main desk body */}
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.88, 1.5]} />
        <meshStandardMaterial color="#0d1117" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Slanted console surface */}
      <mesh position={[0, 0.95, -0.15]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[2.8, 0.08, 1.1]} />
        <meshStandardMaterial color="#1a2332" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Fader channels (rows of small buttons/faders) */}
      {[-1.1, -0.7, -0.3, 0.1, 0.5, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 1.0, -0.1]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.055, 0.35, 0.04]} />
          <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Monitor screen on top */}
      <mesh position={[0, 1.5, -0.55]}>
        <boxGeometry args={[2.0, 0.65, 0.06]} />
        <meshStandardMaterial color="#0369a1" emissive="#0ea5e9" emissiveIntensity={0.8} />
      </mesh>
      {/* Proximity indicator ring on floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 48]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function FlightCase({ position, color }: any) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.9, 0.7]} />
        <meshStandardMaterial color={color || '#0d1117'} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Case corners */}
      {[[-0.38, 0.43, 0.33], [0.38, 0.43, 0.33], [-0.38, -0.43, 0.33], [0.38, -0.43, 0.33]].map((c, i) => (
        <mesh key={i} position={c as [number, number, number]}>
          <boxGeometry args={[0.07, 0.07, 0.07]} />
          <meshStandardMaterial color="#374151" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Workstation_LED({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* Massive LED Wall - left wall-mounted */}
      <LEDWall position={[0, 3.5, -0.1]} size={[7.2, 4.5]} color="#040e1a" emissive="#0284c7" />
      {/* Sub LED panel (smaller screens, stacked) */}
      <LEDWall position={[4.2, 2.8, -0.1]} size={[2.0, 2.2]} color="#040e1a" emissive="#0369a1" />
      {/* Controller desk */}
      <MixerConsole position={[0, 0, 1.5]} />
      {/* Flight cases */}
      <FlightCase position={[2.2, 0.45, 2.0]} />
      <FlightCase position={[2.2, 0.45, 1.0]} color="#111827" />
      {/* Stage platform (low riser) */}
      <mesh position={[-3, 0.1, 2.5]} receiveShadow>
        <boxGeometry args={[3.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#1a2234" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Proximity ring */}
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 48]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function Workstation_FOH({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* FOH Mixer console - Behringer X32 style */}
      <MixerConsole position={[0, 0, 0]} />
      {/* Stage monitor speaker (wedge) */}
      <mesh position={[-1.8, 0.4, 1.5]} rotation={[0.3, 0.2, 0]} castShadow>
        <boxGeometry args={[1.1, 0.7, 1.5]} />
        <meshStandardMaterial color="#0d1117" roughness={0.8} />
      </mesh>
      {/* Cable snake / stage box */}
      <mesh position={[1.6, 0.15, 1.2]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.6]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Intercom box */}
      <mesh position={[1.6, 0.6, 1.5]}>
        <boxGeometry args={[0.35, 0.5, 0.25]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={0.6} />
      </mesh>
      {/* Proximity ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Workstation_UIUX({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* Designer desk */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.84, 1.2]} />
        <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Dual monitors */}
      <mesh position={[-0.65, 1.3, -0.4]}>
        <boxGeometry args={[0.9, 0.55, 0.05]} />
        <meshStandardMaterial color="#c026d3" emissive="#a21caf" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.65, 1.2, -0.4]}>
        <boxGeometry args={[0.75, 0.47, 0.05]} />
        <meshStandardMaterial color="#d946ef" emissive="#c026d3" emissiveIntensity={0.6} />
      </mesh>
      {/* Totem / light display */}
      <mesh position={[1.6, 1.5, -0.3]}>
        <boxGeometry args={[0.35, 2.1, 0.08]} />
        <meshStandardMaterial color="#c026d3" emissive="#a21caf" emissiveIntensity={0.9} />
      </mesh>
      {/* Wacom tablet on desk */}
      <mesh position={[0, 0.86, 0.1]}>
        <boxGeometry args={[1.1, 0.04, 0.72]} />
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </mesh>
      {/* Proximity ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.9, 48]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Workstation_Data({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* Main data wall (multi-monitor array) */}
      <mesh position={[0, 2.5, -0.1]}>
        <boxGeometry args={[4.5, 3.0, 0.1]} />
        <meshStandardMaterial color="#040e1a" metalness={0.5} />
      </mesh>
      {/* Grid of monitors on wall */}
      {[[-1.5, 2.9], [0, 2.9], [1.5, 2.9],
        [-1.5, 1.4], [0, 1.4], [1.5, 1.4]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[1.1, 0.72, 0.07]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#064e3b' : '#065f46'}
            emissive={i % 2 === 0 ? '#059669' : '#10b981'}
            emissiveIntensity={0.65}
          />
        </mesh>
      ))}
      {/* Analyst desk */}
      <mesh position={[0, 0.42, 1.5]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.84, 1.2]} />
        <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Proximity ring */}
      <mesh position={[0, 0.01, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 48]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Workstation_WebDev({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* Standing desk */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.8, 1.0]} />
        <meshStandardMaterial color="#0d1117" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Monitor */}
      <mesh position={[0, 1.9, -0.3]}>
        <boxGeometry args={[1.3, 0.78, 0.06]} />
        <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.7} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, 1.82, 0.1]}>
        <boxGeometry args={[0.9, 0.03, 0.3]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {/* IoT device boards */}
      <mesh position={[0.6, 1.0, 0.2]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#16a34a" emissive="#15803d" emissiveIntensity={0.8} />
      </mesh>
      {/* Proximity ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.9, 48]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ServerRack({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.65, 2.2, 0.75]} />
        <meshStandardMaterial color="#030712" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Server rack units */}
      {[0.8, 0.5, 0.2, -0.1, -0.4, -0.7].map((y, i) => (
        <mesh key={i} position={[0, y + 1.1, 0.35]}>
          <boxGeometry args={[0.58, 0.18, 0.04]} />
          <meshStandardMaterial
            color="#0d1117"
            emissive={i % 2 === 0 ? '#f59e0b' : '#d97706'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.3, 48]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function HumanCharacter({ playerPosition, rotation }: { playerPosition: [number, number, number]; rotation: number }) {
  const bobRef = useRef(0);

  useFrame((_, delta) => {
    bobRef.current += delta * 2.5;
  });

  const bob = Math.sin(bobRef.current) * 0.015;

  return (
    <group position={[playerPosition[0], playerPosition[1], playerPosition[2]]} rotation={[0, rotation, 0]}>
      {/* Shadow blob on floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.6, 1.0, 1.0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      <group position={[0, bob, 0]}>
        {/* === LEGS === */}
        {/* Left leg */}
        <mesh position={[-0.14, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.095, 0.085, 1.0, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        {/* Right leg */}
        <mesh position={[0.14, 0.52, 0]} castShadow>
          <cylinderGeometry args={[0.095, 0.085, 1.0, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        {/* Left shoe */}
        <mesh position={[-0.14, 0.03, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.33]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
        </mesh>
        {/* Right shoe */}
        <mesh position={[0.14, 0.03, 0.06]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.33]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.7} />
        </mesh>

        {/* === TORSO === */}
        {/* Body / dark crew jacket */}
        <mesh position={[0, 1.3, 0]} castShadow>
          <boxGeometry args={[0.52, 0.72, 0.3]} />
          <meshStandardMaterial color="#1c1917" roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Collar area */}
        <mesh position={[0, 1.68, 0]}>
          <cylinderGeometry args={[0.095, 0.11, 0.14, 12]} />
          <meshStandardMaterial color="#292524" roughness={0.9} />
        </mesh>

        {/* === BACKPACK (crew gear bag on back) === */}
        <mesh position={[0, 1.3, 0.22]} castShadow>
          <boxGeometry args={[0.38, 0.52, 0.22]} />
          <meshStandardMaterial color="#292524" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Backpack strap detail */}
        <mesh position={[-0.14, 1.4, 0.13]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#44403c" roughness={0.9} />
        </mesh>
        <mesh position={[0.14, 1.4, 0.13]}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color="#44403c" roughness={0.9} />
        </mesh>

        {/* === ARMS === */}
        {/* Left arm */}
        <mesh position={[-0.31, 1.22, 0]} rotation={[0.1, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.56, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.85} />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.31, 1.22, 0]} rotation={[0.1, 0, -0.12]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.56, 10]} />
          <meshStandardMaterial color="#1c1917" roughness={0.85} />
        </mesh>
        {/* Left hand */}
        <mesh position={[-0.33, 0.93, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#c2a278" roughness={0.6} />
        </mesh>
        {/* Right hand */}
        <mesh position={[0.33, 0.93, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#c2a278" roughness={0.6} />
        </mesh>

        {/* === HEAD === */}
        <mesh position={[0, 1.84, 0]} castShadow>
          <sphereGeometry args={[0.185, 18, 18]} />
          <meshStandardMaterial color="#c2a278" roughness={0.5} />
        </mesh>
        {/* Hair (dark short) */}
        <mesh position={[0, 1.95, 0]}>
          <sphereGeometry args={[0.188, 14, 14]} />
          <meshStandardMaterial color="#1c1611" roughness={0.9} />
        </mesh>
        {/* Face direction visor / cap brim */}
        <mesh position={[0, 1.86, -0.19]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.26, 0.04, 0.12]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>

        {/* === HEADSET (crew intercom) === */}
        <mesh position={[0, 1.9, 0]}>
          <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Ear cup L */}
        <mesh position={[-0.21, 1.84, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Ear cup R */}
        <mesh position={[0.21, 1.84, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Mic boom */}
        <mesh position={[-0.26, 1.78, -0.1]} rotation={[0.4, 0, 0.4]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

function GantryTruss() {
  const positions: [number, number, number][] = [
    [0, 10.5, -5], [0, 10.5, 2], [0, 10.5, 9]
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[42, 0.35, 0.35]} />
            <meshStandardMaterial color="#1e2a3a" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Truss diagonal bracing */}
          {[-16, -10, -4, 2, 8, 14].map((x, j) => (
            <mesh key={j} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.6, 0.12, 0.12]} />
              <meshStandardMaterial color="#1e2a3a" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Vertical truss uprights */}
      {[-18, -12, -6, 0, 6, 12, 18].map((x, i) => (
        <mesh key={i} position={[x, 5.5, -5]}>
          <boxGeometry args={[0.2, 10, 0.2]} />
          <meshStandardMaterial color="#1a2332" metalness={0.9} />
        </mesh>
      ))}
      {/* Hanging cables */}
      {[-15, -9, -3, 3, 9, 15].map((x, i) => (
        <mesh key={i} position={[x, 7, -4]}>
          <cylinderGeometry args={[0.015, 0.015, 6, 4]} />
          <meshStandardMaterial color="#0d1117" />
        </mesh>
      ))}
    </>
  );
}

function HangarRoom() {
  return (
    <>
      {/* Floor - dark industrial concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[46, 28]} />
        <meshStandardMaterial
          color="#0a0d14"
          roughness={0.78}
          metalness={0.18}
        />
      </mesh>
      {/* Floor sheen/reflection strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[46, 28]} />
        <meshStandardMaterial
          color="#0d1520"
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Rear wall */}
      <mesh position={[0, 7, -14]} receiveShadow>
        <planeGeometry args={[46, 14]} />
        <meshStandardMaterial color="#080c14" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* Rear wall concrete panels (vertical grooves) */}
      {[-16, -10, -4, 2, 8, 14].map((x, i) => (
        <mesh key={i} position={[x, 7, -13.95]}>
          <boxGeometry args={[0.08, 14, 0.04]} />
          <meshStandardMaterial color="#060a10" metalness={0.3} />
        </mesh>
      ))}

      {/* Left wall */}
      <mesh position={[-23, 7, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#06090f" roughness={0.95} />
      </mesh>
      {/* Right wall */}
      <mesh position={[23, 7, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#06090f" roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 11, 0]}>
        <planeGeometry args={[46, 28]} />
        <meshStandardMaterial color="#040609" roughness={0.98} />
      </mesh>

      {/* Floor edge strips (subtle LED accent strip on floor edge near wall) */}
      <mesh position={[0, 0.02, -13.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 0.18]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>
      <mesh position={[-22.5, 0.02, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
        <planeGeometry args={[28, 0.18]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
      </mesh>
    </>
  );
}

export default function StudioScene() {
  const { playerPosition, playerRotation, setNearbyZone, setCurrentFps, nearbyZone, openProjectModal } = useGameStore();
  const { scene, gl } = useThree();

  // Cleanup
  useEffect(() => {
    return () => {
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((m: any) => { if (m.map) m.map.dispose(); m.dispose(); });
          else { if (object.material.map) object.material.map.dispose(); object.material.dispose(); }
        }
      });
      gl.renderLists?.dispose?.();
    };
  }, [scene, gl]);

  useFrame((state) => {
    setCurrentFps(Math.round(state.clock.getDelta() > 0 ? 1 / state.clock.getDelta() : 60));

    const pPos = new THREE.Vector3(...playerPosition);
    let detected: any = null;

    for (const ws of WORKSTATION_SPATIAL_DATA) {
      const wsPos = new THREE.Vector3(...ws.position);
      if (pPos.distanceTo(wsPos) <= 3.5) { detected = ws.id; break; }
    }
    if (!detected) {
      const rackPos = new THREE.Vector3(...SERVER_RACK_COORDS);
      if (pPos.distanceTo(rackPos) <= 2.5) detected = 'server_rack';
    }
    if (detected !== nearbyZone) setNearbyZone(detected);
  });

  const handleClick = (id: WorkstationCategory | 'server_rack') => {
    audioEngine.playSwitchClick();
    setNearbyZone(id);
  };

  return (
    <>
      {/* === LIGHTING === */}
      <ambientLight intensity={0.35} color="#0a1020" />
      <directionalLight position={[0, 12, 6]} intensity={1.2} color="#d4e8ff" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-far={60} shadow-camera-left={-25} shadow-camera-right={25}
        shadow-camera-top={16} shadow-camera-bottom={-14}
      />

      {/* Zone accent point lights */}
      <pointLight position={[-13, 5, -2]} intensity={5.0} distance={18} color="#06b6d4" />
      <pointLight position={[-1.5, 4.5, -1]} intensity={4.0} distance={14} color="#38bdf8" />
      <pointLight position={[5, 4.5, -3]} intensity={4.0} distance={14} color="#c084fc" />
      <pointLight position={[11, 5, -2]} intensity={4.5} distance={16} color="#10b981" />
      <pointLight position={[16, 4, -1]} intensity={3.0} distance={10} color="#f59e0b" />

      {/* Fill lights for scene depth */}
      <pointLight position={[0, 8, 5]} intensity={1.5} distance={22} color="#1e3a5f" />
      <pointLight position={[-8, 6, 6]} intensity={1.2} distance={18} color="#152a40" />

      {/* === ROOM STRUCTURE === */}
      <HangarRoom />
      <GantryTruss />

      {/* === WORKSTATIONS === */}
      <Workstation_LED pos={[-13, 0, -3]} />
      <Workstation_FOH pos={[-1.5, 0, -2]} />
      <Workstation_UIUX pos={[5, 0, -4]} />
      <Workstation_Data pos={[11, 0, -3]} />
      <Workstation_WebDev pos={[-7, 0, 4]} />
      <ServerRack pos={[16, 0, -2]} />

      {/* === FLOATING 3D LABELS === */}
      <Html position={[-13, 6.0, -5]} center>
        <div className="pointer-events-none select-none text-center drop-shadow-[0_2px_12px_rgba(0,0,0,1)]" onClick={() => handleClick('led_broadcast')}>
          <div className="text-white font-extrabold text-[18px] tracking-widest font-sans whitespace-nowrap">MAIN LED WALL</div>
          <div className="text-slate-200 font-bold text-[13px] tracking-wider font-sans whitespace-nowrap">LED &amp; BROADCAST</div>
        </div>
      </Html>

      <Html position={[-1.5, 5.2, -5]} center>
        <div className="pointer-events-none select-none drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
          <div className="text-white font-extrabold text-[17px] tracking-widest font-sans whitespace-nowrap">FOH AUDIO-VISUAL</div>
        </div>
      </Html>

      <Html position={[5, 5.5, -6]} center>
        <div className="pointer-events-none select-none drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
          <div className="text-white font-bold text-[13px] tracking-widest font-sans whitespace-nowrap">DESIGNER / UI/UX &amp; MOTION</div>
        </div>
      </Html>

      <Html position={[11, 5.8, -5]} center>
        <div className="pointer-events-none select-none drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
          <div className="text-white font-extrabold text-[17px] tracking-widest font-sans whitespace-nowrap">DATA ANALYTICS HUB</div>
        </div>
      </Html>

      <Html position={[16, 4.8, -4]} center>
        <div className="pointer-events-none select-none text-center drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
          <div className="text-white font-bold text-[11px] tracking-widest font-sans whitespace-nowrap">TINY SERVER RACK</div>
          <div className="text-amber-300 font-bold text-[11px] tracking-widest font-sans whitespace-nowrap">/ ROOT ADMIN</div>
        </div>
      </Html>

      {/* === HUMAN CHARACTER === */}
      <HumanCharacter playerPosition={playerPosition} rotation={playerRotation} />
    </>
  );
}
