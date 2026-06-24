"use client";
import React, { useEffect, useState } from 'react';
import GaugeScrew from "./GaugeScrew";
import { useSimulator } from '@/context/SimulatorContext';

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const polarToCartesian = (centerX: number, centerY: number, rad: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (rad * Math.cos(angleInRadians)),
      y: centerY + (rad * Math.sin(angleInRadians))
    };
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export default function RPMGauge({ className = "w-48 h-48 md:w-56 md:h-56", hideLeftScrews = false, hideRightScrews = false }: { className?: string; hideLeftScrews?: boolean; hideRightScrews?: boolean }) {
  const sim = useSimulator();
  
  // Calculate target based on speed lever
  const targetRpm = sim.speedLevers === 'HIGH' ? 100 : sim.speedLevers === 'CRUISE' ? 85 : 0;
  
  // For smooth digital display
  const [displayRpm, setDisplayRpm] = useState(targetRpm);
  
  useEffect(() => {
    // Simple interpolation for the digital display to match the CSS needle transition somewhat
    const interval = setInterval(() => {
      setDisplayRpm(prev => {
        const diff = targetRpm - prev;
        if (Math.abs(diff) < 0.1) return targetRpm;
        return prev + diff * 0.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [targetRpm]);

  // Scale 0 to 100.
  // -135 deg to 135 deg = 270 deg total.
  // 270 / 100 = 2.7 deg per unit.
  const getAngle = (val: number) => -135 + val * 2.7;

  return (
    <div className={`relative rounded-full bg-[#1b2228] border-[3px] border-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer bezel ring */}
      <div className="absolute inset-0 rounded-full border-[3px] border-[#3a4a5a] opacity-50 pointer-events-none"></div>
      
      {/* Screw holes */}
      {!hideLeftScrews && <GaugeScrew className="-top-2 left-1" />}
      {!hideRightScrews && <GaugeScrew className="-top-2 right-1" />}
      {!hideLeftScrews && <GaugeScrew className="-bottom-2 left-1" />}
      {!hideRightScrews && <GaugeScrew className="-bottom-2 right-1" />}

      <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0">
        <g transform="translate(100, 100)">
          {/* Green Arc from 60 to 100 */}
          <path d={describeArc(0, 0, 80, getAngle(60), getAngle(100))} fill="none" stroke="#22cc33" strokeWidth="4" />
          
          {/* Yellow Arc from 80 to 100 (slightly outside) */}
          <path d={describeArc(0, 0, 86, getAngle(80), getAngle(100))} fill="none" stroke="#ffcc00" strokeWidth="4" />

          {/* Orange Triangle at 100 */}
          <g transform={`rotate(${getAngle(100)})`}>
            <polygon points="-4,-96 4,-96 0,-86" fill="#ff7700" />
          </g>

          {/* Tick marks. 0 to 100 every 5 units */}
          {Array.from({ length: 21 }).map((_, i) => {
            const val = i * 5;
            const angle = getAngle(val);
            const isMajor = val % 20 === 0;
            return (
              <line
                key={`tick-${i}`}
                x1="0" y1={isMajor ? "-82" : "-82"} x2="0" y2={isMajor ? "-70" : "-76"}
                stroke="#fff" strokeWidth={isMajor ? "2.5" : "1.5"}
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Numbers: 0, 20, 40, 60, 80, 100 */}
          {[0, 20, 40, 60, 80, 100].map((num) => {
            const angle = getAngle(num);
            const rad = (angle - 90) * (Math.PI / 180);
            const r = 55;
            const x = Math.cos(rad) * r;
            const y = Math.sin(rad) * r;
            return (
              <text
                key={num}
                x={x} y={y}
                fill="#fff" fontSize="16" fontFamily="sans-serif" fontWeight="bold"
                textAnchor="middle" alignmentBaseline="middle"
              >
                {num}
              </text>
            );
          })}

          {/* Texts */}
          <text x="0" y="30" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">% RPM</text>

          {/* Needle */}
          <g style={{ transform: `rotate(${getAngle(targetRpm)}deg)`, transition: 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <line x1="2" y1="10" x2="2" y2="-75" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            <line x1="0" y1="10" x2="0" y2="-75" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <polygon points="-3,-65 0,-85 3,-65" fill="#fff" />
          </g>

          {/* Center cap */}
          <circle cx="0" cy="0" r="10" fill="#111" stroke="#333" strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#000" />
        </g>
      </svg>
      
      {/* Digital Readout overlay */}
      <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 bg-[#050505] border-[1.5px] border-[#333] rounded-[3px] px-2 py-[2px] shadow-[inset_0_0_8px_rgba(0,0,0,1)] flex items-center justify-center min-w-[50px]">
        <span className="text-[#ff7700] font-mono text-sm md:text-base font-bold tracking-widest drop-shadow-[0_0_4px_rgba(255,119,0,0.8)] leading-none">{displayRpm.toFixed(1)}</span>
      </div>

      {/* Glass glare */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.15)] pointer-events-none"></div>
    </div>
  );
}
