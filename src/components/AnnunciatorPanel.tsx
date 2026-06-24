"use client";

import React, { useState } from 'react';
import WarningLight from './WarningLight';
import { useSimulator } from '@/context/SimulatorContext';
import SchematicModal from './SchematicModal';

export default function AnnunciatorPanel() {
  const [activeSchematic, setActiveSchematic] = useState<string | null>(null);

  const lights = [
    // Row 1
    { label: ["AUX-T", "REFUEL"], status: 'amber' },
    { label: "OIL", status: 'red' },
    { label: ["BATT-", "TEMP"], status: 'red' },
    { label: "Vmo", status: 'red' },
    { label: ["BATT-", "TEMP"], status: 'red' },
    { label: "OIL", status: 'red' },
    { label: "-", status: 'amber' },
    
    // Row 2
    { label: "-", status: 'amber' },
    { label: ["START", "SELECT"], status: 'amber' },
    { label: ["CABIN", "TEMP"], status: 'amber' },
    { label: "DOORS", status: 'red' },
    { label: ["BLEED", "PRESS"], status: 'amber' },
    { label: "-", status: 'amber' },
    { label: "-", status: 'amber' },
    
    // Row 3
    { label: "BATT 1", status: 'amber' },
    { label: "GEN", status: 'amber' },
    { label: "INV 1", status: 'amber' },
    { label: ["NWS", "45°"], status: 'amber' },
    { label: "INV 2", status: 'amber' },
    { label: "GEN", status: 'amber' },
    { label: "BATT 2", status: 'amber' },
    
    // Row 4
    { label: ["FUEL", "PRESS"], status: 'amber' },
    { label: ["FUEL", "QTY"], status: 'amber' },
    { label: ["FUEL", "FILT"], status: 'amber' },
    { label: ["NWS", "BYPASS"], status: 'amber' },
    { label: ["FUEL", "FILT"], status: 'amber' },
    { label: ["FUEL", "QTY"], status: 'amber' },
    { label: ["FUEL", "PRESS"], status: 'amber' },
    
    // Row 5
    { label: ["INLET", "DE-ICE"], status: 'amber' },
    { label: "PITOT", status: 'amber' },
    { label: "-", status: 'amber' },
    { label: "-", status: 'amber' },
    { label: ["FUEL", "DUMP"], status: 'amber' },
    { label: "PITOT", status: 'amber' },
    { label: ["INLET", "DE-ICE"], status: 'amber' },
  ];

  const sim = useSimulator();

  React.useEffect(() => {
    if (!sim.iosOpen) {
      setActiveSchematic(null);
    }
  }, [sim.iosOpen]);

  const computeForced = (label: string | string[]) => {
    const text = Array.isArray(label) ? label.join(" ") : label;
    const normalized = text.toUpperCase();
    if (normalized.includes("AUX-T") || normalized.includes("REFUEL")) return sim.refuelWarning;
    if (normalized.includes("BATT-") && normalized.includes("TEMP")) return sim.batteryOverheat;
    if (normalized.includes("FUEL") && normalized.includes("PRESS")) return sim.fuelPressureWarning;
    if (normalized.includes("INLET") && normalized.includes("DE-ICE")) return sim.inletDeIceWarning;
    if (normalized === "OIL") return sim.oilWarning;
    if (normalized.includes("START") && normalized.includes("SELECT")) return sim.startSelectWarning;
    if (normalized.includes("FUEL") && normalized.includes("FILT")) return sim.fuelFilterCaution;
    if (normalized.includes("NWS") && normalized.includes("45°")) return sim.nws45Caution;
    if (normalized.includes("NWS") && normalized.includes("BYPASS")) return sim.nwsBypassWarning;
    if (normalized === "BATT 1") return sim.batt1Fault;
    if (normalized === "BATT 2") return sim.batt2Fault;
    if (normalized === "INV 1") return sim.inv1Fault;
    if (normalized === "INV 2") return sim.inv2Fault;
    if (normalized === "VMO") return sim.vmoWarning;
    if (normalized === "DOORS") return sim.doorWarning;
    if (normalized.includes("FUEL") && normalized.includes("QTY")) return sim.fuelQtyWarning;
    if (normalized === "PITOT") return sim.pitotWarning;
    return false;
  };

  return (
    <>
      <div className="w-full bg-[#1a1f24] p-3 md:p-4 rounded shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] border-2 border-[#111]">
        <div className="grid grid-cols-7 gap-1 md:gap-[6px]">
          {lights.map((light, index) => {
            if (!light.label || light.label === "—") {
              return <div key={index} className="opacity-0 pointer-events-none"></div>;
            }
            const forced = computeForced(light.label);
            const labelStr = Array.isArray(light.label) ? light.label.join(" ") : light.label;
            
            return (
              <WarningLight
                key={index}
                label={light.label}
                status={light.status as 'off' | 'amber' | 'red'}
                forcedOn={forced}
                onShowSchematic={() => setActiveSchematic(labelStr)}
              />
            );
          })}
        </div>
      </div>
      
      <SchematicModal 
        isOpen={!!activeSchematic} 
        onClose={() => setActiveSchematic(null)} 
        schematicId={activeSchematic} 
      />
    </>
  );
}
