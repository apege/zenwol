import React from "react";
import { X } from "lucide-react";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProofModal({ isOpen, onClose }: ProofModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E6D7B9] w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[#2B303A] text-sm">
            Bukti Transaksi Member
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF5EA] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[#D9C6A3] bg-[#1F242D] p-4 text-white text-xs space-y-2">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Status</span>
            <span className="text-[#10B981] font-bold">✓ Pending Sales (Robux Added)</span>
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="text-gray-400">Total Robux</span>
            <span className="font-bold text-[#C29841]">+4.200 R$</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Type</span>
            <span>Group Payout / Gamepass</span>
          </div>
        </div>
        <p className="text-[11px] text-[#667085] text-center">
          *Tangkapan layar transaksi terverifikasi dari member Zenwol.id.
        </p>
      </div>
    </div>
  );
}
