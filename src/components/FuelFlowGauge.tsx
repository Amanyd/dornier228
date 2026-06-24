"use client";
import React from 'react';
import GaugeScrew from "./GaugeScrew";
import { useSimulator } from '@/context/SimulatorContext';

export default function FuelFlowGauge({ className = "w-48 h-48 md:w-56 md:h-56", hideLeftScrews = false, hideRightScrews = false }: { className?: string; hideLeftScrews?: boolean; hideRightScrews?: boolean }) {
  const sim = useSimulator();
  
  // Calculate target based on speed lever
  const targetFuelFlow = sim.speedLevers === 'HIGH' ? 400 : sim.speedLevers === 'CRUISE' ? 250 : 0;

  // Scale 0 to 500.
  // -135 deg to 135 deg = 270 deg total.
  // 270 / 500 = 0.54 deg per unit.
  const getAngle = (val: number) => -135 + val * 0.54;

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
          {/* Tick marks. 0 to 500 every 20 units */}
          {Array.from({ length: 26 }).map((_, i) => {
            const val = i * 20;
            const angle = getAngle(val);
            const isMajor = val % 100 === 0;
            return (
              <line
                key={`tick-${i}`}
                x1="0" y1={isMajor ? "-82" : "-82"} x2="0" y2={isMajor ? "-70" : "-76"}
                stroke="#fff" strokeWidth={isMajor ? "2.5" : "1.5"}
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Numbers: 0, 100, 200, 300, 400, 500 */}
          {[0, 100, 200, 300, 400, 500].map((num) => {
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
          <text x="0" y="-30" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">FUEL FLOW</text>
          <text x="0" y="45" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">LBS/HR</text>

          {/* Needle */}
          <g style={{ transform: `rotate(${getAngle(targetFuelFlow)}deg)`, transition: 'transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <line x1="2" y1="10" x2="2" y2="-75" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            <line x1="0" y1="10" x2="0" y2="-75" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
            <polygon points="-3,-65 0,-85 3,-65" fill="#fff" />
          </g>

          {/* Center cap */}
          <circle cx="0" cy="0" r="10" fill="#111" stroke="#333" strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="#000" />
        </g>
      </svg>
      
      {/* Glass glare */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.15)] pointer-events-none"></div>
    </div>
  );
}
