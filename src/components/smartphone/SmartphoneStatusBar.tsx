'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function SmartphoneStatusBar() {
  const [timeStr, setTimeStr] = useState('17:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-7 w-full px-5 flex items-center justify-between text-[11px] font-mono text-white select-none">
      {/* Clock */}
      <span className="font-bold tracking-tight">{timeStr}</span>

      {/* Dynamic Notch / Dynamic Island */}
      <div className="w-16 h-3 rounded-full bg-black/90 border border-white/10" />

      {/* Signal, Wifi, Battery */}
      <div className="flex items-center space-x-1.5 text-slate-300">
        <span className="text-[9px] font-bold text-mcr-cyan">5G</span>
        <Signal className="w-3 h-3 text-white" />
        <Wifi className="w-3 h-3 text-white" />
        <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
      </div>
    </div>
  );
}
