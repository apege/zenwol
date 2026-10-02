import React, { useState } from "react";
import Image from "next/image";
import { CreditCard, X, QrCode, Upload, CheckCircle2, Copy, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { RobuxPackage, CartItem } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  selectedPackage: RobuxPackage;
  cartItems: CartItem[];
  invoiceId: string;
  whatsappNumber: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  selectedPackage,
  cartItems,
  invoiceId,
  whatsappNumber,
}: CheckoutModalProps) {
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isCopiedInvoice, setIsCopiedInvoice] = useState(false);

  if (!isOpen) return null;

  const hasCart = cartItems.length > 0;
  const totalRobux = hasCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.robux * item.quantity, 0)
    : selectedPackage.robux;
  const totalPrice = hasCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.price * item.quantity, 0)
    : selectedPackage.price;

  const handleConfirmPayment = () => {
    setIsOrderSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#FAF5EA] p-4 sm:p-5 border-b border-[#E8DEC9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C29841] text-white flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#2B303A] text-sm sm:text-base leading-tight">
                Konfirmasi & Pembayaran
              </h3>
              <p className="text-[11px] sm:text-xs text-[#667085]">Invoice: {invoiceId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#E0D3BC] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {!isOrderSuccess ? (
            <>
              {/* Order Summary */}
              <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[#E8DEC9] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Username Roblox:</span>
                  <strong className="font-bold text-[#2B303A]">@{username}</strong>
                </div>

                {hasCart ? (
                  <div className="space-y-1.5 pt-1 border-t border-[#EDE4D0]">
                    <span className="text-[#667085] block font-semibold">Rincian Paket di Keranjang:</span>
                    {cartItems.map((item) => (
                      <div key={item.pkg.id} className="flex justify-between items-center pl-2">
                        <div className="flex items-center gap-1.5 font-bold text-[#2B303A]">
                          <Image
                            src="/robux.webp"
                            alt="Robux"
                            width={12}
                            height={12}
                            className="object-contain"
                          />
                          <span>{item.pkg.robux.toLocaleString("id-ID")} Robux x {item.quantity}</span>
                        </div>
                        <span className="font-bold text-[#8C7A58]">
                          Rp {(item.pkg.price * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}

                <div className="flex justify-between pt-1">
                  <span className="text-[#667085]">Metode:</span>
                  <strong className="font-bold text-[#C29841]">QRIS Instant (Semua Bank/E-Wallet)</strong>
                </div>

                <div className="pt-2 border-t border-[#EDE4D0] flex justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[#2B303A]">Total Pembayaran:</span>
                  <span className="font-black text-[#C29841] text-sm sm:text-base">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* QRIS Code Box */}
              <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#D9C6A3] p-4 sm:p-5 text-center space-y-2.5 sm:space-y-3">
                <p className="text-[11px] sm:text-xs font-bold text-[#2B303A]">
                  Scan QRIS Menggunakan BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay
                </p>
                {/* Clean Dynamic QRIS Display */}
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-white rounded-xl sm:rounded-2xl border border-[#D9C6A3] p-2.5 sm:p-3 shadow-2xs flex flex-col items-center justify-center relative">
                  <div className="w-full h-full bg-[#1F242D] rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-white p-2">
                    <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-white mb-1" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#C29841]">
                      ZENWOL.ID QRIS
                    </span>
                  </div>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#667085]">
                  Nominal: <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong> (Sesuai total)
                </p>
              </div>

              {/* Proof Upload Simulation */}
              <div className="space-y-1">
                <label className="text-[11px] sm:text-xs font-bold text-[#2B303A]">
                  Upload Bukti Transfer (Opsional / Otomatis)
                </label>
                <div className="border border-dashed border-[#D9C6A3] bg-[#FCFAF5] rounded-xl p-2.5 sm:p-3 text-center cursor-pointer hover:bg-[#F8F3E6] transition-all">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto text-[#C29841] mb-1" />
                  <span className="text-[11px] sm:text-xs text-[#667085]">
                    Klik untuk unggah screenshot bukti bayar
                  </span>
                </div>
              </div>

              {/* Confirm CTA */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
              >
                Saya Sudah Membayar ✓
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 sm:py-6 space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-[#2B303A]">
                  Pembayaran Berhasil Dikonfirmasi!
                </h3>
                <p className="text-[11px] sm:text-xs text-[#667085] max-w-sm mx-auto leading-relaxed">
                  Pesanan {totalRobux.toLocaleString("id-ID")} Robux untuk akun <strong>@{username}</strong> sedang diproses ke server Roblox secara otomatis (5 - 10 menit).
                </p>
              </div>

              {/* Invoice Box */}
              <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-[#E8DEC9] flex items-center justify-between max-w-xs mx-auto text-xs">
                <span className="text-[#667085]">ID: <strong>{invoiceId}</strong></span>
                <button
                  onClick={handleCopyInvoice}
                  className="inline-flex items-center gap-1 font-bold text-[#C29841] hover:underline cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {isCopiedInvoice ? "Disalin!" : "Salin"}
                </button>
              </div>

              <div className="pt-2 flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    onClose();
                    setIsOrderSuccess(false);
                  }}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#FAF5EA] text-[#2B303A] font-bold text-xs hover:bg-[#F3E9D3] transition-all cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const message = `Halo Admin Zenwol.id! Saya ingin cek status pesanan Invoice: ${invoiceId} untuk username: ${username}`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Cek ke CS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
