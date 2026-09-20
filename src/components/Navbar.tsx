"use client";

export default function Navbar() {
  return (
    <div className="w-full bg-[#273a4b] border-b-[3px] border-b-[#1a2632] py-2 md:py-3 flex flex-col items-center justify-center shadow-lg relative overflow-hidden shrink-0">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#425a72] opacity-70"></div>
      
      <h1 className="text-[#c1d0df] text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-[0.15em] font-sans drop-shadow-md text-center px-2">
        Do-228 CENTRAL WARNING SYSTEM
      </h1>

      {/* Optional subtle bottom inset line */}
      <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-[#3a5268] opacity-50"></div>
    </div>
  );
}
