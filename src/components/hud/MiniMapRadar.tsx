'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';

export default function MiniMapRadar() {
  const { playerPosition, playerRotation } = useGameStore();

  // Konversi koordinat 3D studio (-18 s/d 18) ke radius radar lingkaran (48px)
  const mapRadius = 46;
  const pX = (playerPosition[0] / 18) * mapRadius;
  const pZ = (playerPosition[2] / 12) * mapRadius;

  return (
    <div className="absolute bottom-6 left-6 z-30 flex flex-col items-start pointer-events-none select-none">
      
      {/* Controls Text Helper (Exact match to reference image) */}
      <div className="mb-2.5 flex flex-col font-mono text-cyan-300 font-bold select-none drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
        <span className="text-sm tracking-wider font-extrabold">[W][A][S][D]</span>
        <span className="text-[11px] text-slate-300 font-medium tracking-normal">Mouse to Move</span>
      </div>

      {/* Frame Radar Melingkar Cyber-Industrial */}
      <div className="relative w-32 h-32 rounded-full border-2 border-cyan-500/70 bg-[#060c18]/85 backdrop-blur-md overflow-hidden shadow-[0_0_22px_rgba(6,182,212,0.3)] flex items-center justify-center">
        
        {/* Radar Range Concentric Rings */}
        <div className="absolute inset-2 rounded-full border border-cyan-700/35" />
        <div className="absolute inset-6 rounded-full border border-cyan-800/30" />
        <div className="absolute w-full h-[1px] bg-cyan-800/30" />
        <div className="absolute h-full w-[1px] bg-cyan-800/30" />

        {/* Jarum Kompas Mata Angin */}
        <span className="absolute top-1 text-[8.5px] font-mono font-bold text-cyan-300">N</span>
        <span className="absolute right-1.5 text-[8.5px] font-mono font-semibold text-cyan-600">E</span>
        <span className="absolute bottom-1 text-[8.5px] font-mono font-semibold text-cyan-600">S</span>
        <span className="absolute left-1.5 text-[8.5px] font-mono font-semibold text-cyan-600">W</span>

        {/* Pin 5 Workstations */}
        {WORKSTATION_SPATIAL_DATA.map((ws) => {
          const wsX = (ws.position[0] / 18) * mapRadius;
          const wsZ = (ws.position[2] / 12) * mapRadius;
          return (
            <div
              key={ws.id}
              className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"
              style={{
                transform: `translate(${wsX}px, ${wsZ}px)`,
              }}
              title={ws.name}
            />
          );
        })}

        {/* Pin Server Rack Admin (Kuning Emas) */}
        <div
          className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]"
          style={{
            transform: `translate(${(14.5 / 18) * mapRadius}px, ${(6.5 / 12) * mapRadius}px)`,
          }}
          title="Tiny Server Rack / Root Admin"
        />

        {/* Avatar Player Indicator (Panah Kuning Emas Berputar Mengikuti Rotasi) */}
        <div
          className="absolute w-3 h-3 flex items-center justify-center"
          style={{
            transform: `translate(${pX}px, ${pZ}px)`,
          }}
        >
          <div
            className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[8px] border-b-amber-400 drop-shadow-[0_0_6px_#f59e0b]"
            style={{ transform: `rotate(${-playerRotation}rad)` }}
          />
        </div>

      </div>
    </div>
  );
}
