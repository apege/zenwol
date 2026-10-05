"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Send,
} from "lucide-react";
import { formatRobux } from "@/lib/formatters";

interface CustomerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string;
  onReviewSuccess?: () => void;
}

interface VerifiedOrder {
  id: number;
  order_code: string;
  roblox_username: string;
  robux_amount?: number;
  price?: number;
  order_status: string;
}

export default function CustomerReviewModal({
  isOpen,
  onClose,
  initialToken = "",
  onReviewSuccess,
}: CustomerReviewModalProps) {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<VerifiedOrder | null>(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const verifyToken = useCallback(async (code: string) => {
    const cleanCode = code.trim().replace(/^#/, "");
    if (!cleanCode) return;

    setIsVerifying(true);
    setVerificationError(null);
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.data) {
        setVerificationError("Kode pesanan / token tidak valid atau tidak ditemukan.");
        return;
      }

      const ord = data.data;
      if (ord.order_status === "cancelled") {
        setVerificationError("Pesanan ini telah dibatalkan, tidak dapat memberikan review.");
        return;
      }

      setOrderData(ord);
    } catch {
      setVerificationError("Gagal memverifikasi token pesanan. Silakan coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setSubmitError(null);
      setRating(5);
      setComment("");
      if (initialToken) {
        setTokenInput(initialToken);
        verifyToken(initialToken);
      } else {
        setTokenInput("");
        setOrderData(null);
      }
    }
  }, [isOpen, initialToken, verifyToken]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData) {
      setSubmitError("Token pesanan belum terverifikasi.");
      return;
    }
    if (!comment.trim()) {
      setSubmitError("Silakan tulis ulasan atau testimoni kamu.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orderData.roblox_username,
          message: comment.trim(),
          rating,
          order_code: orderData.order_code,
          status: "approved",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengirim ulasan.");
      }

      setIsSubmitted(true);
      if (onReviewSuccess) {
        onReviewSuccess();
      }
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5:
        return "Sangat Puas ⭐⭐⭐⭐⭐";
      case 4:
        return "Puas ⭐⭐⭐⭐";
      case 3:
        return "Cukup ⭐⭐⭐";
      case 2:
        return "Kurang Puas ⭐⭐";
      case 1:
        return "Tidak Puas ⭐";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DEC9] space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E7D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#2B303A] tracking-tight">
                Beri Testimoni & Review
              </h2>
              <p className="text-[11px] text-[#667085]">
                Ulasan terverifikasi pelanggan Zenwol.id
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F3EFE6] text-[#8C7A5B] hover:text-[#2B303A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {isSubmitted ? (
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#10B981]/30 flex items-center justify-center mx-auto text-[#059669] shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-[#2B303A]">
                Terima Kasih Banyak! ✨
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] max-w-sm mx-auto leading-relaxed">
                Ulasan kamu berhasil diterbitkan dan membantu calon pembeli lain mempercayai Zenwol.id!
              </p>
            </div>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] text-white font-extrabold text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Tutup & Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Step 1: Token Verification */}
            {!orderData ? (
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8DEC9]">
                <label className="block text-xs font-black text-[#2B303A]">
                  Masukkan Kode Order / Token Review
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: ZEN21895427"
                    className="flex-1 bg-white border border-[#E0D3BC] rounded-xl py-2.5 px-3.5 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => verifyToken(tokenInput)}
                    disabled={isVerifying || !tokenInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#C29841] hover:bg-[#A57E2F] text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Verifikasi</span>
                    )}
                  </button>
                </div>
                {verificationError && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11D48] pt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{verificationError}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Verified Order Card */
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#E6D7B9] flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                    <span>Terverifikasi (#{orderData.order_code})</span>
                  </div>
                  <div className="font-black text-sm text-[#2B303A] truncate">
                    @{orderData.roblox_username}
                  </div>
                  {orderData.robux_amount && (
                    <div className="text-[11px] font-bold text-[#8C6D23] flex items-center gap-1">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={12}
                        height={12}
                        className="w-3 h-3 object-contain"
                      />
                      <span>{formatRobux(orderData.robux_amount)}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderData(null);
                    setTokenInput("");
                  }}
                  className="text-[11px] font-extrabold text-[#8C7A5B] hover:text-[#C29841] underline cursor-pointer shrink-0"
                >
                  Ganti
                </button>
              </div>
            )}

            {/* Step 2: Rating Stars */}
            {orderData && (
              <>
                <div>
                  <label className="block text-xs font-black text-[#2B303A] mb-1.5">
                    Rating Kepuasan Kamu
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E0D3BC]">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= (hoverRating ?? rating)
                                ? "fill-[#F59E0B] text-[#F59E0B]"
                                : "text-[#D1D5DB]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-black text-[#A57E2F]">
                      {getRatingLabel(hoverRating ?? rating)}
                    </span>
                  </div>
                </div>

                {/* Step 3: Comment Textarea */}
                <div>
                  <label className="block text-xs font-black text-[#2B303A] mb-1.5">
                    Ulasan / Testimoni <span className="text-[#E11D48]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan pengalaman belanja kamu di Zenwol.id (Contoh: Pengiriman kilat, aman banget, fast respon!)..."
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl p-3.5 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all resize-none"
                    required
                  />
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-bold text-[#E11D48] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E7D8]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A] text-xs sm:text-sm font-bold transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Ulasan</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
