'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import StudioScene from './StudioScene';

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#07090E] font-mono text-cyan-400 text-xs">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span className="tracking-widest uppercase animate-pulse">
          INITIALIZING MCR 3D STUDIO HANGAR...
        </span>
      </div>
    </div>
  );
}

export default function CanvasContainer() {
  return (
    <div className="relative w-full h-screen bg-[#07090E] overflow-hidden select-none">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          shadows
          camera={{
            position: [0, 2.5, 4.5],
            fov: 60,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <StudioScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
