"use client";
import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Panel from "@/components/Panel";
import AnnunciatorPanel from "@/components/AnnunciatorPanel";
import IOSPanel from "@/components/IOSPanel";
import FuelGauge from "@/components/FuelGauge";
import CockpitChat from "@/components/CockpitChat";
import FuelTankSwitches from "@/components/FuelTankSwitches";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [leftFuelPos, setLeftFuelPos] = useState<'left'|'center'|'right'>('center');
  const [rightFuelPos, setRightFuelPos] = useState<'left'|'center'|'right'>('center');
  const themeAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setHasStarted(true);
    const audio = new Audio('/assets/theme.mp3');
    audio.loop = true;
    audio.volume = 0.15;
    themeAudioRef.current = audio;
    audio.play().catch(console.error);
  };

  if (!hasStarted) {
    return (
      <div 
        className="min-h-dvh w-full flex items-end justify-end bg-cover bg-center bg-no-repeat relative" 
        style={{ backgroundImage: "url('/home.png')" }}
      >
        <Panel hasScrews className="relative z-10 p-6 md:p-10 w-full max-w-xs md:max-w-sm h-32 md:h-48 flex items-center justify-center">
          <button 
            onClick={handleStart}
            className="w-full h-full px-6 py-3 md:px-8 md:py-4 bg-[#ffaa22] hover:bg-[#ffbb44] text-black text-2xl md:text-3xl font-bold rounded shadow-[0_0_15px_#ffaa22] uppercase tracking-widest transition-colors flex items-center justify-center"
          >
            Start Simulator
          </button>
        </Panel>
      </div>
    );
  }

  return (
    <main className="min-h-dvh md:h-dvh w-full flex flex-col bg-[#2a3a4c] overflow-y-auto md:overflow-hidden">
      <Navbar />
      {/* Main Dashboard Area - Constrained to remaining height */}
      <div className="flex-1 min-h-0 p-2 pb-4 w-full grid grid-cols-1 md:grid-cols-[1fr_1.8fr_1fr] gap-2">

        {/* Left Vertical Panel - Chat */}
        <Panel hasScrews hideBottomScrews className="w-full flex flex-col p-0 h-full min-h-0 md:min-h-[340px] overflow-hidden relative z-10">
           <CockpitChat />
        </Panel>

        {/* Center Horizontal Stack */}
        <div className="flex flex-col gap-2 w-full h-full min-w-0">
          {/* Top Center Panel */}
          <Panel hasScrews className="w-full p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col items-center justify-center flex-[2] md:flex-[2.5] min-h-0">
            {/* Caution Placard */}
            <div className="bg-[#2a3c75] border-[1.5px] border-[#182352] text-white text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-6 md:px-10 lg:px-18 py-1.5 md:py-3 mb-4 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.6)] font-semibold tracking-widest relative flex items-center justify-center text-center leading-tight shrink-0">
              {/* Inset white border */}
              <div className="absolute inset-1.5 md:inset-2 border-[1.5px] border-white/60 pointer-events-none z-0"></div>
              <span className="relative z-10 text-center">CAUTION: DO NOT OPERATE ANY BRAKE DURING TOWING</span>
            </div>
            <div className="w-full h-full min-h-0 flex items-center justify-center overflow-hidden">
              <AnnunciatorPanel />
            </div>
          </Panel>

          {/* Bottom Center Panel */}
          <Panel hasScrews className="w-full p-2 md:p-3 flex-1 min-h-0 flex flex-col justify-center items-center overflow-hidden">
            <div className="flex flex-row items-center justify-between w-full h-full px-1 md:px-2 min-h-0 gap-2">
              <FuelGauge 
                className="w-[30%] max-w-[150px] aspect-square shrink-1" 
                bottomTextSize={12} 
                qtyOverride={leftFuelPos === 'left' ? 1306 : leftFuelPos === 'center' ? 2521 : 250}
              />
              {/* Fuel Tank Switches */}
              <div className="flex-1 h-full flex items-center justify-center min-w-0 shrink">
                <FuelTankSwitches 
                  leftPos={leftFuelPos} setLeftPos={setLeftFuelPos}
                  rightPos={rightFuelPos} setRightPos={setRightFuelPos}
                />
              </div>
              <FuelGauge 
                className="w-[30%] max-w-[150px] aspect-square shrink-1" 
                bottomTextSize={12} 
                qtyOverride={rightFuelPos === 'right' ? 1306 : rightFuelPos === 'center' ? 2521 : 250}
              />
            </div>
          </Panel>
        </div>

        {/* Right Vertical Panel - Chat & IOS */}
        <IOSPanel />

      </div>
    </main>
  );
}
