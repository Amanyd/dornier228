import React from "react";
import Screw from "./Screw";

interface PanelProps {
  children?: React.ReactNode;
  className?: string;
  hasScrews?: boolean;
  hideBottomScrews?: boolean;
  id?: string;
}

export default function Panel({
  children,
  className = "",
  hasScrews = false,
  hideBottomScrews = false,
  id,
}: PanelProps) {
  return (
    <div
      id={id}
      className={`relative bg-[#344a5e] border-t-[#4c6780] border-l-[#4c6780] border-b-[#1b2733] border-r-[#1b2733] border-[3px] shadow-[inset_0_0_10px_rgba(0,0,0,0.2),0_4px_10px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
    >
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      {/* Screws positioned on the outer frame */}
      {hasScrews && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-2 left-2 pointer-events-auto"><Screw /></div>
          <div className="absolute top-2 right-2 pointer-events-auto"><Screw /></div>
          {!hideBottomScrews && <div className="absolute bottom-2 left-2 pointer-events-auto"><Screw /></div>}
          {!hideBottomScrews && <div className="absolute bottom-2 right-2 pointer-events-auto"><Screw /></div>}
        </div>
      )}

      {/* Content Container to keep it above noise */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
