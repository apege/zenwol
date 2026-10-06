import React from "react";
import Image from "next/image";
import { Flame, ShieldCheck, MessageCircle, ShoppingBag } from "lucide-react";

interface NavbarProps {
  onOpenHowToOrder: () => void;
  onOpenCS: () => void;
  onOpenCart: () => void;
  cartCount: number;
  logoSrc?: string | null;
  storeName?: string;
}

export default function Navbar({
  onOpenHowToOrder,
  onOpenCS,
  onOpenCart,
  cartCount,
  logoSrc,
  storeName,
}: NavbarProps) {
  const activeBrandName = (storeName || "Zenwol.id").trim();

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#E8DEC9] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 group">
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border border-[#D9C6A3] shadow-2xs bg-white p-0.5 shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src={logoSrc || "/logo.jpg"}
              alt={`${activeBrandName} Logo`}
              width={48}
              height={48}
              unoptimized={!!logoSrc && logoSrc.startsWith("data:")}
              className="w-full h-full object-contain rounded-lg sm:rounded-xl"
              priority
            />
          </div>
          <div>
            <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#2B303A] leading-tight">
              {(() => {
                if (activeBrandName.toLowerCase().startsWith("zen")) {
                  return (
                    <>
                      Zen<span className="text-[#C29841]">{activeBrandName.slice(3)}</span>
                    </>
                  );
                }
                return activeBrandName;
              })()}
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-[#667085] hidden sm:block">
              Top Up Robux Resmi & Legal
            </p>
          </div>
        </a>

        {/* Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#4A5568]">
          <a
            href="#step-packages"
            className="flex items-center gap-1.5 hover:text-[#C29841] transition-colors py-1"
          >
            <Flame className="w-4 h-4 text-[#C29841]" />
            Pricelist Robux
          </a>
          <button
            onClick={onOpenHowToOrder}
            className="hover:text-[#C29841] transition-colors py-1 cursor-pointer"
          >
            Cara Order
          </button>
          <a
            href="#section-testimonials"
            className="flex items-center gap-1.5 hover:text-[#C29841] transition-colors py-1"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            Testimoni
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCS}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D4C4A3] bg-white/90 hover:bg-white text-xs sm:text-sm font-bold text-[#2B303A] shadow-2xs hover:border-[#C29841] transition-all cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10B981]" />
            <span>Hubungi <span className="hidden xs:inline">CS</span></span>
          </button>
          <button
            onClick={onOpenCart}
            className="relative p-2 sm:p-2.5 rounded-full border border-[#E0D3BC] bg-white text-[#2B303A] hover:text-[#C29841] shadow-2xs transition-all cursor-pointer active:scale-95"
            title="Keranjang Pesanan"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#C29841] text-white text-[9px] sm:text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-scaleUp">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
