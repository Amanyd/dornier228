"use client";

import { useSimulator } from "@/context/SimulatorContext";

export default function Navbar() {
  return (
    <div className="w-full bg-[#273a4b] border-b-[3px] border-b-[#1a2632] py-4 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#425a72] opacity-70"></div>
      
      <h1 className="text-[#c1d0df] text-2xl md:text-3xl font-bold tracking-[0.15em] font-sans drop-shadow-md">
        Do-228 CENTRAL WARNING SYSTEM
      </h1>

      {/* Optional subtle bottom inset line */}
      <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-[#3a5268] opacity-50"></div>
    </div>
  );
}
