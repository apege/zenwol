import React, { useState } from "react";
import Image from "next/image";
import { CreditCard, X, QrCode, Upload, CheckCircle2, Copy, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { RobuxPackage } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  selectedPackage: RobuxPackage;
  invoiceId: string;
  whatsappNumber: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  selectedPackage,
  invoiceId,
  whatsappNumber,
}: CheckoutModalProps) {
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isCopiedInvoice, setIsCopiedInvoice] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPayment = () => {
    setIsOrderSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C29841", "#2B303A", "#F8F5EE", "#D4AF37"],
    });
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceId);
    setIsCopiedInvoice(true);
    setTimeout(() => setIsCopiedInvoice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E6D7B9] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="bg-[#FAF5EA] p-5 border-b border-[#E8DEC9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C29841] text-white flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#2B303A] text-base">
                Konfirmasi & Pembayaran
              </h3>
              <p className="text-xs text-[#667085]">Invoice: {invoiceId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E0D3BC] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!isOrderSuccess ? (
            <>
              {/* Order Summary */}
              <div className="bg-[#FCFAF5] rounded-2xl p-4 border border-[#E8DEC9] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Username Roblox:</span>
                  <strong className="font-bold text-[#2B303A]">@{username}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">Paket Robux:</span>
                  <div className="flex items-center gap-1.5 font-bold text-[#2B303A]">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                    <span>{selectedPackage.robux.toLocaleString("id-ID")} Robux</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Metode Bayar:</span>
                  <strong className="font-bold text-[#C29841]">QRIS Instant (Semua Bank/E-Wallet)</strong>
                </div>
                <div className="pt-2 border-t border-[#EDE4D0] flex justify-between text-sm">
                  <span className="font-bold text-[#2B303A]">Total Pembayaran:</span>
                  <span className="font-black text-[#C29841] text-base">
                    Rp {selectedPackage.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* QRIS Code Box */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-[#D9C6A3] p-5 text-center space-y-3">
                <p className="text-xs font-bold text-[#2B303A]">
                  Scan QRIS Menggunakan BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay
                </p>
                {/* Simulated Clean Dynamic QRIS Display */}
                <div className="w-48 h-48 mx-auto bg-white rounded-2xl border border-[#D9C6A3] p-3 shadow-xs flex flex-col items-center justify-center relative">
                  <div className="w-full h-full bg-[#1F242D] rounded-xl flex flex-col items-center justify-center text-white p-2">
                    <QrCode className="w-24 h-24 text-white mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C29841]">
                      ZENWOL.ID QRIS
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#667085]">
                  Nominal: <strong>Rp {selectedPackage.price.toLocaleString("id-ID")}</strong> (Sesuai total)
                </p>
              </div>

              {/* Proof Upload Simulation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2B303A]">
                  Upload Bukti Transfer (Opsional / Otomatis)
                </label>
                <div className="border border-dashed border-[#D9C6A3] bg-[#FCFAF5] rounded-xl p-3 text-center cursor-pointer hover:bg-[#F8F3E6] transition-all">
                  <Upload className="w-4 h-4 mx-auto text-[#C29841] mb-1" />
                  <span className="text-xs text-[#667085]">
                    Klik untuk unggah screenshot bukti bayar
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                Saya Sudah Membayar ✓
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#2B303A]">
                  Pembayaran Berhasil Dikonfirmasi!
                </h3>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  Pesanan {selectedPackage.robux.toLocaleString("id-ID")} Robux untuk akun <strong>@{username}</strong> sedang diproses ke server Roblox secara otomatis (5 - 10 menit).
                </p>
              </div>

              {/* Invoice Box */}
              <div className="bg-[#FCFAF5] rounded-2xl p-3.5 border border-[#E8DEC9] flex items-center justify-between max-w-xs mx-auto text-xs">
                <span className="text-[#667085]">ID Pesanan: <strong>{invoiceId}</strong></span>
                <button
                  onClick={handleCopyInvoice}
                  className="inline-flex items-center gap-1 font-bold text-[#C29841] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {isCopiedInvoice ? "Disalin!" : "Salin"}
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setIsOrderSuccess(false);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#FAF5EA] text-[#2B303A] font-bold text-xs hover:bg-[#F3E9D3] transition-all cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const message = `Halo Admin Zenwol.id! Saya ingin cek status pesanan Invoice: ${invoiceId} untuk username: ${username}`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 py-3 rounded-2xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  Cek Status ke CS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
