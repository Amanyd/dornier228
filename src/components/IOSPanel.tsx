"use client";

import React, { useRef, useEffect } from "react";
import { useSimulator } from "@/context/SimulatorContext";
import Panel from "./Panel";

import CockpitChat from "./CockpitChat";

import { playGlobalClickSound as playClickSound } from "@/utils/audio";

export default function IOSPanel() {
  const sim = useSimulator();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sim.iosOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [sim.iosOpen]);

  return (
    <Panel 
      id="right-panel"
      hasScrews 
      hideBottomScrews
      className={`w-full h-full flex flex-col p-0 min-h-[240px] md:min-h-[340px] overflow-hidden relative transition-all duration-300 ${
        sim.iosOpen ? "z-[110] shadow-[0_0_50px_rgba(0,0,0,0.8)]" : "z-10"
      }`}
    >
      <CockpitChat />
      
      <div
      className={`absolute inset-0 w-full h-full bg-[#1a2228] z-50 transform transition-transform duration-300 ease-in-out ${
        sim.iosOpen ? "translate-x-0" : "translate-x-full"
      } flex flex-col`}
    >
      <div className="h-full w-full p-4 flex flex-col gap-4 border-l-[2px] border-[#111]">
        <div className="flex items-center justify-center pb-2">
          <h2 className="text-[#c1d0df] text-lg font-bold tracking-widest uppercase">
            Instructor Station
          </h2>
        </div>

        <div ref={scrollRef} className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-custom flex-1 min-h-0">
          {/* Malfunctions / Scenarios */}
          <div className="space-y-4">
            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2">
              System Overrides
            </h3>
            
            {/* Battery Temp */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Battery Temp (°C)</span>
                <span className={sim.batteryOverheat ? "text-red-500 font-bold" : ""}>
                  {sim.batteryTempC}°
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range"
                  min={0}
                  max={120}
                  value={sim.batteryTempC}
                  onChange={(e) => sim.setBatteryTempC(Number(e.target.value))}
                  className="w-full accent-[#ffaa22]"
                />
              </div>
            </div>

            {/* Fuel Pressure */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Fuel Pressure (psi)</span>
                <span className={sim.fuelPressureWarning ? "text-red-500 font-bold" : ""}>
                  {sim.fuelPressurePsi} psi
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => { playClickSound(); sim.setFuelPressurePsi(Math.max(0, sim.fuelPressurePsi - 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={30} 
                  value={sim.fuelPressurePsi} 
                  onChange={(e) => sim.setFuelPressurePsi(Number(e.target.value))} 
                  className="w-full accent-[#ffaa22]" 
                />
                <button 
                  onClick={() => { playClickSound(); sim.setFuelPressurePsi(Math.min(100, sim.fuelPressurePsi + 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Fuel Quantity */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Fuel Qty (lbs)</span>
                <span className={sim.fuelQtyWarning ? "text-[#ffaa22] font-bold" : ""}>
                  {sim.fuelQtyLbs} lbs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => { playClickSound(); sim.setFuelQtyLbs(Math.max(0, sim.fuelQtyLbs - 50)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={1000} 
                  step={10}
                  value={sim.fuelQtyLbs} 
                  onChange={(e) => sim.setFuelQtyLbs(Number(e.target.value))} 
                  className="w-full accent-[#ffaa22]" 
                />
                <button 
                  onClick={() => { playClickSound(); sim.setFuelQtyLbs(Math.min(1000, sim.fuelQtyLbs + 50)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Fuel Filter Delta P */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Fuel Filter ΔP (psi)</span>
                <span className={sim.fuelFilterCaution ? "text-[#ffaa22] font-bold" : ""}>
                  {sim.fuelFilterDeltaPPsi} psi
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => { playClickSound(); sim.setFuelFilterDeltaPPsi(Math.max(0, sim.fuelFilterDeltaPPsi - 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={20} 
                  value={sim.fuelFilterDeltaPPsi} 
                  onChange={(e) => sim.setFuelFilterDeltaPPsi(Number(e.target.value))} 
                  className="w-full accent-[#ffaa22]" 
                />
                <button 
                  onClick={() => { playClickSound(); sim.setFuelFilterDeltaPPsi(Math.min(30, sim.fuelFilterDeltaPPsi + 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Oil Pressure */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Oil Pressure (psi)</span>
                <span className={sim.oilWarning ? "text-red-500 font-bold" : ""}>
                  {sim.oilPressurePsi} psi
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => { playClickSound(); sim.setOilPressurePsi(Math.max(0, sim.oilPressurePsi - 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={100} 
                  value={sim.oilPressurePsi} 
                  onChange={(e) => sim.setOilPressurePsi(Number(e.target.value))} 
                  className="w-full accent-[#ffaa22]" 
                />
                <button 
                  onClick={() => { playClickSound(); sim.setOilPressurePsi(Math.min(100, sim.oilPressurePsi + 1)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  +
                </button>
              </div>
            </div>

            {/* Refuel */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2">Ground Servicing</div>
              <button
                onClick={() => { playClickSound(); sim.setRefuelValveOpen(!sim.refuelValveOpen); }}
                className={`w-full px-2 py-2 rounded font-bold transition-colors ${
                  sim.refuelValveOpen 
                    ? 'bg-[#2266ff] text-white shadow-[0_0_10px_#2266ff]' 
                    : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                }`}
              >
                {sim.refuelValveOpen ? 'REFUEL VALVE OPEN' : 'OPEN REFUEL VALVE'}
              </button>
            </div>

            {/* Inlet De-ice */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2">Environmental Conditions</div>
              <button
                onClick={() => { playClickSound(); sim.setInletDeIceOn(!sim.inletDeIceOn); }}
                className={`w-full px-2 py-2 rounded font-bold transition-colors mb-2 ${
                  sim.inletDeIceOn 
                    ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                    : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                }`}
              >
                {sim.inletDeIceOn ? 'INLET ICE DETECTED' : 'SIMULATE ICING'}
              </button>
              <button
                onClick={() => { playClickSound(); sim.setPitotFault(!sim.pitotFault); }}
                className={`w-full px-2 py-2 rounded font-bold transition-colors ${
                  sim.pitotFault 
                    ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                    : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                }`}
              >
                {sim.pitotFault ? 'PITOT HEAT FAULT' : 'INJECT PITOT FAULT'}
              </button>
            </div>

            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2 mt-6">
              Flight Controls & Systems
            </h3>
            
            {/* Airspeed / Vmo */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Indicated Airspeed (KIAS)</span>
                <span className={sim.vmoWarning ? "text-red-500 font-bold" : ""}>
                  {sim.airspeedKnots} kts
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => { playClickSound(); sim.setAirspeedKnots(Math.max(0, sim.airspeedKnots - 10)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  -
                </button>
                <input 
                  type="range" 
                  min={0} 
                  max={300} 
                  step={5}
                  value={sim.airspeedKnots} 
                  onChange={(e) => sim.setAirspeedKnots(Number(e.target.value))} 
                  className="w-full accent-[#ffaa22]" 
                />
                <button 
                  onClick={() => { playClickSound(); sim.setAirspeedKnots(Math.min(300, sim.airspeedKnots + 10)); }} 
                  className="px-3 py-1 bg-[#2a3a44] hover:bg-[#3a4a54] rounded text-white"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Speed Levers */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2">Speed Levers</div>
              <div className="flex gap-2">
                {['LOW', 'CRUISE', 'HIGH'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => { playClickSound(); sim.setSpeedLevers(mode as any); }}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                      sim.speedLevers === mode 
                        ? 'bg-[#ffaa22] text-black shadow-[0_0_8px_#ffaa22]' 
                        : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* NWS 45° Logic */}
            <div className="space-y-2 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] flex justify-between">
                <span>Nose Wheel Steering (45°)</span>
                <span className={sim.nws45Caution ? "text-[#ffaa22] font-bold" : "text-[#4a5a6a]"}>
                  CAUTION
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => { playClickSound(); sim.setHydraulicSwitch(!sim.hydraulicSwitch); }}
                  className={`w-full px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                    sim.hydraulicSwitch ? 'bg-[#22cc33] text-black shadow-[0_0_8px_#22cc33]' : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  HYDRAULIC SWITCH: {sim.hydraulicSwitch ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setNwsSwitch(!sim.nwsSwitch); }}
                  className={`w-full px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                    sim.nwsSwitch ? 'bg-[#22cc33] text-black shadow-[0_0_8px_#22cc33]' : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  NWS SWITCH: {sim.nwsSwitch ? 'ON' : 'OFF'}
                </button>
                <button
                  onMouseDown={() => { playClickSound(); sim.setNws45Button(true); }}
                  onMouseUp={() => sim.setNws45Button(false)}
                  onMouseLeave={() => sim.setNws45Button(false)}
                  className={`w-full px-2 py-1.5 rounded text-xs font-bold transition-colors ${
                    sim.nws45Button ? 'bg-[#ffaa22] text-black shadow-[0_0_8px_#ffaa22]' : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  NWS 45° BUTTON (HOLD)
                </button>
              </div>
            </div>

            {/* NWS Bypass */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>NWS Bypass (SCU)</span>
                <span className={sim.nwsBypassWarning ? "text-red-500 font-bold" : "text-[#4a5a6a]"}>
                  FAULT
                </span>
              </div>
              <button
                onClick={() => { playClickSound(); sim.setScuFault(!sim.scuFault); }}
                className={`w-full px-2 py-2 rounded font-bold transition-colors ${
                  sim.scuFault 
                    ? 'bg-[#ff3333] text-white shadow-[0_0_10px_#ff3333]' 
                    : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                }`}
              >
                {sim.scuFault ? 'SCU FAULT DETECTED' : 'INJECT SCU FAULT'}
              </button>
            </div>

            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2 mt-6">
              Airframe
            </h3>
            
            {/* Doors */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>Doors / Hatches</span>
                <span className={sim.doorWarning ? "text-red-500 font-bold" : "text-[#4a5a6a]"}>
                  WARNING
                </span>
              </div>
              <button
                onClick={() => { playClickSound(); sim.setDoorsOpen(!sim.doorsOpen); }}
                className={`w-full px-2 py-2 rounded font-bold transition-colors ${
                  sim.doorsOpen 
                    ? 'bg-[#ff3333] text-white shadow-[0_0_10px_#ff3333]' 
                    : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                }`}
              >
                {sim.doorsOpen ? 'DOORS UNSECURED' : 'OPEN DOORS'}
              </button>
            </div>

            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2 mt-6">
              Engine Start
            </h3>
            
            {/* Start Select */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>Start Select Switch</span>
                <span className={sim.startSelectWarning ? "text-red-500 font-bold" : "text-[#4a5a6a]"}>
                  WARNING
                </span>
              </div>
              <div className="flex gap-2">
                {['OFF', 'VENT', 'GND'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => { playClickSound(); sim.setStartSelectSwitch(mode as any); }}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-colors ${
                      sim.startSelectSwitch === mode 
                        ? 'bg-[#ffaa22] text-black shadow-[0_0_8px_#ffaa22]' 
                        : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2 mt-6">
              Electrical System
            </h3>
            
            {/* Batteries */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>Batteries</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { playClickSound(); sim.setBatt1Fault(!sim.batt1Fault); }}
                  className={`flex-1 py-2 rounded font-bold transition-colors text-xs ${
                    sim.batt1Fault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  BATT 1 FAULT
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setBatt2Fault(!sim.batt2Fault); }}
                  className={`flex-1 py-2 rounded font-bold transition-colors text-xs ${
                    sim.batt2Fault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  BATT 2 FAULT
                </button>
              </div>
            </div>

            {/* Inverters */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>Inverters</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { playClickSound(); sim.setInv1Fault(!sim.inv1Fault); }}
                  className={`flex-1 py-2 rounded font-bold transition-colors text-xs ${
                    sim.inv1Fault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  INV 1 FAULT
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setInv2Fault(!sim.inv2Fault); }}
                  className={`flex-1 py-2 rounded font-bold transition-colors text-xs ${
                    sim.inv2Fault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  INV 2 FAULT
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <h3 className="text-[#8fa8c0] text-xs font-bold tracking-widest uppercase border-l-2 border-[#ffaa22] pl-2">
              Miscellaneous Systems
            </h3>

            {/* Miscellaneous Toggles */}
            <div className="space-y-1 bg-[#1a2530] p-3 border border-[#2a3a44] rounded">
              <div className="text-[10px] md:text-xs text-[#9fb0c2] mb-2 flex justify-between">
                <span>System Faults & Triggers</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { playClickSound(); sim.setGenFault(!sim.genFault); }}
                  className={`w-full py-2 rounded font-bold transition-colors text-xs ${
                    sim.genFault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  GEN FAULT
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setCabinTempFault(!sim.cabinTempFault); }}
                  className={`w-full py-2 rounded font-bold transition-colors text-xs ${
                    sim.cabinTempFault 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  CABIN TEMP HIGH
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setFuelDumpActive(!sim.fuelDumpActive); }}
                  className={`w-full py-2 rounded font-bold transition-colors text-xs ${
                    sim.fuelDumpActive 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  FUEL DUMP ACTIVE
                </button>
                <button
                  onClick={() => { playClickSound(); sim.setBleedPressHigh(!sim.bleedPressHigh); }}
                  className={`w-full py-2 rounded font-bold transition-colors text-xs ${
                    sim.bleedPressHigh 
                      ? 'bg-[#ffaa22] text-black shadow-[0_0_10px_#ffaa22]' 
                      : 'bg-[#2a3a44] hover:bg-[#3a4a54] text-[#9fb0c2]'
                  }`}
                >
                  BLEED PRESS HIGH
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-[#222]">
            <p className="text-[10px] text-[#607888] leading-tight">
              Use this panel to simulate hardware faults and environmental conditions that trigger Central Warning System (CWS) annunciations.
            </p>
          </div>
        </div>
      </div>
      </div>
    </Panel>
  );
}
