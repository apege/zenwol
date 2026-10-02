import React from "react";
import Image from "next/image";
import { Star, ShieldCheck, Lock, MessageCircle } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  onOpenCS: () => void;
}

export default function TestimonialSection({
  testimonials,
  onOpenCS,
}: TestimonialSectionProps) {
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left: Review Cards */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {testimonials.map((item) => (
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
              <div className="pt-1.5 flex items-center">
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
            </div>
          ))}
        </div>

        {/* Right: Form Ulasan Khusus Pembeli */}
        <div className="lg:col-span-5">
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
                onClick={onOpenCS}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-[#FAF7F0] border border-[#C29841] text-[#C29841] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi CS / Minta Link Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
