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

export default function OilGauge({ className = "w-48 h-48 md:w-56 md:h-56", hideLeftScrews = false, hideRightScrews = false }: { className?: string; hideLeftScrews?: boolean; hideRightScrews?: boolean }) {
  const sim = useSimulator();

  // Left Scale (P: 0 to 150)
  // Center Pivot. Sweeps from -135 (bottom left) to -45 (top left)
  const leftAngle = (val: number) => -135 + (val / 150) * 90;

  // Right Scale (T: -70 to 150)
  // Center Pivot. Sweeps from 135 (bottom right) to 45 (top right)
  const rightAngle = (val: number) => 135 - ((val + 70) / 220) * 90;

  const targetTemp = sim.speedLevers === 'HIGH' ? 110 : sim.speedLevers === 'CRUISE' ? 85 : 45;

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
          
          {/* ----- LEFT SCALE (P) ----- */}
          {/* Arcs: Clockwise drawing */}
          <path d={describeArc(0, 0, 78, leftAngle(0), leftAngle(50))} fill="none" stroke="#555" strokeWidth="4" />
          <path d={describeArc(0, 0, 78, leftAngle(50), leftAngle(100))} fill="none" stroke="#22cc33" strokeWidth="4" />
          <path d={describeArc(0, 0, 78, leftAngle(100), leftAngle(150))} fill="none" stroke="#ff3333" strokeWidth="4" />

          {/* Left Ticks and Numbers */}
          {[0, 50, 100, 150].map((val) => {
            const angle = leftAngle(val);
            const rad = (angle - 90) * Math.PI / 180;
            const x = Math.cos(rad) * 55;
            const y = Math.sin(rad) * 55;
            return (
              <g key={`left-${val}`}>
                <line
                  x1="0" y1="-78" x2="0" y2="-68"
                  stroke="#fff" strokeWidth="2.5"
                  transform={`rotate(${angle})`}
                />
                <text
                  x={x} y={y}
                  fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold"
                  textAnchor="middle" alignmentBaseline="middle"
                >
                  {val}
                </text>
              </g>
            );
          })}


          {/* ----- RIGHT SCALE (T) ----- */}
          {/* Arcs: Clockwise drawing */}
          <path d={describeArc(0, 0, 78, rightAngle(150), rightAngle(100))} fill="none" stroke="#ff3333" strokeWidth="4" />
          <path d={describeArc(0, 0, 78, rightAngle(100), rightAngle(0))} fill="none" stroke="#22cc33" strokeWidth="4" />
          <path d={describeArc(0, 0, 78, rightAngle(0), rightAngle(-70))} fill="none" stroke="#ffcc00" strokeWidth="4" />

          {/* Right Ticks and Numbers */}
          {[-70, 0, 50, 100, 150].map((val) => {
            const angle = rightAngle(val);
            const rad = (angle - 90) * Math.PI / 180;
            const x = Math.cos(rad) * 55;
            const y = Math.sin(rad) * 55;
            return (
              <g key={`right-${val}`}>
                <line
                  x1="0" y1="-78" x2="0" y2="-68"
                  stroke="#fff" strokeWidth="2.5"
                  transform={`rotate(${angle})`}
                />
                <text
                  x={x} y={y}
                  fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold"
                  textAnchor="middle" alignmentBaseline="middle"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* ----- TEXTS ----- */}
          <text x="0" y="-80" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold" letterSpacing="1">OIL</text>
          
          {/* Left / Right designations */}
          <text x="-40" y="-15" fill="#aaa" fontSize="14" textAnchor="middle" fontWeight="bold">P</text>
          <text x="-40" y="5" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">PSI</text>
          
          <text x="40" y="-15" fill="#aaa" fontSize="14" textAnchor="middle" fontWeight="bold">T</text>
          <text x="40" y="5" fill="#888" fontSize="10" textAnchor="middle" fontWeight="bold">°C</text>

          {/* ----- NEEDLES ----- */}
          {/* Left Needle (P) */}
          <g style={{ transform: `rotate(${leftAngle(sim.oilPressurePsi)}deg)`, transition: 'transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <line x1="2" y1="15" x2="2" y2="-72" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            <line x1="0" y1="15" x2="0" y2="-72" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <polygon points="-2,-60 0,-75 2,-60" fill="#fff" />
          </g>

          {/* Right Needle (T) */}
          <g style={{ transform: `rotate(${rightAngle(targetTemp)}deg)`, transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <line x1="2" y1="15" x2="2" y2="-72" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            <line x1="0" y1="15" x2="0" y2="-72" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <polygon points="-2,-60 0,-75 2,-60" fill="#fff" />
          </g>

          {/* Shared Center pivot cap */}
          <circle cx="0" cy="0" r="12" fill="#111" stroke="#333" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#000" />
        </g>
      </svg>
      
      {/* Glass glare */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-transparent via-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.15)] pointer-events-none"></div>
    </div>
  );
}
