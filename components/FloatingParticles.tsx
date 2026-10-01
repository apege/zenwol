import React from "react";

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[8%] left-[5%] w-6 h-6 bg-[#C29841]/20 rounded-full blur-[2px] animate-float-slow" />
      <div className="absolute top-[18%] right-[8%] w-8 h-8 bg-[#D4AF37]/25 rounded-full blur-[3px] animate-float-fast" />
      <div className="absolute top-[42%] left-[12%] w-5 h-5 bg-[#C29841]/15 rounded-full blur-[1px] animate-float-slow" />
      <div className="absolute top-[65%] right-[15%] w-7 h-7 bg-[#B88B2A]/20 rounded-full blur-[2px] animate-float-fast" />
      <div className="absolute top-[85%] left-[8%] w-6 h-6 bg-[#D4AF37]/20 rounded-full blur-[2px] animate-float-slow" />
      <div className="absolute top-[30%] left-[88%] w-10 h-10 bg-[#C29841]/10 rounded-full blur-[4px] animate-float-slow" />
    </div>
  );
}
