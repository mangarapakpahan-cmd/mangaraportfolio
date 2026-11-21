'use client';

import React from 'react';
import { useGameStore } from '@/lib/store';
import { WORKSTATION_SPATIAL_DATA, SERVER_RACK_COORDS } from '../3d/StudioScene';

export default function MiniMapRadarWidget() {
  const { playerPosition, playerRotation, nearbyZone } = useGameStore();

  // Convert 3D world coordinates [-18 to 18 X, -12 to 8 Z] into radar percentage
  const mapToRadar = (x: number, z: number) => {
    const rx = 50 + (x / 36) * 78;
    const ry = 50 + (z / 24) * 78;
    return {
      left: `${Math.max(12, Math.min(88, rx))}%`,
      top: `${Math.max(12, Math.min(88, ry))}%`,
    };
  };

  const pCoord = mapToRadar(playerPosition[0], playerPosition[2]);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-20 pointer-events-none select-none flex flex-col items-start space-y-1.5">
      
      {/* Title & Key Instructions */}
      <div className="text-left font-mono">
        <div className="text-white font-extrabold text-xs md:text-sm tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          [W][A][S][D]
        </div>
        <div className="text-slate-300 font-medium text-[10px] md:text-xs tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Mouse to Move
        </div>
      </div>

      {/* Radar Disc Housing */}
      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-cyan-500/50 bg-[#070b14]/90 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Radar concentric range circles */}
        <div className="absolute inset-2.5 rounded-full border border-cyan-500/20" />
        <div className="absolute inset-6 rounded-full border border-cyan-500/30" />
        <div className="absolute inset-10 rounded-full border border-cyan-500/40" />

        {/* Crosshair grid lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/20 -translate-x-1/2" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20 -translate-y-1/2" />

        {/* Rotating Radar Scanner Sweep */}
        <div className="absolute inset-0 animate-radar-sweep pointer-events-none origin-center">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/25 to-transparent rounded-tl-full" />
        </div>

        {/* Compass Cardinal Points */}
        <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-cyan-300">
          N
        </span>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-cyan-500/60">
          S
        </span>
        <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-cyan-500/60">
          W
        </span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold text-cyan-500/60">
          E
        </span>

        {/* 5 Workstation Pin Markers */}
        {WORKSTATION_SPATIAL_DATA.map((ws) => {
          const coord = mapToRadar(ws.position[0], ws.position[2]);
          const isNearby = nearbyZone === ws.id;
          return (
            <div
              key={ws.id}
              style={{ left: coord.left, top: coord.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-colors duration-150 ${
                  isNearby
                    ? 'border-white bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                    : 'border-cyan-400/60 bg-cyan-900/80'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          );
        })}

        {/* Server Rack Marker */}
        {(() => {
          const rackCoord = mapToRadar(SERVER_RACK_COORDS[0], SERVER_RACK_COORDS[2]);
          return (
            <div
              style={{ left: rackCoord.left, top: rackCoord.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-sm bg-amber-400 border border-amber-300/80 shadow-[0_0_6px_#f59e0b]" />
            </div>
          );
        })()}

        {/* Player Indicator (Orange Directional Arrow) */}
        <div
          style={{
            left: pCoord.left,
            top: pCoord.top,
            transform: `translate(-50%, -50%) rotate(${(-playerRotation * 180) / Math.PI}deg)`,
          }}
          className="absolute z-10 transition-transform duration-75"
        >
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
        </div>

      </div>

    </div>
  );
}
