'use client';

import React from 'react';
import { WorkstationCategory } from '@/lib/types';
import { CATEGORY_METADATA } from './CategoryBentoCard';
import { Cpu } from 'lucide-react';

interface HardwareStackCardProps {
  category: WorkstationCategory;
}

export default function HardwareStackCard({ category }: HardwareStackCardProps) {
  const config = CATEGORY_METADATA[category];
  if (!config) return null;

  return (
    <div className="h-full bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
      <div>
        <div className="flex items-center space-x-2 mb-3.5">
          <Cpu className="w-3.5 h-3.5 text-mcr-cyan" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            Hardware &amp; Toolchain Rig
          </span>
        </div>

        <div className="flex flex-col space-y-2">
          {config.keyHardware.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-xs font-mono text-slate-200 truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>SPECS STATUS</span>
        <span className="text-emerald-400 font-bold">CALIBRATED &bull; 60 FPS</span>
      </div>
    </div>
  );
}
