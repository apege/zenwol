import React from "react";
import { HelpCircle, X } from "lucide-react";

interface HowToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToOrderModal({ isOpen, onClose }: HowToOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp my-auto">
        <div className="bg-[#FAF5EA] p-4 sm:p-5 border-b border-[#E8DEC9] flex items-center justify-between">
          <h3 className="font-extrabold text-[#2B303A] text-sm sm:text-base flex items-center gap-2">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#C29841]" />
            Cara Order Robux di Zenwol.id
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#E0D3BC] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs text-[#4A5568]">
          <div className="flex gap-2.5 sm:gap-3">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C29841] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">1</span>
            <p><strong>Masukkan Username:</strong> Cukup isi username Roblox Anda tanpa perlu password akun.</p>
          </div>
          <div className="flex gap-2.5 sm:gap-3">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C29841] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">2</span>
            <p><strong>Pilih Paket:</strong> Pilih nominal Robux resmi yang ingin dibeli sesuai pricelist.</p>
          </div>
          <div className="flex gap-2.5 sm:gap-3">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C29841] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">3</span>
            <p><strong>Pilih Pembayaran:</strong> Bayar instan via QRIS (semua e-wallet/bank) atau pesan via WhatsApp.</p>
          </div>
          <div className="flex gap-2.5 sm:gap-3">
            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C29841] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">4</span>
            <p><strong>Robux Masuk:</strong> Sistem memproses pengiriman dalam waktu 5-10 menit bergaransi 100%.</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#C29841] text-white font-bold text-xs mt-2 hover:bg-[#A57E2F] transition-all cursor-pointer active:scale-98"
          >
            Mengerti & Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
}
