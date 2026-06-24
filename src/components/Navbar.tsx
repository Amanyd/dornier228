"use client";

import { useSimulator } from "@/context/SimulatorContext";
import { playGlobalClickSound as playClickSound } from "@/utils/audio";

export default function Navbar() {
  const { iosOpen, setIosOpen } = useSimulator();

  return (
    <div className="w-full bg-[#273a4b] border-b-[3px] border-b-[#1a2632] py-4 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#425a72] opacity-70"></div>
      
      <h1 className="text-[#c1d0df] text-2xl md:text-3xl font-bold tracking-[0.15em] font-sans drop-shadow-md">
        Do-228 CENTRAL WARNING SYSTEM
      </h1>
      
      <button 
        onClick={() => { playClickSound(); setIosOpen(!iosOpen); }}
        className={`absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-colors shadow-md border ${
          iosOpen 
            ? "bg-[#ffaa22] text-black border-[#ffaa22] shadow-[0_0_10px_#ffaa22]" 
            : "bg-[#1a2530] hover:bg-[#2a3a4a] border-[#3a5a7a] text-[#8fa8c0]"
        }`}
      >
        Instructor
      </button>

      {/* Optional subtle bottom inset line */}
      <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-[#3a5268] opacity-50"></div>
    </div>
  );
}
