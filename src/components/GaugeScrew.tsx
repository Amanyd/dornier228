import React from 'react';

export default function GaugeScrew({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute w-3 h-3 rounded-full bg-[#4a4f54] border border-[#222] shadow-[0_1px_1px_rgba(255,255,255,0.1),inset_0_2px_3px_rgba(0,0,0,0.6)] flex items-center justify-center ${className}`}>
      <div className="w-2 h-[1.5px] bg-[#222] rotate-45 shadow-[inset_0_0_1px_rgba(0,0,0,0.5)]"></div>
    </div>
  );
}
