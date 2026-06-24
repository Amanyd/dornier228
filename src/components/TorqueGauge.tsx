"use client";
import React from 'react';
import GaugeScrew from "./GaugeScrew";
import { useSimulator } from '@/context/SimulatorContext';

export default function TorqueGauge({ className = "w-48 h-48 md:w-56 md:h-56", hideLeftScrews = false, hideRightScrews = false }: { className?: string; hideLeftScrews?: boolean; hideRightScrews?: boolean }) {
  const sim = useSimulator();
  
  // Calculate target based on speed lever
  const targetTorque = sim.speedLevers === 'HIGH' ? 95 : sim.speedLevers === 'CRUISE' ? 70 : 0;

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
          {/* Green Arc from 20 (-90 deg) to 100 (90 deg) at radius 82 */}
          <path d="M -82 0 A 82 82 0 0 1 82 0" fill="none" stroke="#22cc33" strokeWidth="4" />
          
          {/* Red line at 100 (90 deg) */}
          <line x1="0" y1="-85" x2="0" y2="-70" stroke="#ff3333" strokeWidth="4" transform="rotate(90)" />

          {/* Tick marks. 0 to 120 -> 120 units. 270 deg / 120 = 2.25 deg/unit. */}
          {Array.from({ length: 13 }).map((_, i) => {
            const num = i * 10;
            const angle = -135 + num * 2.25;
            const isMajor = num % 20 === 0;
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
          
          {/* Numbers: 0, 20, 40, 60, 80, 100, 120 */}
          {[0, 20, 40, 60, 80, 100, 120].map((num) => {
            const angle = -135 + num * 2.25;
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
          <text x="0" y="-15" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">TORQUE</text>
          <text x="0" y="45" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold">%</text>
          
          {/* 'OFF' label near 0 tick. 0 is at -135 deg. We'll place it at radius 65, angle -150 */}
          <text x="-56" y="32" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">OFF</text>

          {/* Needle */}
          <g style={{ transform: `rotate(${-135 + targetTorque * 2.25}deg)`, transition: 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
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
