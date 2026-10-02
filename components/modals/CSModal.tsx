import React from "react";
import { MessageCircle } from "lucide-react";

interface CSModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber: string;
}

export default function CSModal({ isOpen, onClose, whatsappNumber }: CSModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] w-full max-w-sm overflow-hidden shadow-2xl text-center p-5 sm:p-6 space-y-3 sm:space-y-4 animate-scaleUp my-auto">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E6F8F0] border border-[#BDEBD6] text-[#10B981] flex items-center justify-center mx-auto">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-[#2B303A] text-base sm:text-lg">
            Customer Service 24/7
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed">
            Admin Zenwol.id siap membantu pertanyaan, kendala transaksi, atau permintaan token review.
          </p>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}?text=Halo%20Admin%20Zenwol.id,%20saya%20butuh%20bantuan%20terkait%20top%20up%20Robux`}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
        >
          <MessageCircle className="w-4 h-4" />
          Chat WhatsApp CS Resmi
        </a>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl sm:rounded-2xl bg-[#FAF5EA] text-[#667085] font-bold text-xs hover:bg-[#F3E9D3] transition-all cursor-pointer"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
