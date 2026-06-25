"use client";

import React, { useState } from 'react';

const SidewaysToggle = ({ 
  position, 
  onChange 
}: { 
  position: 'left' | 'center' | 'right'; 
  onChange: (pos: 'left' | 'center' | 'right') => void;
}) => {
  const rotMap = {
    'left': '-rotate-[45deg]',
    'center': 'rotate-0',
    'right': 'rotate-[45deg]'
  };

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/assets/button.mp3');
      audio.volume = 1.0;
      audio.play().catch(() => {});
    }
    if (position === 'left') onChange('center');
    else if (position === 'center') onChange('right');
    else onChange('left');
  };

  return (
    <div 
      className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer group shrink-0"
      onClick={handleClick}
    >
      {/* Outer base ring (dark grey metal) */}
      <div className="absolute w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-[#3a3d40] border-[2px] border-[#111] shadow-[0_2px_5px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center">
        {/* Inner black recess */}
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[#0a0a0a] shadow-[inset_0_3px_6px_rgba(0,0,0,1)]"></div>
        {/* Slotted nut details */}
        <div className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-[2px] md:border-[3px] border-dashed border-[#1a1a1a] opacity-60 pointer-events-none"></div>
      </div>
      
      {/* Bat handle */}
      <div 
        className={`absolute w-[10px] sm:w-[12px] md:w-[16px] h-8 sm:h-10 md:h-12 bottom-1/2 origin-bottom transition-transform duration-150 ease-out z-10 ${rotMap[position]}`}
      >
        {/* The handle shaft */}
        <div className="w-full h-full bg-gradient-to-r from-[#222] via-[#555] to-[#111] rounded-t-full shadow-[3px_3px_6px_rgba(0,0,0,0.8)] border-[1px] border-[#0a0a0a] relative overflow-hidden group-active:scale-95 transition-transform">
          {/* Subtle reflection */}
          <div className="absolute top-1 left-[20%] w-[20%] h-[80%] bg-white opacity-20 rounded-full"></div>
        </div>
      </div>
      
      {/* Base pivot shadow/cover */}
      <div className="absolute w-5 h-5 bg-gradient-to-br from-[#333] to-[#111] rounded-full z-20 shadow-[0_2px_4px_rgba(0,0,0,0.6)] border-[1px] border-[#111]"></div>
    </div>
  );
};

export default function FuelTankSwitches() {
  const [leftPos, setLeftPos] = useState<'left'|'center'|'right'>('center');
  const [rightPos, setRightPos] = useState<'left'|'center'|'right'>('center');

  return (
    <div className="relative w-full h-full flex items-center justify-center p-1 md:p-2 min-h-[100px] min-w-0">
      {/* The black plate */}
      <div className="w-full max-w-[400px] bg-[#1c1f22] border-[2px] border-[#111] rounded-[2px] p-1 relative shadow-[0_6px_15px_rgba(0,0,0,0.8)] min-w-0 shrink">
        {/* White thin border inset */}
        <div className="absolute inset-[4px] border-[1.5px] border-[#e0e0e0] opacity-80 rounded-[1px] pointer-events-none"></div>

        {/* Inner Content Container */}
        <div className="relative z-10 w-full flex flex-row items-center justify-center py-2 sm:py-4 px-1 sm:px-2 min-w-0 gap-1 sm:gap-2">
          
          {/* Left OUTER Label */}
          <div className="flex flex-col items-center justify-center mb-6 shrink-0">
            <span className="text-[#e0e0e0] font-bold text-[7px] md:text-[10px] tracking-wide">OUTER</span>
            <div className="border-[1.5px] border-[#e0e0e0] px-0.5 mt-[2px]">
              <span className="text-[#e0e0e0] font-bold text-[5px] md:text-[8px] tracking-tight">+AUX-T</span>
            </div>
          </div>

          {/* Left Switch Group */}
          <div className="flex flex-col items-center justify-center relative shrink-0">
            <span className="text-[#e0e0e0] font-bold text-[7px] md:text-[10px] tracking-wide mb-1">TOTAL</span>
            <SidewaysToggle position={leftPos} onChange={setLeftPos} />
            <span className="text-[#e0e0e0] font-bold text-[8px] md:text-[11px] tracking-wide mt-2 whitespace-nowrap">LEFT WING</span>
          </div>

          {/* Center FEEDER TANK */}
          <div className="flex flex-col items-center justify-start shrink-0 self-start mt-1">
            <span className="text-[#e0e0e0] font-bold text-[7px] md:text-[10px] tracking-wide text-center leading-[1.1]">
              FEEDER<br/>TANK
            </span>
          </div>

          {/* Right Switch Group */}
          <div className="flex flex-col items-center justify-center relative shrink-0">
            <span className="text-[#e0e0e0] font-bold text-[7px] md:text-[10px] tracking-wide mb-1">TOTAL</span>
            <SidewaysToggle position={rightPos} onChange={setRightPos} />
            <span className="text-[#e0e0e0] font-bold text-[8px] md:text-[11px] tracking-wide mt-2 whitespace-nowrap">RIGHT WING</span>
          </div>

          {/* Right OUTER Label */}
          <div className="flex flex-col items-center justify-center mb-6 shrink-0">
            <span className="text-[#e0e0e0] font-bold text-[7px] md:text-[10px] tracking-wide">OUTER</span>
            <div className="border-[1.5px] border-[#e0e0e0] px-0.5 mt-[2px]">
              <span className="text-[#e0e0e0] font-bold text-[5px] md:text-[8px] tracking-tight">+AUX-T</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
