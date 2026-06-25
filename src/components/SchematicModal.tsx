"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Panel from './Panel';
import { useSimulator } from '@/context/SimulatorContext';
import { playGlobalClickSound } from '@/utils/audio';

export default function SchematicModal({
  isOpen,
  onClose,
  schematicId
}: {
  isOpen: boolean;
  onClose: () => void;
  schematicId: string | null;
}) {
  const sim = useSimulator();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [isOpen]);

  if (!isOpen || !schematicId || !mounted) return null;

  const renderSchematic = () => {
    switch (schematicId) {
      case "BATT- TEMP":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Battery contains an internal overheat switch (thermal sensor). When battery cell temperature reaches ≥ 71°C, the switch physically closes, grounding the warning circuit." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Battery" s="Contains Overheat S/W" />
              <A />
              <B t="Overheat Switch" s="Closes at 71°C" hl />
              <A />
              <L t="BATT- TEMP" st="red" s="Warning" />
            </div>
          </div>
        );

      case "AUX-T REFUEL":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Refueling Panel has a rotary switch with positions: Maint / Aux / Test / Main. When set to any active position, the refuel valve opens. A microswitch on the valve arm physically trips, completing the warning circuit." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Refueling Panel" s="Switch: Maint / Aux / Test / Main" />
              <A />
              <B t="Refuel Valve" s="Opens" hl />
              <A />
              <B t="Microswitch" s="Closes" />
              <A />
              <L t="AUX-T REFUEL" st="amber" s="Caution" />
            </div>
          </div>
        );

      case "FUEL PRESS":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Low Fuel Pressure Switch (1 EA) is installed on the fuel line near the engine-driven pump. Switch closes at 8–7 PSI (caution ON). Due to mechanical hysteresis, it only opens again at 15 PSI (caution OFF)." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Fuel Line" s="Engine-driven pump supply" />
              <A />
              <div className="flex flex-col items-center gap-1">
                <B t="Low Fuel Pressure S/W" s="1 EA" hl />
                <div className="text-sm md:text-base text-red-500 font-mono font-bold mt-1">Close: 8–7 PSI</div>
                <div className="text-sm md:text-base text-green-500 font-mono font-bold">Open: 15 PSI</div>
              </div>
              <A />
              <L t="FUEL PRESS" st="amber" s="Caution" />
            </div>
          </div>
        );

      case "INLET DE-ICE":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="When LH and RH De-ice switches are set to ON, the anti-ice valve opens. A microswitch on the valve closes, completing the circuit to illuminate the caution on the CWS panel." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="LH & RH De-Ice S/W" s="Set to ON" />
              <A />
              <B t="Anti-Ice Valve" s="Opens" hl />
              <A />
              <B t="Microswitch" s="Closes" />
              <A />
              <L t="INLET DE-ICE" st="amber" s="Caution" />
            </div>
          </div>
        );

      case "OIL":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center mt-4">
            <Desc text="Engine oil flows through Filter → Pressure Switch → Oil Pressure Transmitter. The pressure switch branches to the Oil Warning circuit. Warning illuminates when oil pressure drops to ≤ 35 ± 1.5 PSI." />
            <div className="flex flex-row items-start justify-center gap-2 md:gap-4 flex-nowrap relative">
              <div className="flex items-center h-16 md:h-20"><span className="text-[#e1e8f0] font-extrabold text-sm md:text-base tracking-wide uppercase italic">OIL</span></div>
              
              <div className="flex items-center h-16 md:h-20 px-1 md:px-2">
                <span className="text-[#8fa8c0] font-bold text-lg md:text-xl tracking-widest">====&gt;</span>
              </div>
              
              <div className="flex items-center h-16 md:h-20"><B t="Filter" /></div>
              
              <div className="flex items-center h-16 md:h-20"><A /></div>
              
              {/* Branching Switch Node */}
              <div className="flex flex-col items-center relative">
                <div className="h-16 md:h-20 w-16 md:w-32 relative flex items-center justify-center">
                   {/* Standard Open Switch Branching off the main line */}
                   <svg className="w-full h-full text-[#8fa8c0] overflow-visible" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                     {/* Main oil line passing through from Filter to Transmitter */}
                     <path d="M 0 20 L 100 20" />
                     
                     {/* Branch line going down to the switch */}
                     <path d="M 50 20 L 50 40" />
                     
                     {/* Switch top terminal */}
                     <circle cx="50" cy="45" r="5" fill="currentColor" />
                     
                     {/* Switch Arm (Open state) */}
                     <path d="M 50 45 L 75 60" />
                     
                     {/* Switch bottom terminal */}
                     <circle cx="50" cy="75" r="5" fill="currentColor" />
                     
                     {/* Line going down to warning */}
                     <path d="M 50 75 L 50 120" strokeDasharray="4 4" />

                     {/* Arrow from note */}
                     <path d="M -10 100 Q 15 90 40 55" stroke="#33aa55" strokeWidth="1.5" markerEnd="url(#green-arrow)" opacity="0.8"/>
                     <defs>
                       <marker id="green-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                         <polygon points="0 0, 10 3.5, 0 7" fill="#33aa55"/>
                       </marker>
                     </defs>
                   </svg>
                </div>

                <div className="mt-16 md:mt-24">
                  <L t="OIL" st="red" s="Warning" />
                </div>

                {/* Hand-written Note */}
                <div className="absolute top-[90px] md:top-[100px] -left-28 md:-left-32 w-32 md:w-40 text-[#8fa8c0] text-[10px] md:text-xs text-right font-medium leading-tight opacity-90 italic">
                  Warning comes when Pressure sensed Here<br/>= 35 ± 1.5 PSI°
                </div>
              </div>

              <div className="flex items-center h-16 md:h-20"><A /></div>
              <div className="flex items-center h-16 md:h-20"><B t="Oil Pressure Transmitter" /></div>
            </div>
          </div>
        );

      case "START SELECT":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Warning illuminates when Start Select Switch is at 'VENT' or 'GND' AND one or both Speed Levers are at 'CRUISE' or 'HIGH'. Both conditions must be true simultaneously." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <div className="flex flex-col gap-3 items-center bg-[#1a2228] p-5 rounded border border-[#2a3a44]">
                <B t="Start Select S/W" s="VENT or GND" />
                <div className="text-[#ffaa22] font-black text-base">AND</div>
                <B t="Speed Levers" s="CRUISE or HIGH" />
              </div>
              <Brace />
              <A />
              <L t="START SELECT" st="amber" s="Warning" />
            </div>
          </div>
        );

      case "FUEL FILT":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="When the fuel filter becomes clogged, differential pressure exceeds 13 PSI, causing the mechanical bypass valve to open. The differential pressure switch contact closes, completing the circuit to the CWS." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Filter Bypass Valve" s="Opens at ΔP > 13 PSI" hl />
              <A />
              <B t="Diff Pressure Switch" s="Contact Closes" />
              <A />
              <L t="FUEL FILT" st="amber" s="Caution" />
            </div>
          </div>
        );

      case "BATT 1":
      case "BATT 2":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Caution illuminates if the battery contactor fails to close (battery not coming online to bus bar) OR if an internal fault (cell failure, thermal runaway) is detected in the battery." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <div className="flex flex-col gap-3 items-center bg-[#1a2228] p-5 rounded border border-[#2a3a44]">
                <B t="Battery Not Coming Online" s="Contactor fails to close" />
                <div className="text-[#ffaa22] font-black text-base">OR</div>
                <B t="Fault in Battery" s="Cell failure / thermal runaway" />
              </div>
              <Brace />
              <A />
              <L t={schematicId} st="amber" s="Caution" />
            </div>
          </div>
        );

      case "INV 1":
      case "INV 2":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Fault Monitor senses incorrect voltage/frequency. Primary relays (3XR/13XR) de-energize → Faulty inverter disconnected from bus bar → Secondary relays (9XR/19XR) de-energize → Phase lock circuit disconnected → Caution." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Fault Monitor" s="Voltage/Freq error" />
              <A />
              <B t="Relay 3XR/13XR" s="De-energize" />
              <A />
              <B t="Inverter" s="Disconnected from Bus" hl />
              <A />
              <B t="Relay 9XR/19XR" s="De-energize" />
              <A />
              <div className="flex flex-col items-center gap-1">
                <B t="Phase Lock" s="Disconnected" />
                <div className="w-[3px] h-6 md:h-8 bg-[#8fa8c0] relative mb-1 md:mb-2">
                  <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                </div>
                <L t={schematicId} st="amber" s="Caution" />
              </div>
            </div>
          </div>
        );

      case "NWS 45°":
        return (
          <div className="flex flex-row items-center gap-8 w-full h-full justify-center">
            <Desc text="All four conditions connected in SERIES. If any condition is not satisfied → No caution. All must be true: Hydraulic Switch ON, NWS Switch ON, Both Speed Levers LOW, NWS 45° Button Pressed." side />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <div className="flex flex-col gap-3 items-center bg-[#1a2228] p-5 rounded border border-[#2a3a44]">
                <B t="Hydraulic Switch" s="→ ON" />
                <B t="NWS Switch" s="→ ON" />
                <B t="Both Speed Levers" s="→ LOW" />
                <B t="NWS 45° Button" s="→ PRESSED" />
                <div className="text-sm text-[#ffaa22] font-bold">ALL IN SERIES</div>
              </div>
              <Brace />
              <A />
              <L t="NWS 45°" st="amber" s="Caution" />
            </div>
          </div>
        );

      case "NWS BYPASS":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center">
            <Desc text="SCU receives Command Potentiometer + Rudder Pedal input and compares with Feedback Potentiometer. On fault detection → Bypass valve de-energized → Bypass valve opens → Bypass microswitches open → Warning Light." />
            
            <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-nowrap">
              {/* SCU and its 3 inputs arranged on Top, Left, Bottom */}
              <div className="grid grid-cols-[auto_auto_auto] grid-rows-[auto_auto_auto] items-center justify-items-center">
                {/* Top Input */}
                <div className="col-start-2 row-start-1 flex flex-col items-center">
                  <B t="Command Potentiometer" s="Steering input" />
                  <div className="h-6 md:h-10 w-[2px] md:w-[3px] bg-[#8fa8c0] relative my-1 md:my-2">
                     {/* Down arrow marker */}
                     <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] md:border-l-[7px] border-r-[5px] md:border-r-[7px] border-t-[6px] md:border-t-[8px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                  </div>
                </div>

                {/* Left Input */}
                <div className="col-start-1 row-start-2 flex flex-row items-center mr-0 md:mr-2">
                  <B t="Rudder Pedal" s="Pressed" />
                  <A />
                </div>

                {/* Center SCU */}
                <div className="col-start-2 row-start-2 relative z-10">
                  <B t="SCU" s="Steering Control Unit" hl />
                </div>

                {/* Bottom Input */}
                <div className="col-start-2 row-start-3 flex flex-col items-center">
                  <div className="h-6 md:h-10 w-[2px] md:w-[3px] bg-[#8fa8c0] relative my-1 md:my-2">
                     {/* Up arrow marker */}
                     <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] md:border-l-[7px] border-r-[5px] md:border-r-[7px] border-b-[6px] md:border-b-[8px] border-b-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                  </div>
                  <B t="Feedback Potentiometer" s="Position feedback" />
                </div>
              </div>

              {/* Continuing logic flow */}
              <div className="flex flex-row items-center justify-center gap-2 md:gap-4">
                <A />
                <B t="Fault Detected" s="Bypass valve de-energized" />
                <A />
                <B t="Bypass Valve Opens" s="Microswitches open" />
                <A />
                <L t="NWS BYPASS" st="amber" s="Warning" />
              </div>
            </div>
          </div>
        );

      case "GEN":
        return (
          <div className="flex flex-col items-center gap-2 w-full h-full justify-start md:justify-center mt-2 pb-12">
            <Desc text="Starter Generator residual voltage feeds the GCU (Voltage Regulator, Sensing, Field Excitation, Reverse Current). If a fault is detected, the GEN Relay (GPC) opens, disconnecting the generator from the A/C bus and triggering the GEN caution." />
            
            <div className="flex flex-col items-center w-full mt-4">
              <B t="Starter Generator" />
              
              <div className="flex flex-row items-center my-2 h-10 md:h-12 relative">
                <div className="absolute right-full mr-2 text-[#8fa8c0] text-[10px] md:text-xs italic whitespace-nowrap opacity-90">Residual voltage goes to</div>
                <div className="w-[3px] h-full border-l-[2px] border-dashed border-[#8fa8c0] relative">
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-center w-full">
                 {/* Left Path: Fault (Rendered RTL) */}
                 <div className="flex flex-row-reverse items-center justify-start flex-nowrap">
                    
                    <B t="Fault Detected" />
                    
                    <div className="w-4 md:w-8 h-[3px] bg-[#8fa8c0] relative mx-1 md:mx-2 shrink-0">
                       <div className="absolute -left-1 md:-left-2 -top-[4px] md:-top-[5px] w-0 h-0 border-r-[8px] md:border-r-[12px] border-y-[6px] md:border-y-[8px] border-y-transparent border-r-[#8fa8c0]"></div>
                    </div>
                    
                    <B t="Gen Relay GPC Opens" />
                    
                    <div className="w-4 md:w-8 h-[3px] bg-[#8fa8c0] relative mx-1 md:mx-2 shrink-0">
                       <div className="absolute -left-1 md:-left-2 -top-[4px] md:-top-[5px] w-0 h-0 border-r-[8px] md:border-r-[12px] border-y-[6px] md:border-y-[8px] border-y-transparent border-r-[#8fa8c0]"></div>
                    </div>
                    
                    <B t="Gen Disconnected" s="from A/C Bus" />
                    
                    <div className="w-4 md:w-8 h-[3px] bg-[#8fa8c0] relative mx-1 md:mx-2 shrink-0">
                       <div className="absolute -left-1 md:-left-2 -top-[4px] md:-top-[5px] w-0 h-0 border-r-[8px] md:border-r-[12px] border-y-[6px] md:border-y-[8px] border-y-transparent border-r-[#8fa8c0]"></div>
                    </div>
                    
                    <L t="GEN" st="amber" s="Caution" />

                    {/* Arrow emerging from GCU Left Wall */}
                    <div className="w-8 md:w-12 h-[3px] bg-[#8fa8c0] relative shrink-0 mx-1 md:mx-2">
                       <div className="absolute -left-1 md:-left-2 -top-[4px] md:-top-[5px] w-0 h-0 border-r-[8px] md:border-r-[12px] border-y-[6px] md:border-y-[8px] border-y-transparent border-r-[#8fa8c0]"></div>
                    </div>
                 </div>

                 {/* Central GCU Block */}
                 <div className="bg-[#1a2228] border-2 border-[#8fa8c0] rounded-sm p-3 md:p-4 text-center shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10 shrink-0">
                   <div className="text-[#e1e8f0] font-bold text-xs md:text-sm tracking-wide leading-relaxed">
                     Voltage Regulator<br/>
                     Voltage Sensing<br/>
                     Field Excitation<br/>
                     Reverse Current
                   </div>
                 </div>
                 
                 {/* Right Path: Normal (Rendered LTR) */}
                 <div className="flex flex-row items-center justify-start flex-nowrap">
                    {/* Arrow emerging from GCU Right Wall */}
                    <div className="w-8 md:w-12 h-[3px] bg-[#8fa8c0] relative shrink-0 mx-1 md:mx-2">
                       <div className="absolute -right-1 md:-right-2 -top-[4px] md:-top-[5px] w-0 h-0 border-l-[8px] md:border-l-[12px] border-y-[6px] md:border-y-[8px] border-y-transparent border-l-[#8fa8c0]"></div>
                    </div>
                    
                    <div className="text-[#8fa8c0] font-medium text-sm md:text-base italic px-2 whitespace-nowrap">everything NORMAL</div>
                    
                    <A />
                    
                    <div className="text-[#33aa55] font-bold text-sm md:text-base uppercase whitespace-nowrap px-2">NO CAUTION</div>
                 </div>
              </div>
            </div>
          </div>
        );
      case "CABIN TEMP":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center mt-4">
            <Desc text="AC Distributing Duct temperature is monitored. If it exceeds 75 ± 5 °C, the overtemp switch closes, triggering the Cabin Temp caution." />
            <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-nowrap">
              <div className="flex items-center h-16 md:h-20"><B t="AC Distributing Duct" /></div>
              <div className="flex items-center h-16 md:h-20"><A /></div>
              <div className="flex items-center h-16 md:h-20"><B t="Overtemp Switch Closes" s="at 75 ± 5 °C" /></div>
              <div className="flex items-center h-16 md:h-20"><A /></div>
              <div className="flex items-center h-16 md:h-20"><L t="CABIN TEMP" st="amber" s="Caution" /></div>
            </div>
          </div>
        );

      case "FUEL DUMP":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center mt-4">
            <Desc text="Activating Fuel Dump Switch causes motors to rotate the valve ball. Valve opens to let fuel exit the wing. Simultaneously, cam microswitch contacts close, illuminating the caution light." />
            
            <div className="flex flex-row items-start justify-center gap-2 md:gap-4 flex-nowrap">
               <div className="flex items-center h-16 md:h-20"><B t="Fuel Dump Switch" /></div>
               <div className="flex items-center h-16 md:h-20"><A /></div>
               <div className="flex items-center h-16 md:h-20"><B t="Dump Valve Motors" s="Rotate the valve ball" /></div>
               <div className="flex items-center h-16 md:h-20"><A /></div>
               
               {/* Branching from Dump Valve Opens */}
               <div className="flex flex-col items-center">
                 <div className="h-16 md:h-20 flex items-center"><B t="Dump Valve Opens" /></div>
                 
                 <div className="flex flex-col items-center mt-0 md:mt-2">
                   <div className="w-[2px] md:w-[3px] h-6 md:h-10 bg-[#8fa8c0] relative mb-1 md:mb-2">
                     <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] md:border-l-[7px] border-r-[5px] md:border-r-[7px] border-t-[6px] md:border-t-[8px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                   </div>
                   <div className="text-[#8fa8c0] text-[10px] md:text-xs text-center italic mb-1 md:mb-2 leading-tight">
                     cam microswitch<br/>contacts closed
                   </div>
                   <div className="w-[2px] md:w-[3px] h-6 md:h-8 bg-[#8fa8c0] relative mb-2">
                     <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] md:border-l-[7px] border-r-[5px] md:border-r-[7px] border-t-[6px] md:border-t-[8px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                   </div>
                   <L t="FUEL DUMP" st="amber" s="Caution" />
                 </div>
               </div>
               
               <div className="flex items-center h-16 md:h-20"><A /></div>
               <div className="flex items-center h-16 md:h-20">
                 <div className="text-[#e1e8f0] font-medium text-sm md:text-base italic px-2 font-serif">Fuel exits wing</div>
               </div>
            </div>
          </div>
        );

      case "BLEED PRESS":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center mt-4">
            <Desc text="Air from the Air Condition System flows through a venturi. A pressure switch monitors this line; if pressure exceeds 68–76 PSI, the switch closes and triggers the BLEED PRESS caution. The line continues through the TCV to the Cabin and Cockpit." />
            
            <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-nowrap relative">
               <div className="flex items-center h-16 md:h-20"><B t="Air Condition System" /></div>
               
               <div className="flex items-center h-16 md:h-20 px-1"><A /></div>
               
               {/* Venturi */}
               <div className="flex flex-col items-center justify-center h-16 md:h-20">
                 <svg className="w-12 h-8 md:w-16 md:h-10 text-[#8fa8c0]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3">
                   <polygon points="0,0 100,15 100,35 0,50" />
                 </svg>
                 <div className="text-[#8fa8c0] text-[10px] md:text-xs italic mt-1">venturi</div>
               </div>
               
               <div className="flex items-center h-16 md:h-20 px-1"><A /></div>
               
               {/* Branch and Switch */}
               <div className="flex flex-col items-center relative">
                 <div className="h-16 md:h-20 w-16 md:w-24 relative flex items-center justify-center">
                   <svg className="w-full h-full text-[#8fa8c0] overflow-visible" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                     {/* Main line passing through */}
                     <path d="M 0 50 L 100 50" />
                     {/* Branch line going down */}
                     <path d="M 50 50 L 50 100" />
                   </svg>
                 </div>

                 <div className="mt-2 flex flex-col items-center">
                   <B t="Pressure Switch" s="68-76 PSI" />
                   
                   <div className="w-[3px] h-6 md:h-8 bg-[#8fa8c0] relative mt-1 mb-1">
                     <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
                   </div>
                   
                   <L t="BLEED PRESS" st="amber" s="Caution" />
                   
                   <div className="text-[#8fa8c0] text-[10px] md:text-xs font-medium leading-tight opacity-90 italic mt-3 text-center">
                     Switch closes when<br/>pressure = 68 to 76 PSI
                   </div>
                 </div>
               </div>
               
               <div className="flex items-center h-16 md:h-20 px-1"><A /></div>
               
               <div className="flex items-center h-16 md:h-20"><B t="TCV" /></div>
               
               <div className="flex items-center h-16 md:h-20 px-1"><A /></div>

               {/* Split to Cabin and Cockpit */}
               <div className="flex flex-col justify-center h-16 md:h-20 ml-2 relative">
                 <div className="absolute top-1/2 left-0 w-[3px] h-12 -translate-y-1/2 bg-[#8fa8c0]"></div>
                 
                 <div className="flex flex-row items-center relative -top-4">
                   <div className="w-4 h-[3px] bg-[#8fa8c0]"></div>
                   <div className="w-0 h-0 border-l-[6px] border-y-[4px] border-y-transparent border-l-[#8fa8c0]"></div>
                   <span className="text-[#8fa8c0] italic font-serif ml-2 text-sm">Cabin</span>
                 </div>
                 
                 <div className="flex flex-row items-center relative top-2">
                   <div className="w-4 h-[3px] bg-[#8fa8c0]"></div>
                   <div className="w-0 h-0 border-l-[6px] border-y-[4px] border-y-transparent border-l-[#8fa8c0]"></div>
                   <span className="text-[#8fa8c0] italic font-serif ml-2 text-sm">Cockpit</span>
                 </div>
               </div>
            </div>
          </div>
        );

      case "VMO":
        return (
          <div className="flex flex-col items-center gap-8 w-full h-full justify-center mt-6">
            <Desc text="Pitot tube and Static Port (S1) provide dynamic and static pressure. Airspeed Switch triggers the Vmo warning at 200 ± 5 knots." />
            
            <div className="relative w-[360px] md:w-[460px] h-[340px] md:h-[400px]">
              {/* Pitot Line (Left vertical line) */}
              <div className="absolute left-[80px] md:left-[100px] bottom-[80px] md:bottom-[100px] top-[140px] md:top-[160px] w-[3px] bg-[#8fa8c0]"></div>
              
              {/* Static Line (Right vertical line) */}
              <div className="absolute right-[60px] md:right-[80px] bottom-[140px] md:bottom-[160px] top-[40px] w-[3px] bg-[#8fa8c0]">
                {/* Circles for static port ends */}
                <div className="absolute -top-[5px] -left-[4px] w-[11px] h-[11px] rounded-full border-[3px] border-[#8fa8c0] bg-[#1a1f24]"></div>
                <div className="absolute -bottom-[5px] -left-[4px] w-[11px] h-[11px] rounded-full border-[3px] border-[#8fa8c0] bg-[#1a1f24]"></div>
                <div className="absolute top-[40%] translate-x-4 -translate-y-1/2 text-[#8fa8c0] text-[10px] md:text-xs font-serif whitespace-nowrap">Static Port<br/>(S1)</div>
              </div>

              {/* Pitot tube entry */}
              <div className="absolute left-[80px] md:left-[100px] bottom-0 flex flex-col items-center -translate-x-1/2">
                <div className="w-5 h-[3px] bg-[#8fa8c0] absolute bottom-10 left-1/2 -translate-x-1/2"></div>
                <div className="w-[3px] h-10 bg-[#8fa8c0]"></div>
                <div className="w-3 h-8 bg-transparent border-[3px] border-b-0 border-[#8fa8c0] absolute bottom-0 left-1/2 -translate-x-1/2 transform skew-x-[-15deg]"></div>
                <div className="text-[#8fa8c0] text-xs font-serif mt-2 italic">Pitot tube</div>
              </div>

              {/* Altimeter */}
              <div className="absolute top-[30px] md:top-[25px] left-[150px] md:left-[210px] -translate-x-1/2">
                <B t="Altimeter" />
              </div>
              {/* Connection from right line to Altimeter */}
              <div className="absolute top-[50px] md:top-[45px] left-[190px] md:left-[260px] right-[60px] md:right-[80px] h-[3px] bg-[#8fa8c0]"></div>

              {/* ASI Pilot */}
              <div className="absolute top-[100px] left-[150px] md:left-[210px] -translate-x-1/2">
                <B t="ASI Pilot" />
              </div>
              {/* Pitot to ASI Pilot */}
              <div className="absolute top-[120px] left-[80px] md:left-[100px] right-[210px] md:right-[250px] h-[3px] bg-[#8fa8c0]"></div>
              {/* Static to ASI Pilot */}
              <div className="absolute top-[120px] left-[190px] md:left-[260px] right-[60px] md:right-[80px] h-[3px] bg-[#8fa8c0]"></div>

              {/* Drain Valve */}
              <div className="absolute top-[170px] left-[20px] md:left-[30px] -translate-x-1/2">
                <B t="Drain Valve" />
              </div>
              {/* Pitot to Drain Valve */}
              <div className="absolute top-[190px] left-[60px] md:left-[80px] right-[280px] md:right-[360px] h-[3px] bg-[#8fa8c0]"></div>

              {/* Airspeed Switch */}
              <div className="absolute top-[170px] left-[150px] md:left-[210px] -translate-x-1/2">
                <B t="Airspeed Switch" />
              </div>
              {/* Pitot to Airspeed Switch */}
              <div className="absolute top-[190px] left-[80px] md:left-[100px] right-[210px] md:right-[250px] h-[3px] bg-[#8fa8c0]"></div>
              {/* Static to Airspeed Switch */}
              <div className="absolute top-[190px] left-[190px] md:left-[260px] right-[60px] md:right-[80px] h-[3px] bg-[#8fa8c0]"></div>

              {/* Down from Airspeed Switch to Warning */}
              <div className="absolute top-[210px] left-[150px] md:left-[210px] -translate-x-1/2 w-[3px] h-8 md:h-12 bg-[#8fa8c0]">
                 <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-t-[#8fa8c0] border-l-transparent border-r-transparent"></div>
              </div>
              
              <div className="absolute top-[250px] md:top-[265px] left-[150px] md:left-[210px] -translate-x-1/2 flex items-center">
                <L t="Vmo" st="red" s="Warning" />
                <div className="absolute left-[100%] md:left-[110%] top-2 ml-4 w-[120px] text-[#8fa8c0] text-[10px] md:text-xs italic leading-tight whitespace-nowrap">
                  → warning at :<br/>airspeed = 200 ± 5 knots
                </div>
              </div>
            </div>
          </div>
        );

      case "DOORS":
        return (
          <div className="flex flex-row items-center gap-8 w-full h-full justify-center">
            <Desc text="If ANY door/compartment microswitch closes (door open/unsecured), warning illuminates. 2MC (Rear Baggage) is connected through a diode, isolating it from the front door circuits." side />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <div className="flex flex-col gap-1 items-center bg-[#1a2228] p-4 rounded border border-[#2a3a44]">
                <B t="1MC – Cabin Doors" s="Microswitch" />
                <div className="text-[#ffaa22] font-black text-sm">OR</div>
                <B t="3MC – Front Baggage" s="Microswitch" />
                <div className="text-[#ffaa22] font-black text-sm">OR</div>
                <B t="4MC – Cabin Upper Half" s="Microswitch" />
                <div className="text-[#ffaa22] font-black text-sm">OR</div>
                <B t="5MC – Cabin Door" s="Microswitch" />
                <div className="text-[#ffaa22] font-black text-sm">OR</div>
                <B t="2MC – Rear Baggage" s="Via Diode ◄" />
              </div>
              <Brace />
              <A />
              <L t="DOORS" st="red" s="Warning" />
            </div>
          </div>
        );

      case "FUEL QTY":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Feeder tank contains a float switch. When fuel quantity (Q) drops to Q ≤ 180 LBS, the switch moves to closed position, completing the warning circuit. When Q > 180 LBS, switch is open (no warning)." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Feeder Tank" s="Fuel reservoir" />
              <A />
              <B t="Float Switch" s="In closed position" hl />
              <A />
              <div className="flex flex-col items-center gap-1">
                <div className="text-sm text-emerald-400 font-mono">Q &gt; 180 LBS → Open (OK)</div>
                <div className="text-sm text-red-400 font-mono">Q ≤ 180 LBS → Closed (WARN)</div>
              </div>
              <A />
              <L t="FUEL QTY" st="amber" s="Warning" />
            </div>
          </div>
        );

      case "PITOT":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="28V DC Bus powers the Pitot Switch. Power flows to Pitot Heat Control Box containing relays A1 and A2. Control box monitors current to Pitot Tube heater. If any fault detected (under/over-current, heater failure) → Caution." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="28V DC Bus" s="Power supply" />
              <A />
              <B t="Pitot Switch" s="Cockpit – ON" />
              <A />
              <B t="Pitot Heat Control Box" s="Relays A1 / A2" hl />
              <A />
              <div className="flex flex-col items-center gap-3">
                <B t="Pitot Tube" s="Heater element" />
                <div className="w-[3px] h-5 bg-[#8fa8c0]"></div>
                <L t="PITOT" st="amber" s="Caution" />
              </div>
            </div>
          </div>
        );

      case "GEN":
        return (
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <Desc text="Generator Control Unit (GCU) monitors output voltage and frequency. On fault detection, the generator is disconnected from the main bus bar." />
            <div className="flex flex-row items-center justify-center gap-5 flex-nowrap">
              <B t="Generator" s="Engine-driven" />
              <A />
              <B t="GCU" s="Monitors V & Hz" hl />
              <A />
              <B t="Fault Detected" s="Disconnected from bus" />
              <A />
              <L t="GEN" st="amber" s="Caution" />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-[#8fa8c0] tracking-widest text-sm uppercase">
            Schematic logic for {schematicId} is not available.
          </div>
        );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-[#040608]/95 transition-all duration-300">
      <div className="w-full h-full flex animate-in fade-in zoom-in duration-200">
        <Panel hasScrews className="w-full h-full flex flex-col border-[2px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between border-b-[2px] border-[#222] p-3 bg-[#1a2228] rounded-t-[8px]">
            <h2 className="text-[#c1d0df] text-sm md:text-lg font-bold tracking-widest uppercase flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#ffaa22] animate-pulse"></span>
              System Logic: {schematicId}
            </h2>
            <button
              onClick={() => { playGlobalClickSound(); onClose(); }}
              className="text-[#8fa8c0] hover:text-white font-bold text-xl px-2 transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-2 md:p-4 bg-[repeating-linear-gradient(45deg,#1a2530_0,#1a2530_2px,transparent_2px,transparent_8px)] flex flex-col min-h-0 overflow-hidden">
            <div className="bg-[#1e2a35] border-2 border-[#2a3a44] rounded-lg p-4 shadow-[inset_0_5px_15px_rgba(0,0,0,0.5)] w-full h-full overflow-auto flex flex-col">
              <div className="m-auto w-full flex-shrink-0 flex items-center justify-start md:justify-center overflow-x-auto overflow-y-hidden">
                <div className="transform scale-[0.55] sm:scale-[0.65] md:scale-75 lg:scale-90 origin-left md:origin-center min-w-max pb-4">
                  {renderSchematic()}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>,
    document.body
  );
}

/* ── Compact sub-components ────────────────────────────────── */

function B({ t, s, hl }: { t: string; s?: string; hl?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center px-2 md:px-4 py-2 md:py-3 rounded text-center min-w-[140px] md:min-w-[160px] max-w-[220px] border-[2px] md:border-[3px] shadow-[0_4px_8px_rgba(0,0,0,0.7)] ${
      hl ? "bg-[#2a3a44] border-[#ffaa22]/60" : "bg-[#2a3a44] border-[#1a1f24]"
    }`}>
      <span className="text-[#e1e8f0] font-extrabold text-xs md:text-sm tracking-wide uppercase leading-tight">{t}</span>
      {s && <span className={`text-[10px] md:text-xs mt-1 uppercase tracking-wide ${hl ? "text-[#ffaa22] font-bold" : "text-[#8fa8c0]"}`}>{s}</span>}
    </div>
  );
}

function L({ t, st, s }: { t: string; st: string; s: string }) {
  const isRed = st === "red";
  return (
    <div className={`flex flex-col items-center justify-center px-4 md:px-6 py-3 md:py-4 rounded border-[2px] md:border-[3px] shadow-[inset_0_0_15px_rgba(255,100,0,0.35)] ${
      isRed ? "bg-[#3a1111] border-[#ff2222]" : "bg-[#3a2211] border-[#ffaa22]"
    }`}>
      <span className={`font-black text-lg md:text-xl text-center leading-none ${
        isRed ? "text-[#ff4444] drop-shadow-[0_0_6px_rgba(255,0,0,1)]" : "text-[#ffaa22] drop-shadow-[0_0_6px_rgba(255,150,0,1)]"
      }`}>{t}</span>
      <span className={`text-[10px] md:text-xs mt-1 font-bold uppercase tracking-wide ${isRed ? "text-[#ff8888]" : "text-[#ffcc88]"}`}>{s}</span>
    </div>
  );
}

function A() {
  return (
    <div className="flex items-center justify-center mx-1 md:mx-3 shrink-0">
      <div className="w-6 md:w-10 h-[2px] md:h-[3px] bg-[#8fa8c0]"></div>
      <div className="w-0 h-0 border-t-[5px] md:border-t-[7px] border-t-transparent border-l-[8px] md:border-l-[12px] border-l-[#8fa8c0] border-b-[5px] md:border-b-[7px] border-b-transparent"></div>
    </div>
  );
}

function Brace() {
  return (
    <div className="text-[#ffaa22] text-4xl md:text-6xl font-light mx-2 md:mx-3 shrink-0">{"}"}</div>
  );
}

function Desc({ text, side }: { text: string; side?: boolean }) {
  if (side) {
    return (
      <div className="text-[#8fa8c0] text-sm md:text-base lg:text-lg leading-relaxed text-left max-w-[220px] md:max-w-[320px] min-w-[160px] md:min-w-[260px] px-2 md:px-4 md:pr-8 flex-shrink-0">
        {text}
      </div>
    );
  }
  return (
    <div className="text-[#8fa8c0] text-base md:text-lg lg:text-xl leading-relaxed text-center max-w-[900px] mb-2 md:mb-6 px-4">
      {text}
    </div>
  );
}
