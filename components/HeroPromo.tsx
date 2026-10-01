import React from "react";
import Image from "next/image";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { RobuxPackage } from "@/types";

interface HeroPromoProps {
  onSelectPromo: () => void;
  promoPackage: RobuxPackage;
  timeLeft: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function HeroPromo({
  onSelectPromo,
  promoPackage,
  timeLeft,
}: HeroPromoProps) {
  return (
    <section className="bg-gradient-to-br from-white via-[#FCFAF5] to-[#F5EFE0] rounded-3xl border border-[#E6D7B9] p-6 sm:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative subtle ambient circle */}
      <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#C29841]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Offer Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badges */}
          <div className="inline-flex items-center gap-2 p-1 pl-3 pr-3.5 rounded-full bg-[#F5ECDB] border border-[#E2D2B0] text-xs font-bold text-[#2B303A]">
            <span className="text-[#C29841]">PROMO SPESIAL BULAN INI</span>
            <span className="bg-[#C29841] text-white px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold">
              LIMITED STOCK
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2B303A] uppercase">
              ROBUX BULAN <span className="text-[#C29841]">INI</span>
            </h1>
            <p className="text-sm sm:text-base font-medium text-[#667085]">
              Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!
            </p>
          </div>

          {/* Price Highlight */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E8DEC9] p-1 flex items-center justify-center shadow-xs">
                <Image
                  src="/robux.webp"
                  alt="Robux Icon"
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#2B303A]">
                  {promoPackage.robux.toLocaleString("id-ID")}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#667085] uppercase tracking-wide">
                  ROBUX
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-bold text-[#98A2B3] line-through">
                2.000 Robux
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#C29841]">
                Rp {promoPackage.price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#step-account"
              onClick={onSelectPromo}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Zap className="w-5 h-5 fill-white" />
              Beli Robux Sekarang
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#section-testimonials"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#D9C6A3] text-[#2B303A] font-bold text-sm sm:text-base shadow-xs transition-all"
            >
              Lihat Testimoni
            </a>
          </div>
        </div>

        {/* Right Col: Countdown & Trust Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#E6D7B9] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#C29841] tracking-wider uppercase">
              <Clock className="w-4 h-4" />
              <span>PROMO BERAKHIR DALAM</span>
            </div>

            {/* Countdown Cards */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
              <div className="bg-[#FAF6ED] border border-[#E8DEC9] rounded-2xl p-2.5 sm:p-3 shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-[#2B303A]">{timeLeft.days}</span>
                <span className="text-[10px] font-bold text-[#8C7A58] uppercase">HARI</span>
              </div>
              <div className="bg-[#FAF6ED] border border-[#E8DEC9] rounded-2xl p-2.5 sm:p-3 shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-[#2B303A]">{timeLeft.hours}</span>
                <span className="text-[10px] font-bold text-[#8C7A58] uppercase">JAM</span>
              </div>
              <div className="bg-[#FAF6ED] border border-[#E8DEC9] rounded-2xl p-2.5 sm:p-3 shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-[#2B303A]">{timeLeft.minutes}</span>
                <span className="text-[10px] font-bold text-[#8C7A58] uppercase">MENIT</span>
              </div>
              <div className="bg-[#FAF6ED] border border-[#E8DEC9] rounded-2xl p-2.5 sm:p-3 shadow-xs">
                <span className="block text-xl sm:text-2xl font-black text-[#C29841]">{timeLeft.seconds}</span>
                <span className="text-[10px] font-bold text-[#8C7A58] uppercase">DETIK</span>
              </div>
            </div>

            {/* Guarantee Subcard */}
            <div className="bg-[#FCFAF5] border border-[#EFE5D2] rounded-2xl p-3.5 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#F0E6D2] border border-[#DFCFAE] flex items-center justify-center shrink-0 p-1">
                <Image
                  src="/logo.jpg"
                  alt="Zenwol Avatar"
                  width={36}
                  height={36}
                  className="rounded-lg object-contain"
                />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold text-[#2B303A]">
                  Garansi Proses Kilat
                </h2>
                <p className="text-xs text-[#667085]">
                  Langsung otomatis ke akun kamu 5-10 menit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
