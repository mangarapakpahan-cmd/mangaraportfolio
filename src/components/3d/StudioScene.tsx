'use client';

import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';
import { WorkstationSpatialPosition } from '@/lib/types';
import CharacterController from './CharacterController';

export const WORKSTATION_SPATIAL_DATA: WorkstationSpatialPosition[] = [
  {
    id: 'led_broadcast',
    name: 'Operator LED & Broadcast',
    position: [-11, 0, -6],
    lookAt: [-11, 2.5, -9],
    inspectCamPosition: [-11, 2.2, -3.8],
    radarCoord: { x: -0.65, y: -0.5 },
  },
  {
    id: 'foh_av',
    name: 'FOH Audio-Visual & Stage',
    position: [0, 0, -4.5],
    lookAt: [0, 1.4, -7.0],
    inspectCamPosition: [0, 1.6, -2.4],
    radarCoord: { x: 0, y: -0.4 },
  },
  {
    id: 'uiux_motion',
    name: 'Designer / UI/UX & Motion',
    position: [6.5, 0, -5],
    lookAt: [6.5, 1.8, -7.5],
    inspectCamPosition: [6.5, 1.7, -3.0],
    radarCoord: { x: 0.45, y: -0.45 },
  },
  {
    id: 'web_dev',
    name: 'Web Dev & Software Lab',
    position: [-7, 0, 4.5],
    lookAt: [-7, 1.6, 7.0],
    inspectCamPosition: [-7, 1.7, 2.0],
    radarCoord: { x: -0.45, y: 0.4 },
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics Hub',
    position: [11.5, 0, -4],
    lookAt: [11.5, 2.2, -6.8],
    inspectCamPosition: [11.5, 1.9, -1.8],
    radarCoord: { x: 0.75, y: -0.35 },
  },
];

export const SERVER_RACK_COORDS: [number, number, number] = [15.5, 0, 8.5];

export default function StudioScene() {
  const { playerPosition, setNearbyZone, setCurrentFps } = useGameStore();
  const { scene, gl } = useThree();

  // WebGL Garbage Collection Cleanup: Pencegahan Memory Leak saat beralih ke Bento Grid Mode
  useEffect(() => {
    return () => {
      scene.traverse((object: any) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat: any) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
          }
        }
      });
      gl.renderLists?.dispose?.();
    };
  }, [scene, gl]);

  // Engine Proximity Detection (~2.2 meter radius)
  useFrame((state) => {
    setCurrentFps(Math.round(1 / state.clock.getDelta()));

    const pPos = new THREE.Vector3(...playerPosition);
    let detectedZone: any = null;

    // Cek jarak ke 5 Workstation
    for (const ws of WORKSTATION_SPATIAL_DATA) {
      const wsPos = new THREE.Vector3(...ws.position);
      if (pPos.distanceTo(wsPos) <= 2.3) {
        detectedZone = ws.id;
        break;
      }
    }

    // Cek jarak ke Server Rack Admin di pojok
    if (!detectedZone) {
      const rackPos = new THREE.Vector3(...SERVER_RACK_COORDS);
      if (pPos.distanceTo(rackPos) <= 2.0) {
        detectedZone = 'server_rack';
      }
    }

    setNearbyZone(detectedZone);
  });

  return (
    <>
      {/* 1. Pencahayaan Dark Industrial Hangar Studio */}
      <ambientLight intensity={0.4} color="#0f172a" />
      <directionalLight position={[5, 14, 8]} intensity={1.4} color="#f8fafc" castShadow />
      
      {/* Point Lights Aksen Neon Per Zona */}
      <pointLight position={[-11, 4.5, -6]} intensity={3.5} distance={14} color="#06b6d4" />
      <pointLight position={[0, 4.5, -4.5]} intensity={3.0} distance={12} color="#38bdf8" />
      <pointLight position={[6.5, 4.5, -5]} intensity={3.2} distance={12} color="#a855f7" />
      <pointLight position={[-7, 4.5, 4.5]} intensity={3.0} distance={12} color="#22c55e" />
      <pointLight position={[11.5, 4.5, -4]} intensity={3.5} distance={14} color="#10b981" />
      <pointLight position={[15.5, 4.0, 8.5]} intensity={2.5} distance={8} color="#eab308" />

      {/* 2. Lantai Beton Industri Studio dengan Refleksi Halus */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 32]} />
        <meshStandardMaterial color="#111827" roughness={0.72} metalness={0.25} />
      </mesh>

      {/* Dinding Hanggar Belakang */}
      <mesh position={[0, 7.5, -16]} receiveShadow>
        <planeGeometry args={[42, 15]} />
        <meshStandardMaterial color="#0b0f19" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Dinding Hanggar Kiri & Kanan */}
      <mesh position={[-21, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[32, 15]} />
        <meshStandardMaterial color="#090d16" roughness={0.9} />
      </mesh>
      <mesh position={[21, 7.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[32, 15]} />
        <meshStandardMaterial color="#090d16" roughness={0.9} />
      </mesh>

      {/* 3. Gantry Truss Rangka Besi & Kabel Gantung di Langit-langit */}
      <group position={[0, 10, 0]}>
        <mesh position={[0, 0, -6]}>
          <boxGeometry args={[40, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 4]}>
          <boxGeometry args={[40, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. Model 5 Workstation Terpisah */}
      
      {/* Zona 1: Operator LED & Broadcast (Main LED Wall Raksasa) */}
      <group position={[-11, 0, -6]}>
        {/* Meja Kontrol Switcher */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.9, 1.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Main LED Wall Panggung Raksasa di Belakang Meja */}
        <mesh position={[0, 3.2, -2.5]}>
          <boxGeometry args={[6.5, 3.8, 0.15]} />
          <meshStandardMaterial 
            color="#083344" 
            emissive="#06b6d4" 
            emissiveIntensity={0.65} 
          />
        </mesh>
        {/* LED Proximity Ring di Lantai */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.9, 2.05, 32]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Zona 2: FOH Audio-Visual & Stage (Konsol Mixer X32 & Intercom) */}
      <group position={[0, 0, -4.5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.9, 1.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Permukaan Konsol Mixer Miring */}
        <mesh position={[0, 0.98, -0.1]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[2.4, 0.1, 0.9]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Monitor Preview Panggung */}
        <mesh position={[0, 1.45, -0.6]}>
          <boxGeometry args={[2.2, 0.7, 0.08]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.7} />
        </mesh>
        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.95, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Zona 3: Designer / UI/UX & Motion (Portrait Displays) */}
      <group position={[6.5, 0, -5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.9, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Dual Portrait Screens */}
        <mesh position={[-0.6, 1.5, -0.4]}>
          <boxGeometry args={[0.7, 1.2, 0.08]} />
          <meshStandardMaterial color="#581c87" emissive="#a855f7" emissiveIntensity={0.65} />
        </mesh>
        <mesh position={[0.6, 1.5, -0.4]}>
          <boxGeometry args={[0.7, 1.2, 0.08]} />
          <meshStandardMaterial color="#581c87" emissive="#a855f7" emissiveIntensity={0.65} />
        </mesh>
        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.95, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Zona 4: Web Dev & Software Lab (Dual Curved Displays) */}
      <group position={[-7, 0, 4.5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.9, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Curved Screen Display */}
        <mesh position={[0, 1.35, 0.4]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[2.4, 0.8, 0.08]} />
          <meshStandardMaterial color="#14532d" emissive="#22c55e" emissiveIntensity={0.65} />
        </mesh>
        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.95, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Zona 5: Data Analytics Hub (Telemetry Dashboard Wall) */}
      <group position={[11.5, 0, -4]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.9, 1.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Telemetry Multi-Charts Wall */}
        <mesh position={[0, 2.5, -1.8]}>
          <boxGeometry args={[4.2, 2.4, 0.1]} />
          <meshStandardMaterial color="#064e3b" emissive="#10b981" emissiveIntensity={0.6} />
        </mesh>
        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 1.95, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Objek Rahasia: Server Rack Terminal Admin di Pojok */}
      <group position={SERVER_RACK_COORDS}>
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 3.2, 1.1]} />
          <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Lampu Status Server Rack Berkedip Hijau & Emas */}
        <mesh position={[0, 2.4, 0.56]}>
          <planeGeometry args={[0.8, 0.25]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
        {/* Proximity Ring */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.45, 32]} />
          <meshBasicMaterial color="#eab308" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Karakter Avatar & Third-Person Camera Rig */}
      <CharacterController />
    </>
  );
}
