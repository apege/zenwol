import React from "react";
import Image from "next/image";
import { Flame, Zap, Crown, Check, Plus } from "lucide-react";
import { RobuxPackage, CartItem } from "@/types";

interface StepPackagesProps {
  packages: RobuxPackage[];
  selectedPackage: RobuxPackage;
  onSelectPackage: (pkg: RobuxPackage) => void;
  cartItems: CartItem[];
  onAddToCart: (pkg: RobuxPackage, e?: React.MouseEvent) => void;
  filterCategory: "all" | "popular" | "promo" | "sultan";
  onFilterChange: (cat: "all" | "popular" | "promo" | "sultan") => void;
}

export default function StepPackages({
  packages,
  selectedPackage,
  onSelectPackage,
  cartItems,
  onAddToCart,
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
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-3.5 sm:p-8 shadow-xs space-y-4 sm:space-y-6 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-2.5 sm:gap-4">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#C29841] text-white font-extrabold text-xs sm:text-base flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            2
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h2 className="text-base sm:text-2xl font-black text-[#2B303A] leading-tight">
                Pilih Robux
              </h2>
              <span className="text-[11px] sm:text-xs font-bold text-[#C29841]">
                (Pricelist Resmi Zenwol.id)
              </span>
            </div>
            <p className="text-[11px] sm:text-sm text-[#667085] mt-0.5">
              Pilih paket nominal Robux yang ingin Anda beli
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filterCategory === "all"
                ? "bg-[#C29841] text-white shadow-2xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            Semua ({packages.length})
          </button>
          <button
            onClick={() => onFilterChange("popular")}
            className={`flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filterCategory === "popular"
                ? "bg-[#C29841] text-white shadow-2xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Populer ({popularCount})
          </button>
          <button
            onClick={() => onFilterChange("promo")}
            className={`flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filterCategory === "promo"
                ? "bg-[#C29841] text-white shadow-2xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Promo ({promoCount})
          </button>
          <button
            onClick={() => onFilterChange("sultan")}
            className={`flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filterCategory === "sultan"
                ? "bg-[#C29841] text-white shadow-2xs"
                : "bg-[#FAF5EA] text-[#667085] hover:bg-[#F3E9D3]"
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Paket Sultan ({sultanCount})
          </button>
        </div>
      </div>

      {/* Grid of Robux Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredPackages.map((pkg) => {
          const isSelected = selectedPackage.id === pkg.id;
          const cartItem = cartItems.find((item) => item.pkg.id === pkg.id);
          const inCartQuantity = cartItem ? cartItem.quantity : 0;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className={`group rounded-2xl p-3 sm:p-4 cursor-pointer transition-all border flex flex-col justify-between relative ${
                isSelected || inCartQuantity > 0
                  ? "bg-[#FDFBF7] border-[#C29841] shadow-md ring-2 ring-[#C29841]/30"
                  : "bg-white border-[#E8DEC9] hover:border-[#C29841]/70 hover:shadow-2xs active:scale-98"
              }`}
            >
              {/* 1. Top Row: PROMO Badge (Left) & Plus/Cart Button (Right) */}
              <div className="flex items-center justify-between min-h-[22px] mb-2">
                <div>
                  {pkg.tag ? (
                    <span className="inline-block bg-[#C29841] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-2xs">
                      {pkg.tag}
                    </span>
                  ) : (
                    <span className="block h-4" />
                  )}
                </div>

                {/* Plus / Add to Cart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(pkg, e);
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer active:scale-90 ${
                    inCartQuantity > 0
                      ? "bg-[#C29841] text-white shadow-2xs ring-2 ring-[#C29841]/20"
                      : "bg-[#FAF5EA] border border-[#E8DEC9] text-[#C29841] hover:bg-[#C29841] hover:text-white"
                  }`}
                  title={inCartQuantity > 0 ? `Tambah lagi (${inCartQuantity} di keranjang)` : "Tambah ke Keranjang"}
                >
                  {inCartQuantity > 0 ? (
                    <span className="text-[10px] font-black">{inCartQuantity}</span>
                  ) : (
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {/* 2. Middle Row: Robux Circle Icon (Left) + Text Details (Right) */}
              <div className="flex items-center gap-2.5 mb-3">
                {/* Coin Icon */}
                <div className="w-10 h-10 rounded-full bg-[#FAF6ED] border border-[#E8DEC9] p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image
                    src="/robux.webp"
                    alt="Robux Icon"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Amount & Price */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1 leading-tight whitespace-nowrap">
                    <span className="text-sm font-extrabold text-[#2B303A]">
                      {pkg.robux.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[11px] font-bold text-[#C29841]">
                      Robux
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#C29841] mt-0.5 leading-tight whitespace-nowrap">
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* 3. Bottom Row: Instant Tag (Left) & Select Status (Right) */}
              <div className="pt-2 border-t border-[#F0E6D2] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-[#10B981] font-bold text-[10px] sm:text-[11px]">
                  <Zap className="w-3 h-3 fill-[#10B981]" />
                  INSTAN
                </div>
                <span
                  className={`font-bold text-[10px] sm:text-[11px] ${
                    isSelected || inCartQuantity > 0 ? "text-[#C29841]" : "text-[#8C7A58]"
                  }`}
                >
                  {inCartQuantity > 0 ? `+${inCartQuantity} Keranjang` : isSelected ? "Dipilih ✓" : "Pilih"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
