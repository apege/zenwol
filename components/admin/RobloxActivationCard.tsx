"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  Lock,
  CheckCircle2,
  Sparkles,
  Zap,
  Check,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react";
import { formatRupiah } from "@/lib/formatters";

interface RobloxActivationCardProps {
  initialUsername?: string;
  onActivatedChange?: (username: string, isActive: boolean) => void;
}

export default function RobloxActivationCard({
  initialUsername = "erewfrwfw",
  onActivatedChange,
}: RobloxActivationCardProps) {
  const [usernameInput, setUsernameInput] = useState(initialUsername);
  const [cleanUsername, setCleanUsername] = useState(
    initialUsername.trim().replace(/^@/, "") || "erewfrwfw"
  );
  const [isActive, setIsActive] = useState(false);
  const [fee, setFee] = useState(100000);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Sync clean username when input changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/^@/, "");
    setUsernameInput(val);
    setCleanUsername(val.trim() || "erewfrwfw");
    setShowSuccessBanner(false);
  };

  // Check activation status from Neon database
  const checkStatus = useCallback(async (user: string) => {
    if (!user.trim()) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/activations?username=${encodeURIComponent(user.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setIsActive(Boolean(data.data.is_active));
        if (data.data.fee) setFee(Number(data.data.fee));
      }
    } catch (err) {
      console.error("Gagal memeriksa status aktivasi akun:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check on initial load or when cleanUsername changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cleanUsername) {
        checkStatus(cleanUsername);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [cleanUsername, checkStatus]);

  // Execute toggle activation
  const handleToggleActivation = async () => {
    if (!cleanUsername.trim()) {
      alert("Silakan masukkan username Roblox terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      const targetState = !isActive;
      const res = await fetch("/api/admin/activations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername.trim(),
          is_active: targetState,
          fee: fee,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memperbarui status aktivasi");
      }

      setIsActive(targetState);
      setIsConfirmOpen(false);
      if (targetState) {
        setShowSuccessBanner(true);
      } else {
        setShowSuccessBanner(false);
      }

      if (onActivatedChange) {
        onActivatedChange(cleanUsername.trim(), targetState);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(`Gagal: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayUsername = cleanUsername.toLowerCase();
  const upperUsername = cleanUsername.toUpperCase();

  return (
    <div className="relative space-y-3">
      {/* SUCCESS NOTIFICATION BANNER */}
      {showSuccessBanner && isActive && (
        <div className="animate-fadeIn">
          <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] py-3 px-4 sm:px-5 rounded-2xl flex items-center justify-between font-black text-xs sm:text-sm tracking-wide shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>ID @{displayUsername} BERHASIL DIAKTIFKAN!</span>
            </div>
            <button
              onClick={() => setShowSuccessBanner(false)}
              className="text-[#065F46]/70 hover:text-[#065F46] p-1 rounded-lg cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN ACTIVATION CARD (Matching Zenwol Warm Luxury Theme) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E8DEC9] p-4 sm:p-7 lg:p-8 shadow-xs text-[#2B303A]">
        {/* Subtle decorative glow */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isActive ? "bg-[#10B981]/10" : "bg-[#C29841]/10"
          }`}
        />

        <div className="relative z-10 space-y-5 sm:space-y-6">
          {/* Top Badge & Header Title */}
          <div className="text-center space-y-2 sm:space-y-2.5">
            {isActive ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] sm:text-xs font-black tracking-widest text-[#059669]">
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                <span>STATUS TERAKTIVASI</span>
                <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[11px] sm:text-xs font-black tracking-widest text-[#D97706]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                <span>PERINGATAN SISTEM</span>
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
              </div>
            )}

            <h2 className="text-xl sm:text-3xl font-black tracking-wider uppercase font-mono">
              {isActive ? (
                <span className="text-[#059669]">ID ROBLOX SUDAH AKTIF</span>
              ) : (
                <span className="text-[#2B303A]">ID ROBLOX BELUM AKTIF</span>
              )}
            </h2>
          </div>

          {/* Username Input Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-2.5 sm:gap-4">
            <span className="text-xs sm:text-sm font-black text-[#8C7A5B] tracking-wider uppercase">
              USERNAME :
            </span>
            <div className="relative flex-1 max-w-md">
              <div className="flex items-center bg-[#FAF7F0] border border-[#E0D3BC] focus-within:border-[#C29841] focus-within:ring-2 focus-within:ring-[#C29841]/20 rounded-2xl px-4 py-2.5 transition-all">
                <span className="text-sm font-black text-[#C29841] mr-1.5 select-none">@</span>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={handleUsernameChange}
                  placeholder="masukkan username Roblox..."
                  className="w-full bg-transparent text-sm sm:text-base font-extrabold text-[#2B303A] placeholder:text-[#9CA3AF] focus:outline-hidden"
                />
                {isLoading && (
                  <Loader2 className="w-4 h-4 text-[#C29841] animate-spin shrink-0 ml-2" />
                )}
              </div>
            </div>
          </div>

          {/* 2 Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Left Card: Status Explanation (2 Cols) */}
            <div
              className={`md:col-span-2 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 border transition-all ${
                isActive
                  ? "bg-[#F0FDF4] border-[#BBF7D0]"
                  : "bg-[#FFFDF5] border-[#F5EAD4]"
              }`}
            >
              <div
                className={`p-2.5 sm:p-3 rounded-xl shrink-0 ${
                  isActive
                    ? "bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC]"
                    : "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>

              <div className="space-y-1">
                <h4
                  className={`text-xs sm:text-sm font-black tracking-wide uppercase ${
                    isActive ? "text-[#15803D]" : "text-[#92400E]"
                  }`}
                >
                  {isActive ? "ID BERHASIL TERAKTIVASI" : "AKTIVASI DIPERLUKAN"}
                </h4>
                <p
                  className={`text-xs sm:text-[13px] leading-relaxed font-medium ${
                    isActive ? "text-[#166534]" : "text-[#78350F]"
                  }`}
                >
                  {isActive ? (
                    <>
                      ID Roblox pada order akun{" "}
                      <span className="text-[#059669] font-black">@{displayUsername}</span> telah aktif
                      dan terverifikasi legal. Transaksi pengiriman Robux dapat segera dilanjutkan.
                    </>
                  ) : (
                    <>
                      ID Roblox pada order akun{" "}
                      <span className="text-[#D97706] font-black">@{displayUsername}</span> belum aktif
                      di server. Silakan aktifkan ID terlebih dahulu untuk melanjutkan proses
                      pengiriman Robux.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right Card: Biaya Pengaktifan (1 Col) */}
            <div className="bg-[#FAF7F0] border border-[#E0D3BC] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8C7A5B] mb-1">
                BIAYA PENGAKTIFAN ID
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-[#C29841] font-mono tracking-tight">
                {formatRupiah(fee)}
              </span>
            </div>
          </div>

          {/* Admin Note Strip */}
          <div className="bg-[#FAF7F0] border border-[#EAE0D0] rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 text-xs text-[#667085]">
            <Sparkles className="w-4 h-4 text-[#C29841] shrink-0" />
            <span className="font-medium">
              <strong className="text-[#2B303A] font-extrabold">Catatan Admin:</strong> Setelah ID @
              <span className="text-[#C29841] font-bold">{displayUsername}</span> diaktifkan, order
              dapat langsung diproses seperti biasa.
            </span>
          </div>

          {/* Main Action Button */}
          <div>
            {isActive ? (
              <button
                type="button"
                onClick={handleToggleActivation}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065F46] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-[#059669]/25 hover:shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 stroke-[3]" />
                )}
                <span>
                  ID @{upperUsername} SUDAH AKTIF (KLIK UNTUK NONAKTIFKAN)
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                disabled={isSubmitting || !cleanUsername.trim()}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C29841] via-[#B38933] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>AKTIFKAN ID @{upperUsername} SEKARANG</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL (Matching Zenwol Theme) */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative w-full max-w-sm sm:max-w-md bg-white border border-[#E8DEC9] rounded-3xl p-6 sm:p-7 text-center shadow-2xl space-y-5 animate-scaleUp">
            {/* Modal Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center mx-auto text-[#C29841] shadow-xs">
              <Zap className="w-6 h-6 fill-[#C29841]" />
            </div>

            {/* Modal Title & Desc */}
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#2B303A] tracking-tight">
                Konfirmasi Pengaktifan ID
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Lakukan pengaktifan ID Roblox untuk akun{" "}
                <span className="text-[#C29841] font-black">@{displayUsername}</span> dengan biaya{" "}
                <strong className="text-[#2B303A] font-black">{formatRupiah(fee)}</strong>?
              </p>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#667085] hover:text-[#2B303A] font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleToggleActivation}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-black text-xs sm:text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Ya, Aktifkan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
