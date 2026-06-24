export default function Screw({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-4 h-4 rounded-full bg-gradient-to-br from-[#718096] to-[#2d3748] border border-[#1a202c] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.8)] relative ${className}`}
    >
      {/* Phillips cross slot */}
      <div className="absolute w-2 h-[1px] bg-[#111] rotate-45 opacity-80 shadow-[0_1px_0_rgba(255,255,255,0.2)] rounded-sm"></div>
      <div className="absolute w-2 h-[1px] bg-[#111] -rotate-45 opacity-80 shadow-[0_1px_0_rgba(255,255,255,0.2)] rounded-sm"></div>
    </div>
  );
}
