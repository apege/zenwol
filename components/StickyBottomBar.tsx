import React from "react";
import Image from "next/image";
import { Zap } from "lucide-react";
import { RobuxPackage } from "@/types";

interface StickyBottomBarProps {
  selectedPackage: RobuxPackage;
  onOpenCheckout: () => void;
}

export default function StickyBottomBar({
  selectedPackage,
  onOpenCheckout,
}: StickyBottomBarProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#E8DEC9] p-3 sm:p-4 shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="text-[11px] font-semibold text-[#667085]">
            Total Pesanan
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white border border-[#E8DEC9] p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-[#2B303A]">
              {selectedPackage.robux.toLocaleString("id-ID")} Robux
            </span>
            <span className="text-lg sm:text-2xl font-black text-[#C29841] ml-1">
              Rp {selectedPackage.price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenCheckout}
          className="px-6 sm:px-10 py-3 sm:py-3.5 rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-extrabold text-sm sm:text-base inline-flex items-center gap-2 shadow-lg shadow-[#C29841]/25 hover:shadow-[#C29841]/40 transition-all cursor-pointer active:scale-95"
        >
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          Bayar Sekarang
        </button>
      </div>
    </div>
  );
}
