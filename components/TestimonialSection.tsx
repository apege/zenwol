"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  Lock,
  MessageCircle,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  X,
  UserCheck,
} from "lucide-react";
import { Testimonial } from "@/types";
import { formatRobux } from "@/lib/formatters";

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  onOpenCS: () => void;
  initialToken?: string;
  onTestimonialSubmitted?: () => void;
}

interface VerifiedOrder {
  id: number;
  order_code: string;
  roblox_username: string;
  robux_amount?: number;
  price?: number;
  order_status: string;
}

export default function TestimonialSection({
  testimonials,
  onOpenCS,
  initialToken = "",
  onTestimonialSubmitted,
}: TestimonialSectionProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);
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
      // 1. Verify order in database
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanCode)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.data) {
        setVerificationError("Kode order / token tidak valid atau tidak ditemukan.");
        return;
      }

      const ord = data.data;
      if (ord.order_status === "cancelled") {
        setVerificationError("Pesanan ini telah dibatalkan, tidak dapat memberikan ulasan.");
        return;
      }

      // 2. Anti-spam check: Verify if this order already gave a review
      const reviewCheckRes = await fetch(`/api/testimonials?search=${encodeURIComponent(cleanCode)}`);
      const reviewCheckData = await reviewCheckRes.json();
      if (reviewCheckData.success && Array.isArray(reviewCheckData.data)) {
        const isDupe = reviewCheckData.data.some(
          (t: { order_code?: string | null }) =>
            (t.order_code && t.order_code.replace(/^#/, "") === cleanCode) ||
            (ord.order_code && t.order_code === ord.order_code)
        );
        if (isDupe) {
          setVerificationError("Ulasan untuk pesanan ini sudah pernah dikirim sebelumnya.");
          return;
        }
      }

      setOrderData(ord);
      setIsOpenForm(true);
    } catch {
      setVerificationError("Gagal memverifikasi token pesanan. Silakan coba lagi.");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (initialToken) {
      setTokenInput(initialToken);
      setIsOpenForm(true);
      verifyToken(initialToken);
    }
  }, [initialToken, verifyToken]);

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
      // Clean token URL to prevent re-opening on reload
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted();
      }

      // Auto close after 3 seconds
      setTimeout(() => {
        handleResetForm();
      }, 3000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim ulasan.");
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

  const handleResetForm = () => {
    setIsSubmitted(false);
    setOrderData(null);
    setTokenInput("");
    setComment("");
    setRating(5);
    setSubmitError(null);
    setVerificationError(null);
    setIsOpenForm(false);
  };

  return (
    <section
      id="section-testimonials"
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-4 sm:p-8 shadow-xs space-y-4 sm:space-y-6 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C29841] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-[#2B303A] leading-tight">
            Testimoni Member
          </h2>
          <p className="text-[11px] sm:text-sm text-[#667085] mt-0.5">
            Apa kata mereka yang sudah top up Robux di Zenwol.id
          </p>
        </div>
      </div>

      {/* Grid: Testimonial Reviews & Buyer Verification Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left: Review Cards */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {testimonials.length === 0 ? (
            <div className="bg-[#FCFAF5] rounded-2xl border border-[#E8DEC9] p-8 text-center text-[#8C7A5B]">
              <Star className="w-8 h-8 mx-auto text-[#D9C6A3] mb-2" />
              <p className="font-bold text-sm text-[#2B303A]">Belum ada ulasan</p>
              <p className="text-xs text-[#667085] mt-1">
                Jadilah yang pertama memberikan ulasan setelah pesanan selesai!
              </p>
            </div>
          ) : (
            testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E8DEC9] p-3.5 sm:p-5 shadow-2xs hover:border-[#C29841]/50 transition-all space-y-2.5 sm:space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${item.avatarColor} text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0`}
                    >
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-[#2B303A] truncate">
                          @{item.username}
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[9px] sm:text-[10px] font-bold text-[#065F46] shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#10B981]" />
                          Terverifikasi
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#98A2B3] block">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 text-[#C29841] shrink-0">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          i < item.rating
                            ? "fill-[#C29841] text-[#C29841]"
                            : "text-[#D9C6A3]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#4A5568] leading-relaxed italic">
                  &quot;{item.comment}&quot;
                </p>

                {/* Purchase details badge */}
                <div className="pt-1 flex items-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF3E3] border border-[#E8D9B7] text-[11px] sm:text-xs font-bold text-[#8C6D23]">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                    {item.packagePurchased}
                  </span>
                </div>

                {/* Admin Reply Block */}
                {item.adminReply && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8DEC9] text-xs space-y-1">
                    <div className="font-black text-[#A57E2F] flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-[#C29841]" />
                      <span>Balasan Admin:</span>
                    </div>
                    <p className="text-[#4A5568] text-xs leading-relaxed font-medium">
                      {item.adminReply}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right: Form Ulasan Khusus Pembeli */}
        <div className="lg:col-span-5">
          {/* Card View 1: Form Active (Open) */}
          {isOpenForm ? (
            <div className="bg-gradient-to-br from-[#FCFAF5] to-[#F5EEDC] rounded-2xl sm:rounded-3xl border-2 border-[#C29841] p-5 sm:p-7 space-y-4 sm:space-y-5 shadow-md animate-fadeIn">
              {/* Form Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#C29841] text-white flex items-center justify-center shadow-2xs">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2B303A]">
                      Beri Ulasan Pembeli
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-[#667085]">
                      Terverifikasi dengan token pesanan
                    </p>
                  </div>
                </div>
                {!initialToken && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="p-1 rounded-full hover:bg-[#EAE0D0] text-[#8C7A5B] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Form Success State */}
              {isSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border-2 border-[#10B981]/30 flex items-center justify-center mx-auto text-[#059669] shadow-sm animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-black text-[#2B303A]">
                      Terima Kasih Banyak! ✨
                    </h4>
                    <p className="text-xs text-[#667085] leading-relaxed">
                      Ulasan kamu telah berhasil diterbitkan dan tampil di daftar testimoni Zenwol.id!
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] text-white font-extrabold text-xs shadow-md shadow-[#C29841]/20 cursor-pointer active:scale-95"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  {/* Step 1: Token verification */}
                  {!orderData ? (
                    <div className="space-y-2.5 p-3.5 rounded-2xl bg-white border border-[#E0D3BC]">
                      <label className="block text-xs font-black text-[#2B303A]">
                        Masukkan Kode Order / Token Review
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tokenInput}
                          onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                          placeholder="Contoh: ZEN21895427"
                          className="flex-1 bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-2 px-3 text-xs sm:text-sm font-bold text-[#2B303A] uppercase placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841]"
                        />
                        <button
                          type="button"
                          onClick={() => verifyToken(tokenInput)}
                          disabled={isVerifying || !tokenInput.trim()}
                          className="px-3.5 py-2 rounded-xl bg-[#C29841] hover:bg-[#A57E2F] text-white text-xs font-black transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0 active:scale-95"
                        >
                          {isVerifying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <span>Verifikasi</span>
                          )}
                        </button>
                      </div>
                      {verificationError && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#E11D48] pt-0.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{verificationError}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Verified Order Info */
                    <div className="p-3 rounded-2xl bg-white border border-[#E0D3BC] flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black uppercase text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#10B981]" />
                          <span>Terverifikasi (#{orderData.order_code})</span>
                        </div>
                        <div className="font-extrabold text-xs sm:text-sm text-[#2B303A] truncate flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-[#C29841]" />
                          <span>@{orderData.roblox_username}</span>
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
                      {!initialToken && (
                        <button
                          type="button"
                          onClick={() => {
                            setOrderData(null);
                            setTokenInput("");
                          }}
                          className="text-[10px] font-bold text-[#8C7A5B] hover:text-[#C29841] underline cursor-pointer shrink-0"
                        >
                          Ganti
                        </button>
                      )}
                    </div>
                  )}

                  {/* Rating Stars & Comment only shown if order is verified */}
                  {orderData && (
                    <>
                      <div>
                        <label className="block text-xs font-black text-[#2B303A] mb-1">
                          Rating Kepuasan
                        </label>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E0D3BC]">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(null)}
                                onClick={() => setRating(star)}
                                className="p-0.5 rounded hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    star <= (hoverRating ?? rating)
                                      ? "fill-[#F59E0B] text-[#F59E0B]"
                                      : "text-[#D1D5DB]"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-[11px] sm:text-xs font-black text-[#A57E2F]">
                            {getRatingLabel(hoverRating ?? rating)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-[#2B303A] mb-1">
                          Ulasan / Pesan Testimoni <span className="text-[#E11D48]">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Ceritakan pengalaman berbelanja kamu di Zenwol.id..."
                          className="w-full bg-white border border-[#E0D3BC] rounded-xl p-3 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] resize-none"
                          required
                        />
                      </div>

                      {submitError && (
                        <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-bold text-[#E11D48] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-[#C29841]/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mengirim Ulasan...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Kirim Ulasan Sekarang</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          ) : (
            /* Card View 2: Locked View */
            <div className="bg-gradient-to-br from-[#FCFAF5] to-[#F5EEDC] rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#D9C6A3] p-5 sm:p-8 text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#C29841] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF2DE] border border-[#E2D2B0] text-[10px] sm:text-[11px] font-extrabold text-[#8C6D23]">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#10B981]" />
                ULASAN TERVERIFIKASI PEMBELI
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#2B303A]">
                Form Ulasan Khusus Pembeli
              </h3>

              <p className="text-[11px] sm:text-xs md:text-sm text-[#667085] leading-relaxed">
                Untuk menjaga ulasan 100% asli & bebas spam, formulir ini hanya dapat diisi melalui{" "}
                <strong className="text-[#2B303A]">Link Token Review</strong> yang dikirimkan Admin setelah pesanan Robux selesai diproses.
              </p>

              <div className="pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={onOpenCS}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#C29841] text-[#C29841] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi CS / Minta Link Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
