import React from "react";
import Image from "next/image";
import { Zap, ShoppingBag } from "lucide-react";
import { RobuxPackage, CartItem } from "@/types";

interface StickyBottomBarProps {
  selectedPackage: RobuxPackage;
  cartItems: CartItem[];
  onOpenCheckout: () => void;
  onOpenCart: () => void;
}

export default function StickyBottomBar({
  selectedPackage,
  cartItems,
  onOpenCheckout,
  onOpenCart,
}: StickyBottomBarProps) {
  // If cart has multiple items, use cart summary; otherwise use single selected package
  const hasMultipleInCart = cartItems.length > 0;
  const totalRobux = hasMultipleInCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.robux * item.quantity, 0)
    : selectedPackage.robux;
  const totalPrice = hasMultipleInCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.price * item.quantity, 0)
    : selectedPackage.price;
  const totalItems = hasMultipleInCart
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 1;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#E8DEC9] p-2.5 sm:p-4 shadow-xl">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Selected / Cart info */}
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#667085] truncate">
            <span>Total Pesanan</span>
            {hasMultipleInCart && (
              <button
                onClick={onOpenCart}
                className="inline-flex items-center gap-1 text-[#C29841] font-bold hover:underline cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                ({totalItems} Paket di Keranjang)
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-white border border-[#E8DEC9] p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={18}
                height={18}
                className="object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-xs sm:text-base font-extrabold text-[#2B303A] truncate">
                {totalRobux.toLocaleString("id-ID")} Robux
              </span>
              <span className="text-sm sm:text-xl md:text-2xl font-black text-[#C29841]">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <button
          onClick={onOpenCheckout}
          className="px-4 sm:px-8 md:px-10 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-black text-xs sm:text-sm md:text-base inline-flex items-center gap-1.5 sm:gap-2 shadow-md shadow-[#C29841]/20 hover:shadow-[#C29841]/35 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white shrink-0" />
          <span>Bayar Sekarang</span>
        </button>
      </div>
    </div>
  );
}
