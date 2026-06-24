"use client";
import React from 'react';
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

export default function ITTGauge({ className = "w-48 h-48 md:w-56 md:h-56", hideLeftScrews = false, hideRightScrews = false }: { className?: string; hideLeftScrews?: boolean; hideRightScrews?: boolean }) {
  const sim = useSimulator();
  
  // Calculate target based on speed lever
  const targetItt = sim.speedLevers === 'HIGH' ? 9.5 : sim.speedLevers === 'CRUISE' ? 7.5 : 3;

  // Scale 3 to 12.
  // 3 is at -150 deg, 12 is at 30 deg. (180 deg total, 20 deg per unit)
  const getAngle = (val: number) => -150 + (val - 3) * 20;

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
          {/* Green Arc from 4 to 8 */}
          <path d={describeArc(0, 0, 82, getAngle(4), getAngle(8))} fill="none" stroke="#22cc33" strokeWidth="4" />
          
          {/* Orange/Red small markings at 9 */}
          <path d={describeArc(0, 0, 82, getAngle(8.8), getAngle(9))} fill="none" stroke="#ffaa00" strokeWidth="4" />
          <path d={describeArc(0, 0, 82, getAngle(9), getAngle(9.2))} fill="none" stroke="#ff3333" strokeWidth="4" />

          {/* Tick marks. 3 to 12. */}
          {Array.from({ length: 10 }).map((_, i) => {
            const val = i + 3;
            const angle = getAngle(val);
            return (
              <line
                key={`major-${i}`}
                x1="0" y1="-82" x2="0" y2="-70"
                stroke="#fff" strokeWidth="2.5"
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Minor ticks every 0.5 */}
          {Array.from({ length: 9 }).map((_, i) => {
            const val = i + 3.5;
            const angle = getAngle(val);
            return (
              <line
                key={`minor-${i}`}
                x1="0" y1="-82" x2="0" y2="-76"
                stroke="#fff" strokeWidth="1.5"
                transform={`rotate(${angle})`}
              />
            );
          })}
          
          {/* Orange Triangle at 11.5 */}
          <g transform={`rotate(${getAngle(11.5)})`}>
            <polygon points="-4,-86 4,-86 0,-76" fill="#ff7700" />
          </g>

          {/* Numbers: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 */}
          {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const angle = getAngle(num);
            // 11 and 12 need to be shifted slightly to not overlap with text
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
          <text x="0" y="-15" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">ITT</text>
          <text x="0" y="45" fill="#fff" fontSize="12" textAnchor="middle" fontWeight="bold">°C X 100</text>
          
          <text x="35" y="60" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">OFF</text>

          {/* Orange warning text near 11 */}
          <text x="55" y="-15" fill="#ff7700" fontSize="8" fontWeight="bold" textAnchor="middle">ST. LIM</text>
          <text x="55" y="-5" fill="#ff7700" fontSize="8" fontWeight="bold" textAnchor="middle">1149°</text>

          {/* Needle */}
          <g style={{ transform: `rotate(${getAngle(targetItt)}deg)`, transition: 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
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
