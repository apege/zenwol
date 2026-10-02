import React from "react";
import { CreditCard, QrCode, MessageCircle, ShieldCheck, Zap, Check } from "lucide-react";

interface StepPaymentProps {
  paymentMethod: "website" | "whatsapp";
  onSelectPaymentMethod: (method: "website" | "whatsapp") => void;
}

export default function StepPayment({
  paymentMethod,
  onSelectPaymentMethod,
}: StepPaymentProps) {
  return (
    <section
      id="step-payment"
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-4 sm:p-8 shadow-xs space-y-4 sm:space-y-6 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Step Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C29841] text-white font-extrabold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          3
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-[#2B303A] leading-tight">
            Pilih Pembayaran
          </h2>
          <p className="text-[11px] sm:text-sm text-[#667085] mt-0.5">
            Pilih metode pembayaran yang paling nyaman untuk Anda
          </p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Method 1: Website / QRIS */}
        <div
          onClick={() => onSelectPaymentMethod("website")}
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all relative ${
            paymentMethod === "website"
              ? "bg-[#FBF6EB] border-[#C29841] ring-2 ring-[#C29841]/30 shadow-xs"
              : "bg-[#FCFAF5] border-[#E8DEC9] hover:border-[#C29841]/60 active:scale-99"
          }`}
        >
          <div className="flex items-start justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F5EAD4] border border-[#E0CFAB] flex items-center justify-center text-[#C29841] shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#2B303A] leading-tight">
                  Pembayaran via Website
                </h3>
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#C29841] mt-0.5">
                  <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Scan QRIS & Upload Bukti
                </div>
              </div>
            </div>

            {/* Radio check */}
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                paymentMethod === "website"
                  ? "bg-[#C29841] text-white"
                  : "border border-[#D9C6A3] bg-white"
              }`}
            >
              {paymentMethod === "website" && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-[#667085] mt-2.5 sm:mt-3 leading-relaxed">
            Scan barcode QRIS (BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay) lalu upload bukti transfer langsung di website.
          </p>

          {/* Tag Row */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#EDE4D0] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#C29841]">
              <Zap className="w-3 h-3 fill-[#C29841]" />
              Verifikasi Otomatis
            </span>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C29841]">
              {paymentMethod === "website" ? "Dipilih" : "Pilih"}
            </span>
          </div>
        </div>

        {/* Method 2: WhatsApp Direct */}
        <div
          onClick={() => onSelectPaymentMethod("whatsapp")}
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all relative ${
            paymentMethod === "whatsapp"
              ? "bg-[#FBF6EB] border-[#C29841] ring-2 ring-[#C29841]/30 shadow-xs"
              : "bg-[#FCFAF5] border-[#E8DEC9] hover:border-[#C29841]/60 active:scale-99"
          }`}
        >
          <div className="flex items-start justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E6F8F0] border border-[#BDEBD6] flex items-center justify-center text-[#10B981] shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#2B303A] leading-tight">
                  Pembayaran via WhatsApp
                </h3>
                <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#10B981] mt-0.5">
                  <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Chat Langsung dengan Admin
                </div>
              </div>
            </div>

            {/* Radio check */}
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                paymentMethod === "whatsapp"
                  ? "bg-[#C29841] text-white"
                  : "border border-[#D9C6A3] bg-white"
              }`}
            >
              {paymentMethod === "whatsapp" && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-[#667085] mt-2.5 sm:mt-3 leading-relaxed">
            Pesan langsung melalui WhatsApp resmi Zenwol.id dengan format pesanan instan, dibantu langsung oleh admin sampai selesai.
          </p>

          {/* Tag Row */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#EDE4D0] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#10B981]">
              <ShieldCheck className="w-3 h-3" />
              Fast Respon 24 Jam
            </span>
            <span className="text-[11px] sm:text-xs font-extrabold text-[#C29841]">
              {paymentMethod === "whatsapp" ? "Dipilih" : "Pilih"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
