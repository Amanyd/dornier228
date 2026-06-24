"use client";

import React, { useState } from 'react';
import { useSimulator } from '@/context/SimulatorContext';

type LightStatus = 'off' | 'amber' | 'red';

interface WarningLightProps {
  label: string | string[];
  status?: LightStatus;
  // If provided, forces the lamp visual on/off. When defined, disables click toggling.
  forcedOn?: boolean;
  onShowSchematic?: () => void;
}

import { playGlobalClickSound } from '@/utils/audio';

export default function WarningLight({ label, status = 'off', forcedOn, onShowSchematic }: WarningLightProps) {
  const [isOn, setIsOn] = useState(false);
  const sim = useSimulator();

  const isInteractive = status !== 'off' && forcedOn === undefined;
  const displayOn = forcedOn !== undefined ? forcedOn : isOn;

  // Base styles including elevation logic
  let baseStyles = `relative flex flex-col items-center justify-center p-1 min-h-[48px] md:min-h-[60px] rounded-[5px] transition-all duration-100 overflow-hidden select-none border-[1.5px] `;
  
  if (isInteractive || (sim.iosOpen && onShowSchematic && displayOn)) {
    baseStyles += "cursor-pointer ";
    if (!displayOn && isInteractive) {
      baseStyles += "active:translate-y-[3px] active:shadow-none ";
    }
  }


  if (displayOn) {
    baseStyles += "translate-y-[3px] ";
  }

  // Styling based on status
  let stateStyles = "";
  let textStyles = "";
  
  if (!displayOn) {
    // Unclicked state: Elevated, dark background, original glowing text colors
    const elevationShadow = "shadow-[0_4px_0_#050505,0_5px_8px_rgba(0,0,0,0.6)]";
    if (status === 'red') {
      stateStyles = `bg-[#141618] border-[#333] border-b-[#0a0a0a] ${elevationShadow}`;
      textStyles = "text-[#ff2222] font-bold drop-shadow-[0_0_6px_rgba(255,34,34,0.9)]";
    } else if (status === 'amber') {
      stateStyles = `bg-[#141618] border-[#333] border-b-[#0a0a0a] ${elevationShadow}`;
      textStyles = "text-[#ff8800] font-bold drop-shadow-[0_0_6px_rgba(255,136,0,0.9)]";
    } else {
      stateStyles = `bg-[#141618] border-[#2a2a2a] border-b-[#0a0a0a] ${elevationShadow}`;
      textStyles = "text-[#555] opacity-20 font-bold drop-shadow-none";
    }
  } else {
    // Clicked state: Depressed, dark background with faint inner color glow (light from behind)
    if (status === 'red') {
      stateStyles = "bg-[#2a1111] border-[#551111] shadow-[inset_0_0_30px_rgba(255,0,0,0.4)]";
      textStyles = "text-[#ff4444] font-extrabold drop-shadow-[0_0_12px_rgba(255,30,30,1)]";
    } else if (status === 'amber') {
      stateStyles = "bg-[#2a1c0d] border-[#663300] shadow-[inset_0_0_30px_rgba(255,120,0,0.4)]";
      textStyles = "text-[#ffaa00] font-extrabold drop-shadow-[0_0_12px_rgba(255,150,0,1)]";
    }
  }

  const labelArray = Array.isArray(label) ? label : [label];
  const previousDisplayOn = React.useRef(displayOn);

  React.useEffect(() => {
    if (displayOn !== previousDisplayOn.current) {
      playGlobalClickSound();
      previousDisplayOn.current = displayOn;
    }
  }, [displayOn]);

  const handleClick = () => {
    if (sim.iosOpen && onShowSchematic && displayOn) {
      onShowSchematic();
      playGlobalClickSound();
      return;
    }

    if (isInteractive) {
      setIsOn(!isOn);
    }
  };

  return (
    <div
      className={`${baseStyles} ${stateStyles}`}
      onClick={handleClick}
    >
      {/* Plastic/Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.8] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Matte finish: No glossy overlay */}
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {labelArray.map((line, idx) => (
          <span key={idx} className={`text-[10px] md:text-sm leading-none text-center uppercase font-sans tracking-wide ${textStyles}`}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
