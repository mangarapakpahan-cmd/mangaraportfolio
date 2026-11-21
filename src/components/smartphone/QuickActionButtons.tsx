'use client';

import React from 'react';
import { audioEngine } from '@/lib/audioEngine';
import { FileDown, Mail, MessageSquare, Github, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function QuickActionButtons() {
  const handleClick = () => {
    audioEngine.playSwitchClick();
  };

  return (
    <div className="space-y-2 select-none pt-2 border-t border-white/10 font-mono text-xs">
      
      {/* Tombol Unduh CV / PDF Dossier */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href="/CV_Mangara_Pakpahan_Data_Analyst.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-mcr-cyan text-slate-950 font-bold hover:bg-cyan-300 transition-colors duration-150 shadow-[0_0_12px_rgba(6,182,212,0.35)]"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="text-[10px] tracking-wider uppercase">CV ANALYST</span>
        </a>

        <a
          href="/CV_Mangara_Pakpahan_Sosmed_Humas.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-black/80 text-white border border-white/15 transition-colors duration-150"
        >
          <FileDown className="w-3.5 h-3.5 text-mcr-pink" />
          <span className="text-[10px] tracking-wider uppercase">CV MEDIA</span>
        </a>
      </div>

      {/* Social & Contact Grid */}
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        <a
          href="mailto:mangarapakpahan@example.com"
          onClick={handleClick}
          className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-mcr-cyan/60 flex flex-col items-center justify-center space-y-1 text-slate-300 hover:text-white transition-colors"
        >
          <Mail className="w-4 h-4 text-mcr-cyan" />
          <span className="text-[9px]">EMAIL</span>
        </a>

        <a
          href="https://github.com/mangarapakpahan-cmd"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-mcr-pink/60 flex flex-col items-center justify-center space-y-1 text-slate-300 hover:text-white transition-colors"
        >
          <Github className="w-4 h-4 text-mcr-pink" />
          <span className="text-[9px]">GITHUB</span>
        </a>

        <Link
          href="/categories"
          onClick={handleClick}
          className="p-2 rounded-xl bg-black/50 border border-white/10 hover:border-mcr-orange/60 flex flex-col items-center justify-center space-y-1 text-slate-300 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-mcr-orange" />
          <span className="text-[9px]">CATALOG</span>
        </Link>
      </div>

    </div>
  );
}
