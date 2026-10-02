import React from "react";
import { Zap, ShieldCheck, User, MessageCircle, Award } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Proses Cepat",
    desc: "5 - 10 Menit Beres",
    fillIcon: true,
  },
  {
    icon: ShieldCheck,
    title: "Bayar Aman",
    desc: "Legal & Terpercaya",
  },
  {
    icon: User,
    title: "Cukup User ID",
    desc: "Tanpa Password",
  },
  {
    icon: MessageCircle,
    title: "Fast Respon",
    desc: "Admin Ramah 24/7",
  },
  {
    icon: Award,
    title: "Garansi 100%",
    desc: "Uang Kembali",
  },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-3 sm:p-6 shadow-2xs overflow-hidden">
      {/* 1. Mobile View: Smooth Auto-Sliding Marquee (Gerak ke samping) */}
      <div className="md:hidden relative w-full overflow-hidden">
        {/* Subtle gradient fades on left & right edge */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-smooth flex items-center gap-3">
          {/* First loop of features */}
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`feat-1-${idx}`}
                className="flex items-center gap-2.5 p-2.5 px-3.5 bg-[#FCFAF5] rounded-xl border border-[#E8DEC9] shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
                  <Icon className={`w-4 h-4 ${item.fillIcon ? "fill-[#C29841]" : ""}`} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#2B303A] whitespace-nowrap leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-[10px] text-[#667085] whitespace-nowrap">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Second loop of features for seamless infinite scrolling */}
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`feat-2-${idx}`}
                className="flex items-center gap-2.5 p-2.5 px-3.5 bg-[#FCFAF5] rounded-xl border border-[#E8DEC9] shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
                  <Icon className={`w-4 h-4 ${item.fillIcon ? "fill-[#C29841]" : ""}`} />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-[#2B303A] whitespace-nowrap leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-[10px] text-[#667085] whitespace-nowrap">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Desktop & Tablet View: Clean 5-Column Grid */}
      <div className="hidden md:grid md:grid-cols-5 gap-4">
        {FEATURES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={`feat-desk-${idx}`} className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
                <Icon className={`w-5 h-5 ${item.fillIcon ? "fill-[#C29841]" : ""}`} />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#2B303A] leading-tight">
                  {item.title}
                </h2>
                <p className="text-[11px] text-[#667085]">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
