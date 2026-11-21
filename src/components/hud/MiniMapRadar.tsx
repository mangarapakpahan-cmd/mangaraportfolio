'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { WORKSTATION_SPATIAL_DATA } from '../3d/StudioScene';

export default function MiniMapRadar() {
  const { playerPosition, playerRotation } = useGameStore();

  // Konversi koordinat 3D studio (-20 s/d 20) ke radius radar lingkaran (130px)
  const mapRadius = 54;
  const pX = (playerPosition[0] / 20) * mapRadius;
  const pZ = (playerPosition[2] / 15) * mapRadius;

  return (
    <div className="absolute bottom-6 left-6 z-20 flex flex-col items-center pointer-events-none select-none">
      
      {/* Keyboard Controls Prompt Helper */}
      <div className="mb-2 text-[10px] font-mono text-cyan-400 font-bold tracking-widest bg-slate-950/85 px-2.5 py-0.5 rounded-full border border-cyan-800/70 shadow-lg">
        [W][A][S][D] Mouse to Move
      </div>

      {/* Frame Radar Melingkar Cyber-Industrial */}
      <div className="relative w-36 h-36 rounded-full border-2 border-cyan-500/60 bg-slate-950/85 backdrop-blur-md overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.25)] flex items-center justify-center">
        
        {/* Radar Range Rings */}
        <div className="absolute inset-2 rounded-full border border-cyan-800/40" />
        <div className="absolute inset-7 rounded-full border border-cyan-800/30" />
        <div className="absolute w-full h-[1px] bg-cyan-800/25" />
        <div className="absolute h-full w-[1px] bg-cyan-800/25" />

        {/* Jarum Kompas Mata Angin */}
        <span className="absolute top-1 text-[9px] font-mono font-bold text-cyan-400">N</span>
        <span className="absolute right-1.5 text-[9px] font-mono text-cyan-600">E</span>
        <span className="absolute bottom-1 text-[9px] font-mono text-cyan-600">S</span>
        <span className="absolute left-1.5 text-[9px] font-mono text-cyan-600">W</span>

        {/* Pin 5 Workstation */}
        {WORKSTATION_SPATIAL_DATA.map((ws) => {
          const wsX = (ws.position[0] / 20) * mapRadius;
          const wsZ = (ws.position[2] / 15) * mapRadius;
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
            transform: `translate(${(15.5 / 20) * mapRadius}px, ${(8.5 / 15) * mapRadius}px)`,
          }}
          title="Server Rack Root Admin"
        />

        {/* Avatar Player Indicator (Panah Kuning Berputar Mengikuti Arah Hadap) */}
        <div
          className="absolute w-3 h-3 flex items-center justify-center"
          style={{
            transform: `translate(${pX}px, ${pZ}px)`,
          }}
        >
          <div
            className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-amber-400 drop-shadow-[0_0_5px_#f59e0b]"
            style={{ transform: `rotate(${-playerRotation}rad)` }}
          />
        </div>

      </div>
    </div>
  );
}
