"use client";

import React from "react";
import { useSimulator } from "@/context/SimulatorContext";

export default function SystemControls() {
  const sim = useSimulator();

  return (
    <div className="mt-2 p-2.5 bg-[#162026] rounded border border-[#0f1720] text-xs md:text-sm text-[#cbd7e0]">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 xl:gap-3 items-end">
        {/* Refuel */}
        <div className="space-y-1">
          <div className="text-[10px] md:text-xs text-[#9fb0c2]">Refuel Valve</div>
          <button
            onClick={() => sim.setRefuelValveOpen(!sim.refuelValveOpen)}
            className={`w-full px-2 py-1.5 rounded font-bold ${sim.refuelValveOpen ? 'bg-[#2266ff] text-white' : 'bg-[#1a2a34] text-[#9fb0c2]'}`}
          >
            {sim.refuelValveOpen ? 'Valve OPEN' : 'Open Valve'}
          </button>
        </div>

        {/* Battery Temp */}
        <div className="space-y-1">
          <div className="text-[10px] md:text-xs text-[#9fb0c2]">Battery Temp (°C)</div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={120}
              value={sim.batteryTempC}
              onChange={(e) => sim.setBatteryTempC(Number(e.target.value))}
              className="w-full"
            />
            <div className="w-12 text-right">{sim.batteryTempC}°</div>
          </div>
        </div>

        {/* Fuel Pressure */}
        <div className="space-y-1">
          <div className="text-[10px] md:text-xs text-[#9fb0c2]">Fuel Pressure (psi)</div>
          <div className="flex items-center gap-2">
            <button onClick={() => sim.setFuelPressurePsi(Math.max(0, sim.fuelPressurePsi - 1))} className="px-2 py-1 bg-[#1a2a34] rounded text-xs">-</button>
            <div className="flex-1">
              <input type="range" min={0} max={30} value={sim.fuelPressurePsi} onChange={(e) => sim.setFuelPressurePsi(Number(e.target.value))} className="w-full" />
            </div>
            <button onClick={() => sim.setFuelPressurePsi(Math.min(100, sim.fuelPressurePsi + 1))} className="px-2 py-1 bg-[#1a2a34] rounded text-xs">+</button>
          </div>
          <div className="text-[10px] md:text-xs">{sim.fuelPressurePsi} psi {sim.fuelPressureWarning ? '(LOW - warning)' : ''}</div>
        </div>

        {/* Inlet De-ice */}
        <div className="space-y-1">
          <div className="text-[10px] md:text-xs text-[#9fb0c2]">Inlet De-ice</div>
          <button
            onClick={() => sim.setInletDeIceOn(!sim.inletDeIceOn)}
            className={`w-full px-2 py-1.5 rounded font-bold ${sim.inletDeIceOn ? 'bg-[#ffaa22] text-black' : 'bg-[#1a2a34] text-[#9fb0c2]'}`}
          >
            {sim.inletDeIceOn ? 'ANTI-ICE ON' : 'ANTI-ICE OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}
