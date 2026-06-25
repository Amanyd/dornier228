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
  const [isLongPress, setIsLongPress] = useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const sim = useSimulator();

  // If status is not 'off', the light can be interacted with
  const isInteractive = status !== 'off' && label !== '-';
  
  // The light is ON if either the simulator forces it on, OR the user manually clicked it on
  const displayOn = forcedOn || isOn;

  // Base styles including elevation logic
  let baseStyles = `relative flex flex-col items-center justify-center p-0.5 sm:p-1 min-h-[34px] sm:min-h-[40px] md:min-h-[46px] lg:min-h-[54px] rounded-[5px] transition-all duration-100 overflow-hidden select-none border-[1.5px] `;
  
  if (isInteractive) {
    baseStyles += "cursor-pointer ";
    if (!displayOn) {
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
    // Unclicked state
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
    // Clicked state
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      if (onShowSchematic) {
        onShowSchematic();
        playGlobalClickSound();
      }
    }, 600); // 600ms for long press
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isInteractive) return;
    
    // If it was a long press, we already handled opening the modal
    if (isLongPress) {
      e.preventDefault();
      return;
    }
    
    // Normal click: toggle light
    setIsOn(!isOn);
  };

  // Override context menu so long press on mobile doesn't pop up save image
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isInteractive) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`${baseStyles} ${stateStyles}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onContextMenu={handleContextMenu}
      style={{ touchAction: isInteractive ? 'none' : 'auto' }}
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
          <span key={idx} className={`text-[7px] sm:text-[8px] md:text-[9px] lg:text-[11px] xl:text-xs leading-[1.1] text-center uppercase font-sans tracking-tight sm:tracking-wide ${textStyles}`}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
