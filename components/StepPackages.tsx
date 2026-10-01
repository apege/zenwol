import React from "react";
import Image from "next/image";
import { Flame, Zap, Crown, Check } from "lucide-react";
import { RobuxPackage } from "@/types";

interface StepPackagesProps {
  packages: RobuxPackage[];
  selectedPackage: RobuxPackage;
  onSelectPackage: (pkg: RobuxPackage) => void;
  filterCategory: "all" | "popular" | "promo" | "sultan";
  onFilterChange: (cat: "all" | "popular" | "promo" | "sultan") => void;
}

export default function StepPackages({
  packages,
  selectedPackage,
  onSelectPackage,
  filterCategory,
  onFilterChange,
}: StepPackagesProps) {
  const popularCount = packages.filter((p) => p.isPopular).length;
  const promoCount = packages.filter((p) => p.isPromo).length;
  const sultanCount = packages.filter((p) => p.isSultan).length;

  const filteredPackages = packages.filter((pkg) => {
    if (filterCategory === "popular") return pkg.isPopular;
    if (filterCategory === "promo") return pkg.isPromo;
    if (filterCategory === "sultan") return pkg.isSultan;
    return true;
  });

  return (
    <section
      id="step-packages"
      className="bg-white rounded-3xl border border-[#E6D7B9] p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-24"
    >
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 rounded-full bg-[#C29841] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
            2
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#2B303A]">
                Pilih Robux
              </h2>
              <span className="text-xs font-bold text-[#C29841]">
                (Pricelist Resmi Zenwol.id)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
              Pilih paket nominal Robux yang ingin Anda beli
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === "all"
                ? "bg-[#C29841] text-white shadow-xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            Semua ({packages.length})
          </button>
          <button
            onClick={() => onFilterChange("popular")}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === "popular"
                ? "bg-[#C29841] text-white shadow-xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Populer ({popularCount})
          </button>
          <button
            onClick={() => onFilterChange("promo")}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === "promo"
                ? "bg-[#C29841] text-white shadow-xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Promo ({promoCount})
          </button>
          <button
            onClick={() => onFilterChange("sultan")}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCategory === "sultan"
                ? "bg-[#C29841] text-white shadow-xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Paket Sultan ({sultanCount})
          </button>
        </div>
      </div>

      {/* Grid of Robux Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPackage.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={`group relative rounded-2xl p-4.5 cursor-pointer transition-all border ${
                isSelected
                  ? "bg-[#FBF6EB] border-[#C29841] shadow-md ring-2 ring-[#C29841]/30"
                  : "bg-[#FCFAF5] border-[#E8DEC9] hover:border-[#C29841]/70 hover:bg-white"
              }`}
            >
              {/* Promo / Sultan Tag */}
              {pkg.tag && (
                <div className="absolute -top-2.5 left-4">
                  <span className="bg-[#C29841] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                    {pkg.tag}
                  </span>
                </div>
              )}

              {/* Top Row: Icon + Robux Amount + Plus badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {/* Official Robux Gold Logo Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E8DEC9] p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Image
                      src="/robux.webp"
                      alt="Robux Icon"
                      width={38}
                      height={38}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-[#2B303A]">
                        {pkg.robux.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-bold text-[#C29841]">
                        Robux
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-[#2B303A]">
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Check or Plus Indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#C29841] text-white"
                      : "bg-[#EDE2CD] text-[#7A6B4E] group-hover:bg-[#C29841] group-hover:text-white"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : "+"}
                </div>
              </div>

              {/* Bottom details */}
              <div className="pt-2 border-t border-[#EDE4D0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[#10B981] font-bold text-[11px]">
                  <Zap className="w-3 h-3 fill-[#10B981]" />
                  INSTAN
                </div>
                <span
                  className={`font-bold text-[11px] ${
                    isSelected ? "text-[#C29841]" : "text-[#7A8394]"
                  }`}
                >
                  {isSelected ? "Terpilih ✓" : "Pilih"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
