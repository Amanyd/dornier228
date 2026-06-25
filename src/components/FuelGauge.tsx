"use client";
import React from 'react';
import GaugeScrew from "./GaugeScrew";
import { useSimulator } from '@/context/SimulatorContext';

export default function FuelGauge({ 
  className = "w-48 h-48 md:w-56 md:h-56", 
  bottomTextSize = 10, 
  hideLeftScrews = false, 
  hideRightScrews = false,
  qtyOverride
}: { 
  className?: string; 
  bottomTextSize?: number; 
  hideLeftScrews?: boolean; 
  hideRightScrews?: boolean;
  qtyOverride?: number;
}) {
  const sim = useSimulator();
  
  const qty = qtyOverride !== undefined ? qtyOverride : sim.fuelQtyLbs;
  // 10.8 degrees per 100 lbs
  const needleAngle = -135 + (qty / 100) * 10.8;

  return (
    <div className={`relative rounded-full bg-[#1b2228] border-[3px] border-[#111] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 ${className}`}>
      {/* Outer bezel ring */}
      <div className="absolute inset-0 rounded-full border-[3px] border-[#3a4a5a] opacity-50 pointer-events-none"></div>
      
      {/* Screw holes on the gauge itself */}
      {!hideLeftScrews && <GaugeScrew className="-top-2 left-1" />}
      {!hideRightScrews && <GaugeScrew className="-top-2 right-1" />}
      {!hideLeftScrews && <GaugeScrew className="-bottom-2 left-1" />}
      {!hideRightScrews && <GaugeScrew className="-bottom-2 right-1" />}

      <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0">
        <g transform="translate(100, 100)">
          {/* Tick marks. Angle range: -135 to +135 degrees. Total 270 degrees. */}
          {/* 0 to 25 -> 25 units. 270 / 25 = 10.8 degrees per unit. */}
          {Array.from({ length: 26 }).map((_, i) => {
            const angle = -135 + i * 10.8;
            const isMajor = i % 5 === 0;
            return (
              <line
                key={i}
                x1="0"
                y1={isMajor ? "-82" : "-82"}
                x2="0"
                y2={isMajor ? "-70" : "-76"}
                stroke="#fff"
                strokeWidth={isMajor ? "2.5" : "1.5"}
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Numbers */}
          {[0, 5, 10, 15, 20, 25].map((num) => {
            const angle = -135 + num * 10.8;
            // Radius for text placement: 55
            const rad = (angle - 90) * (Math.PI / 180);
            const x = Math.cos(rad) * 55;
            const y = Math.sin(rad) * 55;
            return (
              <text
                key={num}
                x={x}
                y={y}
                fill="#fff"
                fontSize="16"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {num}
              </text>
            );
          })}

          {/* Texts */}
          <text x="0" y="-20" fill="#999" fontSize="8" textAnchor="middle" letterSpacing="0.5">Feeder Tank x10</text>
          <text x="0" y="25" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">x100 lbs</text>
          <text x="0" y="65" fill="#fff" fontSize={bottomTextSize} fontWeight="bold" textAnchor="middle" letterSpacing="0.5">FUEL QTY</text>

          {/* Needle */}
          <g style={{ transform: `rotate(${needleAngle}deg)`, transition: 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            {/* Needle shadow */}
            <line x1="2" y1="10" x2="2" y2="-75" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            {/* Needle body */}
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
