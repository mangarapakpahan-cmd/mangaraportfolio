'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
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
    position: [-6.8, 0, -1.0],
    lookAt: [-6.8, 1.5, -3.0],
    inspectCamPosition: [-6.8, 1.2, 1.0],
    radarCoord: { x: -0.65, y: -0.5 },
  },
  {
    id: 'foh_av',
    name: 'FOH Audio-Visual & Stage',
    shortTag: 'FOH',
    portfolioTag: 'LEAD FOH & LIVE EVENT',
    position: [0, 0, -0.5],
    lookAt: [0, 1.2, -3.0],
    inspectCamPosition: [0, 1.1, 1.2],
    radarCoord: { x: 0, y: -0.4 },
  },
  {
    id: 'uiux_motion',
    name: 'Designer / UI/UX & Motion',
    shortTag: 'UI/UX & MOTION',
    portfolioTag: 'CREATIVE MOTION & UI/UX',
    position: [3.8, 0, -1.0],
    lookAt: [3.8, 1.4, -3.0],
    inspectCamPosition: [3.8, 1.2, 1.0],
    radarCoord: { x: 0.45, y: -0.45 },
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics Hub',
    shortTag: 'DATA ANALYTICS',
    portfolioTag: 'DATA SCIENCE & SEM-PLS',
    position: [7.2, 0, -1.0],
    lookAt: [7.2, 1.5, -3.0],
    inspectCamPosition: [7.2, 1.3, 1.0],
    radarCoord: { x: 0.75, y: -0.35 },
  },
  {
    id: 'web_dev',
    name: 'Web Dev & Software Lab',
    shortTag: 'WEB DEV LAB',
    portfolioTag: 'FULL-STACK & IOT',
    position: [-4.2, 0, 1.5],
    lookAt: [-4.2, 1.2, 3.5],
    inspectCamPosition: [-4.2, 1.3, 0.5],
    radarCoord: { x: -0.45, y: 0.4 },
  },
];

export const SERVER_RACK_COORDS: [number, number, number] = [9.8, 0, -1.0];

export default function StudioScene() {
  const {
    playerPosition,
    setNearbyZone,
    setCurrentFps,
    nearbyZone,
    isProjectModalOpen,
  } = useGameStore();

  const { scene, gl, camera } = useThree();

  // Load tekstur HD MCR Grand Studio (menyesuaikan status modal terbuka vs diminimalkan)
  const masterTexture = useLoader(
    THREE.TextureLoader,
    isProjectModalOpen ? '/mcr_scene_hd.jpg' : '/mcr_scene_clean_hd.jpg'
  );
  masterTexture.generateMipmaps = true;
  masterTexture.minFilter = THREE.LinearMipmapLinearFilter;

  const mouseParallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseParallax.current = { x: x * 0.15, y: y * 0.1 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup WebGL Memory saat unmount
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

  // Frame Loop: Proximity Detection, FPS Telemetry, & Subtle Mouse Parallax
  useFrame((state) => {
    setCurrentFps(Math.round(1 / state.clock.getDelta()));

    // Dynamic Camera Mouse Parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseParallax.current.x, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseParallax.current.y, 0.05);

    const pPos = new THREE.Vector3(...playerPosition);
    let detectedZone: any = null;

    for (const ws of WORKSTATION_SPATIAL_DATA) {
      const wsPos = new THREE.Vector3(...ws.position);
      if (pPos.distanceTo(wsPos) <= 2.8) {
        detectedZone = ws.id;
        break;
      }
    }

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
      {/* 1. Pencahayaan Ambient & Direct */}
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight position={[0, 5, 8]} intensity={1.2} color="#ffffff" />

      {/* 2. Master Photorealistic Studio Canvas Plate (Edge-to-Edge) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[18.8, 6.6]} />
        <meshBasicMaterial map={masterTexture} />
      </mesh>

      {/* 3. Invisible Interactive Hit Zones over each workstation */}
      {/* Zone: LED & Broadcast */}
      <mesh 
        position={[-6.8, 0.6, 0.1]} 
        onClick={() => handleStationClick('led_broadcast')}
        visible={false}
      >
        <boxGeometry args={[4.8, 3.2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Zone: FOH Audio-Visual */}
      <mesh 
        position={[0, -0.2, 0.1]} 
        onClick={() => handleStationClick('foh_av')}
        visible={false}
      >
        <boxGeometry args={[3.8, 2.8, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Zone: Designer / UI/UX & Motion */}
      <mesh 
        position={[3.8, 0.4, 0.1]} 
        onClick={() => handleStationClick('uiux_motion')}
        visible={false}
      >
        <boxGeometry args={[2.8, 3.0, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Zone: Data Analytics Hub */}
      <mesh 
        position={[7.2, 0.6, 0.1]} 
        onClick={() => handleStationClick('data_analytics')}
        visible={false}
      >
        <boxGeometry args={[4.0, 3.2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Zone: Server Rack Root Admin */}
      <mesh 
        position={[9.8, 0.2, 0.1]} 
        onClick={() => handleStationClick('server_rack')}
        visible={false}
      >
        <boxGeometry args={[2.0, 3.2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 4. Karakter & Keyboard Controller */}
      <CharacterController />
    </>
  );
}
