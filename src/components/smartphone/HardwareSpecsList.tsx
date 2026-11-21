'use client';

import React from 'react';
import { Cpu, Server, Radio, Monitor, Code, BarChart3 } from 'lucide-react';

const HARDWARE_PILLARS = [
  {
    icon: Radio,
    domain: 'FOH Sound Engineering',
    tag: '32-CH DANTE RIG',
    specs: ['Behringer X32 Digital', 'Sennheiser G4 Wireless', 'ProPresenter 7 Live', 'Dante Virtual Soundcard'],
  },
  {
    icon: Monitor,
    domain: 'LED & Broadcast Matrix',
    tag: '4K ZERO LATENCY',
    specs: ['NovaStar H9 Video Wall', 'Blackmagic ATEM Switcher', 'vMix Pro 4K', 'Sony A7 III Multi-Cam'],
  },
  {
    icon: Code,
    domain: 'Software & IoT Lab',
    tag: 'FULL-STACK TECH',
    specs: ['Next.js 14 App Router', 'TypeScript & Tailwind', 'Supabase PostgreSQL', 'ESP32 IoT Sensors'],
  },
  {
    icon: BarChart3,
    domain: 'Data Science Hub',
    tag: 'SEM-PLS & ML',
    specs: ['Azure Databricks Apache Spark', 'PostgreSQL Data Pipeline', 'SmartPLS 4 Modeling', 'MOS Excel Expert'],
  },
];

export default function HardwareSpecsList() {
  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-widest px-1">
        <span>VERIFIED TELEMETRY</span>
        <span className="text-mcr-cyan">100% OPERATIONAL</span>
      </div>

      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {HARDWARE_PILLARS.map((pillar, idx) => {
          const IconComponent = pillar.icon;
          return (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-mcr-cyan/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="w-3.5 h-3.5 text-mcr-cyan" />
                  <span className="text-xs font-bold text-white tracking-tight">
                    {pillar.domain}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                  {pillar.tag}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {pillar.specs.map((item, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
