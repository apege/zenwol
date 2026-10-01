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
      className="bg-white rounded-3xl border border-[#E6D7B9] p-6 sm:p-8 shadow-xs space-y-6 scroll-mt-24"
    >
      {/* Step Header */}
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-full bg-[#C29841] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
          3
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B303A]">
            Pilih Pembayaran
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Pilih metode pembayaran yang paling nyaman untuk Anda
          </p>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Method 1: Website / QRIS */}
        <div
          onClick={() => onSelectPaymentMethod("website")}
          className={`rounded-2xl p-5 cursor-pointer border transition-all relative ${
            paymentMethod === "website"
              ? "bg-[#FBF6EB] border-[#C29841] ring-2 ring-[#C29841]/30 shadow-sm"
              : "bg-[#FCFAF5] border-[#E8DEC9] hover:border-[#C29841]/60"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5EAD4] border border-[#E0CFAB] flex items-center justify-center text-[#C29841]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#2B303A]">
                  Pembayaran via Website
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-[#C29841]">
                  <QrCode className="w-3.5 h-3.5" />
                  Scan QRIS & Upload Bukti
                </div>
              </div>
            </div>

            {/* Radio check */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                paymentMethod === "website"
                  ? "bg-[#C29841] text-white"
                  : "border border-[#D9C6A3] bg-white"
              }`}
            >
              {paymentMethod === "website" && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          <p className="text-xs text-[#667085] mt-3 leading-relaxed">
            Scan barcode QRIS (BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay) lalu upload bukti transfer langsung di website.
          </p>

          {/* Tag Row */}
          <div className="mt-4 pt-3 border-t border-[#EDE4D0] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C29841]">
              <Zap className="w-3 h-3 fill-[#C29841]" />
              Verifikasi Otomatis
            </span>
            <span className="text-xs font-extrabold text-[#C29841]">
              {paymentMethod === "website" ? "Dipilih" : "Pilih"}
            </span>
          </div>
        </div>

        {/* Method 2: WhatsApp Direct */}
        <div
          onClick={() => onSelectPaymentMethod("whatsapp")}
          className={`rounded-2xl p-5 cursor-pointer border transition-all relative ${
            paymentMethod === "whatsapp"
              ? "bg-[#FBF6EB] border-[#C29841] ring-2 ring-[#C29841]/30 shadow-sm"
              : "bg-[#FCFAF5] border-[#E8DEC9] hover:border-[#C29841]/60"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F8F0] border border-[#BDEBD6] flex items-center justify-center text-[#10B981]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#2B303A]">
                  Pembayaran via WhatsApp
                </h3>
                <div className="flex items-center gap-1 text-xs font-bold text-[#10B981]">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat Langsung dengan Admin
                </div>
              </div>
            </div>

            {/* Radio check */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                paymentMethod === "whatsapp"
                  ? "bg-[#C29841] text-white"
                  : "border border-[#D9C6A3] bg-white"
              }`}
            >
              {paymentMethod === "whatsapp" && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          <p className="text-xs text-[#667085] mt-3 leading-relaxed">
            Pesan langsung melalui WhatsApp resmi Zenwol.id dengan format pesanan instan, dibantu langsung oleh admin sampai selesai.
          </p>

          {/* Tag Row */}
          <div className="mt-4 pt-3 border-t border-[#EDE4D0] flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#10B981]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fast Respon 24 Jam
            </span>
            <span className="text-xs font-extrabold text-[#C29841]">
              {paymentMethod === "whatsapp" ? "Dipilih" : "Pilih"}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
