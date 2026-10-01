import React from "react";
import Image from "next/image";
import { Flame, ShieldCheck, MessageCircle, ShoppingBag } from "lucide-react";

interface NavbarProps {
  onOpenHowToOrder: () => void;
  onOpenCS: () => void;
  onOpenCheckout: () => void;
}

export default function Navbar({
  onOpenHowToOrder,
  onOpenCS,
  onOpenCheckout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EE]/90 backdrop-blur-md border-b border-[#E8DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#D9C6A3] shadow-sm bg-white p-0.5">
            <Image
              src="/logo.jpg"
              alt="Zenwol.id Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain rounded-xl"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-[#2B303A]">
                Zen<span className="text-[#C29841]">wol.id</span>
              </span>
            </div>
            <p className="text-xs font-medium text-[#667085] hidden sm:block">
              Top Up Robux Resmi & Legal
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A5568]">
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
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCS}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4C4A3] bg-white/80 hover:bg-white text-xs sm:text-sm font-bold text-[#2B303A] shadow-xs hover:border-[#C29841] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#10B981]" />
            <span className="hidden sm:inline">Hubungi</span> CS
          </button>
          <button
            onClick={onOpenCheckout}
            className="relative p-2.5 rounded-full border border-[#E0D3BC] bg-white text-[#2B303A] hover:text-[#C29841] shadow-xs transition-all cursor-pointer"
            title="Keranjang Pesanan"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C29841] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              1
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
