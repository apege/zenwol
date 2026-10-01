import React from "react";
import { HelpCircle, X } from "lucide-react";

interface HowToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToOrderModal({ isOpen, onClose }: HowToOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E6D7B9] w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-[#FAF5EA] p-5 border-b border-[#E8DEC9] flex items-center justify-between">
          <h3 className="font-extrabold text-[#2B303A] text-base flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C29841]" />
            Cara Order Robux di Zenwol.id
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D3BC] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-xs text-[#4A5568]">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C29841] text-white font-bold flex items-center justify-center shrink-0">1</span>
            <p><strong>Masukkan Username:</strong> Cukup isi username Roblox Anda tanpa perlu password akun.</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C29841] text-white font-bold flex items-center justify-center shrink-0">2</span>
            <p><strong>Pilih Paket:</strong> Pilih nominal Robux resmi yang ingin dibeli sesuai pricelist.</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C29841] text-white font-bold flex items-center justify-center shrink-0">3</span>
            <p><strong>Pilih Pembayaran:</strong> Bayar instan via QRIS (semua e-wallet/bank) atau pesan via WhatsApp.</p>
          </div>
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#C29841] text-white font-bold flex items-center justify-center shrink-0">4</span>
            <p><strong>Robux Masuk:</strong> Sistem memproses pengiriman dalam waktu 5-10 menit bergaransi 100%.</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#C29841] text-white font-bold text-xs mt-2 hover:bg-[#A57E2F] transition-all cursor-pointer"
          >
            Mengerti & Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
}
