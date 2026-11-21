'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/lib/store';
import { WorkstationSpatialPosition, WorkstationCategory } from '@/lib/types';
import CharacterController from './CharacterController';
import { audioEngine } from '@/lib/audioEngine';

export const WORKSTATION_SPATIAL_DATA: WorkstationSpatialPosition[] = [
  {
    id: 'led_broadcast',
    name: 'Operator LED & Broadcast',
    shortTag: 'LED & BROADCAST',
    portfolioTag: 'MAIN LED WALL & BROADCAST',
    position: [-10.5, 0, -5.5],
    lookAt: [-10.5, 2.5, -8.0],
    inspectCamPosition: [-10.5, 2.0, -3.5],
    radarCoord: { x: -0.65, y: -0.5 },
  },
  {
    id: 'foh_av',
    name: 'FOH Audio-Visual & Stage',
    shortTag: 'FOH',
    portfolioTag: 'LEAD FOH & LIVE EVENT',
    position: [0, 0, -3.8],
    lookAt: [0, 1.4, -6.5],
    inspectCamPosition: [0, 1.5, -2.2],
    radarCoord: { x: 0, y: -0.4 },
  },
  {
    id: 'uiux_motion',
    name: 'Designer / UI/UX & Motion',
    shortTag: 'UI/UX & MOTION',
    portfolioTag: 'CREATIVE MOTION & UI/UX',
    position: [5.5, 0, -4.8],
    lookAt: [5.5, 1.8, -7.0],
    inspectCamPosition: [5.5, 1.7, -2.8],
    radarCoord: { x: 0.45, y: -0.45 },
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics Hub',
    shortTag: 'DATA ANALYTICS',
    portfolioTag: 'DATA SCIENCE & SEM-PLS',
    position: [10.5, 0, -5.0],
    lookAt: [10.5, 2.2, -7.2],
    inspectCamPosition: [10.5, 1.8, -2.5],
    radarCoord: { x: 0.75, y: -0.35 },
  },
  {
    id: 'web_dev',
    name: 'Web Dev & Software Lab',
    shortTag: 'WEB DEV LAB',
    portfolioTag: 'FULL-STACK & IOT',
    position: [-6.5, 0, 3.5],
    lookAt: [-6.5, 1.6, 6.0],
    inspectCamPosition: [-6.5, 1.7, 1.5],
    radarCoord: { x: -0.45, y: 0.4 },
  },
];

export const SERVER_RACK_COORDS: [number, number, number] = [14.5, 0, -5.2];

export default function StudioScene() {
  const {
    playerPosition,
    setNearbyZone,
    setCurrentFps,
    nearbyZone,
    openProjectModal,
    activeProject,
  } = useGameStore();

  const { scene, gl } = useThree();

  // Load HD Texture untuk Master Control Room Grand Studio
  const studioTexture = useLoader(THREE.TextureLoader, '/mcr_studio_hd.jpg');
  studioTexture.generateMipmaps = true;
  studioTexture.minFilter = THREE.LinearMipmapLinearFilter;

  // Cleanup WebGL Memory saat unmount / switch mode
  useEffect(() => {
    return () => {
      scene.traverse((object: any) => {
        if (object.geometry) object.geometry.dispose();
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

  // Proximity Detection Loop & FPS update
  useFrame((state) => {
    setCurrentFps(Math.round(1 / state.clock.getDelta()));

    const pPos = new THREE.Vector3(...playerPosition);
    let detectedZone: any = null;

    // Cek jarak ke 5 Workstations
    for (const ws of WORKSTATION_SPATIAL_DATA) {
      const wsPos = new THREE.Vector3(...ws.position);
      if (pPos.distanceTo(wsPos) <= 2.8) {
        detectedZone = ws.id;
        break;
      }
    }

    // Cek jarak ke Server Rack Admin di pojok kanan
    if (!detectedZone) {
      const rackPos = new THREE.Vector3(...SERVER_RACK_COORDS);
      if (pPos.distanceTo(rackPos) <= 2.5) {
        detectedZone = 'server_rack';
      }
    }

    if (detectedZone && detectedZone !== nearbyZone) {
      setNearbyZone(detectedZone);
    }
  });

  const handleStationClick = (zoneId: WorkstationCategory | 'server_rack') => {
    audioEngine.playSwitchClick();
    setNearbyZone(zoneId);
  };

  return (
    <>
      {/* 1. Pencahayaan Studio Industri */}
      <ambientLight intensity={0.85} color="#e2e8f0" />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
      
      {/* Aksen Point Lights per Zona */}
      <pointLight position={[-10.5, 4.0, -5.0]} intensity={3.0} distance={12} color="#06b6d4" />
      <pointLight position={[0, 3.5, -3.5]} intensity={2.8} distance={10} color="#38bdf8" />
      <pointLight position={[5.5, 3.5, -4.5]} intensity={2.8} distance={10} color="#c084fc" />
      <pointLight position={[10.5, 3.8, -4.5]} intensity={3.0} distance={12} color="#10b981" />
      <pointLight position={[14.5, 3.2, -4.5]} intensity={2.5} distance={8} color="#f59e0b" />

      {/* 2. Studio Master Backdrop Plate (Photorealistic Grand MCR Hangar) */}
      <mesh position={[0, 2.6, -9.2]}>
        <planeGeometry args={[27.5, 10.4]} />
        <meshBasicMaterial map={studioTexture} />
      </mesh>

      {/* 3. Lantai Beton Studio Reflektif Bawah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[35, 24]} />
        <meshStandardMaterial 
          color="#090d16" 
          roughness={0.65} 
          metalness={0.3} 
        />
      </mesh>

      {/* 4. Floating 3D Text Labels di Langit-Langit Workstations (Exact match to reference mockup) */}
      
      {/* Label 1: MAIN LED WALL & LED & BROADCAST */}
      <group position={[-9.2, 5.8, -7.8]}>
        <Html center transform distanceFactor={9} zIndexRange={[10, 0]}>
          <div 
            onClick={() => handleStationClick('led_broadcast')}
            className="flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            <span className="font-sans font-extrabold text-white text-base tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              MAIN LED WALL
            </span>
            <span className="font-sans font-bold text-slate-200 text-xs tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors whitespace-nowrap mt-0.5">
              LED & BROADCAST
            </span>
          </div>
        </Html>
      </group>

      {/* Label 2: FOH AUDIO-VISUAL */}
      <group position={[0, 4.3, -7.0]}>
        <Html center transform distanceFactor={9} zIndexRange={[10, 0]}>
          <div 
            onClick={() => handleStationClick('foh_av')}
            className="flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            <span className="font-sans font-extrabold text-white text-base tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              FOH AUDIO-VISUAL
            </span>
          </div>
        </Html>
      </group>

      {/* Label 3: DESIGNER / UI/UX & MOTION */}
      <group position={[5.4, 4.7, -7.5]}>
        <Html center transform distanceFactor={9} zIndexRange={[10, 0]}>
          <div 
            onClick={() => handleStationClick('uiux_motion')}
            className="flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            <span className="font-sans font-bold text-white text-sm tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              DESIGNER / UI/UX & MOTION
            </span>
          </div>
        </Html>
      </group>

      {/* Label 4: DATA ANALYTICS HUB */}
      <group position={[9.8, 5.0, -7.5]}>
        <Html center transform distanceFactor={9} zIndexRange={[10, 0]}>
          <div 
            onClick={() => handleStationClick('data_analytics')}
            className="flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            <span className="font-sans font-extrabold text-white text-base tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-cyan-300 transition-colors whitespace-nowrap">
              DATA ANALYTICS HUB
            </span>
          </div>
        </Html>
      </group>

      {/* Label 5: TINY SERVER RACK / ROOT ADMIN */}
      <group position={[14.2, 4.2, -7.5]}>
        <Html center transform distanceFactor={9} zIndexRange={[10, 0]}>
          <div 
            onClick={() => handleStationClick('server_rack')}
            className="flex flex-col items-center cursor-pointer group select-none pointer-events-auto"
          >
            <span className="font-sans font-bold text-white text-xs tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-amber-300 transition-colors whitespace-nowrap">
              TINY SERVER RACK
            </span>
            <span className="font-sans font-semibold text-amber-300 text-[10px] tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-nowrap">
              / ROOT ADMIN
            </span>
          </div>
        </Html>
      </group>

      {/* 5. Interactive 3D Workstation Trigger Hotspots */}
      <mesh 
        position={[-10.5, 2.0, -5.5]} 
        onClick={() => handleStationClick('led_broadcast')}
        visible={false}
      >
        <boxGeometry args={[5.5, 3.5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh 
        position={[0, 1.2, -3.8]} 
        onClick={() => handleStationClick('foh_av')}
        visible={false}
      >
        <boxGeometry args={[4.0, 2.5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh 
        position={[5.5, 1.6, -4.8]} 
        onClick={() => handleStationClick('uiux_motion')}
        visible={false}
      >
        <boxGeometry args={[3.0, 3.0, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh 
        position={[10.5, 2.0, -5.0]} 
        onClick={() => handleStationClick('data_analytics')}
        visible={false}
      >
        <boxGeometry args={[5.0, 3.5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh 
        position={[14.5, 1.8, -5.2]} 
        onClick={() => handleStationClick('server_rack')}
        visible={false}
      >
        <boxGeometry args={[2.5, 3.5, 2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 6. Realistic Third-Person Character Controller */}
      <CharacterController />
    </>
  );
}
