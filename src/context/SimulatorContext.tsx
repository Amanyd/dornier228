"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SimulatorState = {
  // Refuel
  refuelValveOpen: boolean;
  setRefuelValveOpen: (v: boolean) => void;
  refuelWarning: boolean;

  // Fuel pressure
  fuelPressurePsi: number;
  setFuelPressurePsi: (v: number) => void;
  fuelPressureWarning: boolean;

  // Inlet de-ice
  inletDeIceOn: boolean;
  setInletDeIceOn: (v: boolean) => void;
  inletDeIceWarning: boolean;

  // Battery temp
  batteryTempC: number;
  setBatteryTempC: (v: number) => void;
  batteryOverheat: boolean;

  // IOS Panel
  iosOpen: boolean;
  setIosOpen: (v: boolean) => void;

  // NWS 45°
  hydraulicSwitch: boolean;
  setHydraulicSwitch: (v: boolean) => void;
  nwsSwitch: boolean;
  setNwsSwitch: (v: boolean) => void;
  nws45Button: boolean;
  setNws45Button: (v: boolean) => void;
  speedLevers: 'LOW' | 'CRUISE' | 'HIGH';
  setSpeedLevers: (v: 'LOW' | 'CRUISE' | 'HIGH') => void;
  nws45Caution: boolean;

  // NWS Bypass
  scuFault: boolean;
  setScuFault: (v: boolean) => void;
  nwsBypassWarning: boolean;

  // OIL
  oilPressurePsi: number;
  setOilPressurePsi: (v: number) => void;
  oilWarning: boolean;

  // START SELECT
  startSelectSwitch: 'OFF' | 'VENT' | 'GND';
  setStartSelectSwitch: (v: 'OFF' | 'VENT' | 'GND') => void;
  startSelectWarning: boolean;

  // Fuel Filter
  fuelFilterDeltaPPsi: number;
  setFuelFilterDeltaPPsi: (v: number) => void;
  fuelFilterCaution: boolean;

  // Battery faults
  batt1Fault: boolean;
  setBatt1Fault: (v: boolean) => void;
  batt2Fault: boolean;
  setBatt2Fault: (v: boolean) => void;

  // Inverter faults
  inv1Fault: boolean;
  setInv1Fault: (v: boolean) => void;
  inv2Fault: boolean;
  setInv2Fault: (v: boolean) => void;

  // Vmo (Airspeed)
  airspeedKnots: number;
  setAirspeedKnots: (v: number) => void;
  vmoWarning: boolean;

  // DOORS
  doorsOpen: boolean; // simple summary state for IOS
  setDoorsOpen: (v: boolean) => void;
  doorWarning: boolean;

  // FUEL QTY
  fuelQtyLbs: number;
  setFuelQtyLbs: (v: number) => void;
  fuelQtyWarning: boolean;

  // PITOT
  pitotFault: boolean;
  setPitotFault: (v: boolean) => void;
  pitotWarning: boolean;
};

const SimulatorContext = createContext<SimulatorState | null>(null);

export function SimulatorProvider({ children }: { children: React.ReactNode }) {
  // Refuel
  const [refuelValveOpen, setRefuelValveOpen] = useState(false);
  const refuelWarning = refuelValveOpen; // micro-switch simulated directly

  // Fuel pressure with simple hysteresis logic
  const [fuelPressurePsi, setFuelPressurePsiState] = useState(20);
  const [fuelPressureWarning, setFuelPressureWarning] = useState(false);

  useEffect(() => {
    const p = fuelPressurePsi;
    setFuelPressureWarning((prev) => {
      if (p < 8) return true;
      if (p > 15) return false;
      return prev;
    });
  }, [fuelPressurePsi]);

  const setFuelPressurePsi = (v: number) => setFuelPressurePsiState(v);

  // Inlet de-ice
  const [inletDeIceOn, setInletDeIceOn] = useState(false);
  const inletDeIceWarning = inletDeIceOn; // micro-switch closes when valve opens

  // Battery temp
  const [batteryTempC, setBatteryTempCState] = useState(25);
  const batteryOverheat = batteryTempC >= 71;

  const setBatteryTempC = (v: number) => setBatteryTempCState(v);

  // IOS Panel
  const [iosOpen, setIosOpen] = useState(false);

  // NWS 45°
  const [hydraulicSwitch, setHydraulicSwitch] = useState(false);
  const [nwsSwitch, setNwsSwitch] = useState(false);
  const [nws45Button, setNws45Button] = useState(false);
  const [speedLevers, setSpeedLevers] = useState<'LOW' | 'CRUISE' | 'HIGH'>('LOW');
  const nws45Caution = hydraulicSwitch && nwsSwitch && speedLevers === 'LOW' && nws45Button;

  // NWS Bypass
  const [scuFault, setScuFault] = useState(false);
  const nwsBypassWarning = scuFault; // SCU fault de-energizes bypass valve -> warning light

  // OIL
  const [oilPressurePsi, setOilPressurePsiState] = useState(50);
  const oilWarning = oilPressurePsi <= 36.5; // Warning comes when pressure <= 35 +/- 1.5 PSI
  const setOilPressurePsi = (v: number) => setOilPressurePsiState(v);

  // START SELECT
  const [startSelectSwitch, setStartSelectSwitch] = useState<'OFF' | 'VENT' | 'GND'>('OFF');
  const startSelectWarning = (startSelectSwitch === 'VENT' || startSelectSwitch === 'GND') && (speedLevers === 'CRUISE' || speedLevers === 'HIGH');

  // Fuel Filter
  const [fuelFilterDeltaPPsi, setFuelFilterDeltaPPsi] = useState(5);
  const fuelFilterCaution = fuelFilterDeltaPPsi > 13;

  // Battery faults
  const [batt1Fault, setBatt1Fault] = useState(false);
  const [batt2Fault, setBatt2Fault] = useState(false);

  // Inverter faults
  const [inv1Fault, setInv1Fault] = useState(false);
  const [inv2Fault, setInv2Fault] = useState(false);

  // Vmo
  const [airspeedKnots, setAirspeedKnots] = useState(0);
  const vmoWarning = airspeedKnots >= 200;

  // DOORS
  const [doorsOpen, setDoorsOpen] = useState(false);
  const doorWarning = doorsOpen;

  // FUEL QTY
  const [fuelQtyLbs, setFuelQtyLbs] = useState(500);
  const fuelQtyWarning = fuelQtyLbs <= 180;

  // PITOT
  const [pitotFault, setPitotFault] = useState(false);
  const pitotWarning = pitotFault;

  return (
    <SimulatorContext.Provider
      value={{
        refuelValveOpen,
        setRefuelValveOpen,
        refuelWarning,
        fuelPressurePsi,
        setFuelPressurePsi,
        fuelPressureWarning,
        inletDeIceOn,
        setInletDeIceOn,
        inletDeIceWarning,
        batteryTempC,
        setBatteryTempC,
        batteryOverheat,
        iosOpen,
        setIosOpen,
        hydraulicSwitch,
        setHydraulicSwitch,
        nwsSwitch,
        setNwsSwitch,
        nws45Button,
        setNws45Button,
        speedLevers,
        setSpeedLevers,
        nws45Caution,
        scuFault,
        setScuFault,
        nwsBypassWarning,
        oilPressurePsi,
        setOilPressurePsi,
        oilWarning,
        startSelectSwitch,
        setStartSelectSwitch,
        startSelectWarning,
        fuelFilterDeltaPPsi,
        setFuelFilterDeltaPPsi,
        fuelFilterCaution,
        batt1Fault,
        setBatt1Fault,
        batt2Fault,
        setBatt2Fault,
        inv1Fault,
        setInv1Fault,
        inv2Fault,
        setInv2Fault,
        airspeedKnots,
        setAirspeedKnots,
        vmoWarning,
        doorsOpen,
        setDoorsOpen,
        doorWarning,
        fuelQtyLbs,
        setFuelQtyLbs,
        fuelQtyWarning,
        pitotFault,
        setPitotFault,
        pitotWarning,
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used inside SimulatorProvider");
  return ctx;
}
