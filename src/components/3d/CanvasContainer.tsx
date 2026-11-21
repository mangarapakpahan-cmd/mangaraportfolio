'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import StudioScene from './StudioScene';
import CharacterController from './CharacterController';
import { useGameStore } from '@/lib/store';

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#07090E] font-mono text-cyan-400 text-xs">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="tracking-widest uppercase animate-pulse">
          INITIALIZING MCR 3D GRAND STUDIO...
        </span>
      </div>
    </div>
  );
}

/** Third-person camera that smoothly follows the player from behind and above */
function ThirdPersonCamera() {
  const { playerPosition, playerRotation } = useGameStore();
  const camTarget = useRef(new THREE.Vector3(0, 2.8, 2.5));
  const camLookAt = useRef(new THREE.Vector3(0, 1.4, -3));

  useFrame((state) => {
    const pp = playerPosition;
    // Camera offset: 5 units behind player, 3 units above
    const sinR = Math.sin(playerRotation);
    const cosR = Math.cos(playerRotation);
    const desiredX = pp[0] + sinR * 5.5;
    const desiredY = pp[1] + 3.2;
    const desiredZ = pp[2] + cosR * 5.5;

    camTarget.current.set(desiredX, desiredY, desiredZ);
    state.camera.position.lerp(camTarget.current, 0.08);

    // Look at slightly above the player's head
    const lookX = pp[0];
    const lookY = pp[1] + 1.2;
    const lookZ = pp[2] - 1.5;
    camLookAt.current.set(lookX, lookY, lookZ);
    state.camera.lookAt(camLookAt.current);
  });

  return null;
}

function SceneContent() {
  return (
    <>
      <StudioScene />
      <CharacterController />
      <ThirdPersonCamera />
    </>
  );
}

export default function CanvasContainer() {
  return (
    <div className="relative w-full h-screen bg-[#07090E] overflow-hidden select-none">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          camera={{
            // Cinematic starting position: behind & above player spawn [0,0,-2.8]
            position: [0, 3.2, 2.7],
            fov: 65,
            near: 0.05,
            far: 120,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
          shadows
        >
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
}
