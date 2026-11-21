'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { audioEngine } from '@/lib/audioEngine';
import { RefreshCw, Radio, Cpu, Layers } from 'lucide-react';

interface CardFlipViewerProps {
  frontImage: string;
  frontTag: string;
  frontTitle: string;
  specs: {
    label: string;
    value: string;
  }[];
  hardwareList: string[];
}

export default function CardFlipViewer({
  frontImage,
  frontTag,
  frontTitle,
  specs,
  hardwareList,
}: CardFlipViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playSwitchClick();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="relative w-full h-full perspective-1000 select-none">
      
      {/* 3D Flip Card Container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full relative transform-style-3d cursor-pointer rounded-xl overflow-hidden border border-white/10"
        onClick={handleFlip}
      >
        
        {/* === FRONT SIDE: Camera Shot Viewport === */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-black flex flex-col justify-between">
          <img
            src={frontImage}
            alt={frontTitle}
            className="w-full h-full object-cover"
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

          {/* Top Tally Light Indicator */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
            <span className="text-[9px] font-mono font-bold bg-black/70 border border-cyan-500/60 text-cyan-300 px-2 py-0.5 rounded flex items-center space-x-1.5 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>{frontTag}</span>
            </span>

            <button
              onClick={handleFlip}
              className="p-1 rounded bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
              title="Flip to Schematics"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Bottom Title & Flip Prompt */}
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between z-10">
            <span className="text-[10px] font-mono text-white font-bold line-clamp-1">
              {frontTitle}
            </span>
            <span className="text-[9px] font-mono text-mcr-pink uppercase font-bold tracking-wider">
              [ FLIP SPECS ]
            </span>
          </div>
        </div>

        {/* === BACK SIDE: Technical Blueprint & Hardware Signal Flow === */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-mcr-card p-3 flex flex-col justify-between border border-cyan-500/40 shadow-inner">
          
          {/* Top Blueprint Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-mcr-cyan" />
              <span className="text-[10px] font-mono font-extrabold text-white tracking-wider uppercase">
                ENGINEERING SCHEMATICS
              </span>
            </div>
            <button
              onClick={handleFlip}
              className="p-1 rounded bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
              title="Flip to Camera"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          {/* Center Specs Matrix */}
          <div className="my-auto space-y-1.5 py-1">
            <div className="grid grid-cols-2 gap-1.5">
              {specs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-1.5 rounded bg-black/40 border border-white/5 flex flex-col"
                >
                  <span className="text-[8px] font-mono text-slate-400 uppercase">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-white line-clamp-1">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Hardware Pills */}
            <div className="pt-1">
              <span className="text-[8px] font-mono text-slate-400 uppercase block mb-1">
                Hardware Toolchain:
              </span>
              <div className="flex flex-wrap gap-1">
                {hardwareList.slice(0, 4).map((hw, i) => (
                  <span
                    key={i}
                    className="text-[8px] font-mono bg-cyan-950/70 border border-cyan-800 text-cyan-300 px-1.5 py-0.5 rounded"
                  >
                    {hw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[8px] font-mono text-slate-500">
            <span>SIGNAL: ZERO LATENCY</span>
            <span className="text-cyan-400">[ CLICK TO FLIP CAM ]</span>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
