"use client";

import React, { useState } from "react";
import { X, ShieldAlert } from "lucide-react";

interface AddBlacklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    username: string;
    whatsappNumber?: string;
    reason: string;
  }) => void;
}

export default function AddBlacklistModal({
  isOpen,
  onClose,
  onSave,
}: AddBlacklistModalProps) {
  const [username, setUsername] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Silakan masukkan username Roblox yang ingin diblacklist.");
      return;
    }
    if (!reason.trim()) {
      setError("Silakan masukkan alasan pemblokiran.");
      return;
    }

    onSave({
      username: username.replace(/^@/, "").trim(),
      whatsappNumber: whatsappNumber.trim() || undefined,
      reason: reason.trim(),
    });

    setUsername("");
    setWhatsappNumber("");
    setReason("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DEC9] space-y-6 animate-scaleUp">
        {/* Header (Matching Reference Image 2) */}
        <div className="flex items-center justify-between pb-2 border-b border-[#F0E7D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#E11D48]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#2B303A] tracking-tight">
              Tambah Akun Ke Blacklist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F3EFE6] text-[#8C7A5B] hover:text-[#2B303A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-bold text-[#E11D48]">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Username Roblox */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Username Roblox
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: Perusuh123"
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
              required
            />
          </div>

          {/* Field 2: Nomor WhatsApp (Opsional) */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Nomor WhatsApp (Opsional)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>

          {/* Field 3: Alasan Blokir */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Alasan Blokir
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Indikasi Bukti Palsu / Penipuan"
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
              required
            />
          </div>

          {/* Action Buttons (Matching Reference Image) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E7D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A] text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#D01840] hover:to-[#A71034] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#E11D48]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Simpan Blacklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
