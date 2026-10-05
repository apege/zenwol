"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  CreditCard,
  X,
  QrCode,
  Upload,
  CheckCircle2,
  Copy,
  MessageCircle,
  Phone,
  Trash2,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RobuxPackage, CartItem } from "@/types";
import { compressImageToWebP, formatFileSize } from "@/lib/imageCompressor";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  robloxUserId?: string | number | null;
  selectedPackage: RobuxPackage;
  cartItems: CartItem[];
  invoiceId: string;
  whatsappNumber: string;
  qrisImage?: string | null;
  paymentMethod?: "website" | "whatsapp";
}

export default function CheckoutModal({
  isOpen,
  onClose,
  username,
  robloxUserId,
  selectedPackage,
  cartItems,
  invoiceId,
  whatsappNumber,
  qrisImage,
  paymentMethod = "website",
}: CheckoutModalProps) {
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [, setProofStats] = useState<{ sizeStr: string; originalSizeStr: string } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isCopiedInvoice, setIsCopiedInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isWA = paymentMethod === "whatsapp";
  const hasCart = cartItems.length > 0;
  const totalRobux = hasCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.robux * item.quantity, 0)
    : selectedPackage.robux;
  const totalPrice = hasCart
    ? cartItems.reduce((acc, item) => acc + item.pkg.price * item.quantity, 0)
    : selectedPackage.price;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file berupa gambar / screenshot.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await compressImageToWebP(file, {
        maxWidth: 900,
        maxHeight: 1200,
        quality: 0.75,
      });

      setPaymentProof(compressed.dataUrl);
      setProofStats({
        sizeStr: formatFileSize(compressed.sizeBytes),
        originalSizeStr: formatFileSize(compressed.originalSizeBytes),
      });
    } catch (err) {
      console.error("Gagal kompres gambar:", err);
      alert("Gagal memproses gambar. Silakan coba pilih foto lain.");
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveProof = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPaymentProof(null);
    setProofStats(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleConfirmPayment = async () => {
    const rawPhone = customerPhone.trim();
    const digitsOnly = rawPhone.replace(/\D/g, "");

    if (!rawPhone || digitsOnly.length < 8) {
      setPhoneError("Nomor WhatsApp wajib diisi dengan benar agar admin bisa menghubungi Anda!");
      return;
    }

    setPhoneError(null);
    setIsSubmitting(true);

    const formattedPhone = rawPhone.startsWith("0")
      ? "62" + rawPhone.slice(1)
      : rawPhone.startsWith("+")
      ? rawPhone.slice(1)
      : rawPhone.startsWith("62")
      ? rawPhone
      : "62" + rawPhone;

    const summaryList = hasCart
      ? cartItems
          .map(
            (it) =>
              `- ${it.pkg.robux.toLocaleString("id-ID")} Robux x ${it.quantity} (Rp ${(
                it.pkg.price * it.quantity
              ).toLocaleString("id-ID")})`
          )
          .join("\n")
      : `- ${selectedPackage.robux.toLocaleString("id-ID")} Robux (Rp ${selectedPackage.price.toLocaleString("id-ID")})`;

    const cleanUsername = (username || "").replace(/^@/, "").trim();
    const finalRobux = Number(totalRobux) || 0;
    const finalPrice = Number(totalPrice) || 0;

    const waMessage = isWA
      ? `Halo Admin Zenwol.id! 👋\n\nSaya ingin melakukan Top Up Robux dengan rincian:\n- *Invoice*: ${invoiceId}\n- *Username Roblox*: @${cleanUsername}\n- *Nomor WA Pembeli*: ${formattedPhone}\n- *Rincian Paket*:\n${summaryList}\n- *Total Robux*: ${finalRobux.toLocaleString("id-ID")} Robux\n- *Total Harga*: Rp ${finalPrice.toLocaleString("id-ID")}\n- *Metode*: Pembayaran via WhatsApp\n\nMohon bantuannya untuk proses pembayarannya ya min. Terima kasih!`
      : `Halo Admin Zenwol.id! 👋\n\nSaya sudah melakukan pembayaran via QRIS dengan rincian:\n- *Invoice*: ${invoiceId}\n- *Username Roblox*: @${cleanUsername}\n- *Nomor WA Pembeli*: ${formattedPhone}\n- *Rincian Paket*:\n${summaryList}\n- *Total Robux*: ${finalRobux.toLocaleString("id-ID")} Robux\n- *Total Bayar*: Rp ${finalPrice.toLocaleString("id-ID")}\n- *Bukti Bayar*: ${
          paymentProof ? "Sudah Diupload di Website" : "Terlampir"
        }\n\nMohon bantuannya untuk proses pengiriman Robux ya min. Terima kasih!`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_code: invoiceId,
          roblox_username: cleanUsername,
          roblox_user_id: robloxUserId ? String(robloxUserId) : null,
          customer_phone: formattedPhone,
          robux: finalRobux,
          price: finalPrice,
          payment_method: isWA ? "whatsapp" : "qris",
          payment_status: isWA ? "pending" : "paid",
          payment_proof_path: !isWA ? paymentProof || null : null,
          order_status: "pending",
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Gagal menyimpan pesanan ke database.");
      }

      setIsSubmitting(false);
      setIsOrderSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C29841", "#2B303A", "#F8F5EE", "#10B981"],
      });
      // Open WhatsApp automatically
      window.open(waUrl, "_blank");
    } catch (e: unknown) {
      console.error("Order creation error:", e);
      setIsSubmitting(false);
      const errMsg = e instanceof Error ? e.message : "Terjadi kesalahan saat memproses pesanan.";
      alert(`Gagal membuat pesanan: ${errMsg}`);
    }
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
            <div className={`w-8 h-8 rounded-xl ${isWA ? "bg-[#10B981]" : "bg-[#C29841]"} text-white flex items-center justify-center shrink-0`}>
              {isWA ? <MessageCircle className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-[#2B303A] text-sm sm:text-base leading-tight">
                {isWA ? "Pemesanan via WhatsApp" : "Konfirmasi & Pembayaran"}
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
              {/* WhatsApp Method Info Banner */}
              {isWA && (
                <div className="bg-[#ECFDF5] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[#A7F3D0] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-[#065F46]">
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>Pembayaran & Bantuan Admin via WhatsApp</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#065F46]/80 leading-relaxed font-medium">
                    Masukkan nomor WhatsApp Anda di bawah. Pesanan akan otomatis dicatat ke sistem dan Admin Zenwol akan segera memproses transaksi Anda.
                  </p>
                </div>
              )}

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
                  <strong className={`font-bold ${isWA ? "text-[#059669]" : "text-[#C29841]"}`}>
                    {isWA ? "Pembayaran via WhatsApp (Chat CS)" : "QRIS Instant (Semua Bank/E-Wallet)"}
                  </strong>
                </div>

                <div className="pt-2 border-t border-[#EDE4D0] flex justify-between text-xs sm:text-sm">
                  <span className="font-bold text-[#2B303A]">Total Pembayaran:</span>
                  <span className="font-black text-[#C29841] text-sm sm:text-base">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Input Nomor WhatsApp Pembeli (Wajib) */}
              <div className="bg-[#FAF7F0] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-[#E0D3BC] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#2B303A] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C29841]" />
                    Nomor WhatsApp Pembeli <span className="text-[#E11D48]">*</span>
                  </label>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#E11D48] border border-[#FECACA]">
                    Wajib Diisi
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-black text-[#8C7A58] border-r border-[#E0D3BC] pr-2 pointer-events-none">
                    <span>+62</span>
                  </div>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    placeholder="81234567890 / 081234567890"
                    className={`w-full bg-white border rounded-xl py-2.5 pl-15 pr-3 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
                      phoneError
                        ? "border-[#E11D48] focus:ring-[#E11D48]/20 bg-[#FEF2F2]"
                        : "border-[#E0D3BC] focus:ring-[#C29841]/30 focus:border-[#C29841]"
                    }`}
                    required
                  />
                </div>
                {phoneError ? (
                  <p className="text-[11px] font-bold text-[#E11D48] flex items-center gap-1">
                    <span>⚠</span> {phoneError}
                  </p>
                ) : (
                  <p className="text-[10px] sm:text-[11px] text-[#667085]">
                    Nomor WhatsApp aktif digunakan admin untuk konfirmasi & mengirim bukti proses Robux.
                  </p>
                )}
              </div>

              {/* QRIS Code Box (Website QRIS Only) */}
              {!isWA && (
                <>
                  <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-[#D9C6A3] p-4 sm:p-5 text-center space-y-2.5 sm:space-y-3">
                    <p className="text-[11px] sm:text-xs font-bold text-[#2B303A]">
                      Scan QRIS Menggunakan BCA, Mandiri, BRI, DANA, GoPay, OVO, ShopeePay
                    </p>
                    <div className="w-44 h-44 sm:w-56 sm:h-56 mx-auto bg-white rounded-xl sm:rounded-2xl border border-[#D9C6A3] p-2.5 sm:p-3 shadow-2xs flex flex-col items-center justify-center relative">
                      {qrisImage && qrisImage !== "/logo.jpg" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={qrisImage}
                          alt="QRIS Zenwol.id"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1F242D] rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-white p-2">
                          <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-white mb-1" />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#C29841]">
                            ZENWOL.ID QRIS
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-[#667085]">
                      Nominal: <strong>Rp {totalPrice.toLocaleString("id-ID")}</strong> (Sesuai total)
                    </p>
                  </div>

                  {/* Upload Bukti Transfer */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] sm:text-xs font-black text-[#2B303A] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#C29841]" />
                        Upload Bukti Transfer <span className="text-[#8C7A58] font-normal">(Opsional)</span>
                      </label>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!paymentProof ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#D9C6A3] hover:border-[#C29841] bg-[#FCFAF5] hover:bg-[#F8F3E6] rounded-2xl p-4 text-center cursor-pointer transition-all group"
                      >
                        {isCompressing ? (
                          <div className="flex flex-col items-center justify-center py-2 space-y-2">
                            <Loader2 className="w-6 h-6 text-[#C29841] animate-spin" />
                            <p className="text-xs font-bold text-[#A57E2F]">
                              Memproses gambar...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#E0D3BC] flex items-center justify-center mx-auto text-[#C29841] group-hover:scale-110 transition-transform shadow-2xs">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div className="text-xs font-bold text-[#2B303A]">
                              Klik untuk unggah screenshot bukti transfer
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-[#667085]">
                              Format JPG, JPEG, atau PNG
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative rounded-2xl border border-[#E0D3BC] bg-[#FAF7F0] p-3 flex items-center gap-3">
                        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-white border border-[#E8DEC9] shrink-0 shadow-2xs">
                          <img
                            src={paymentProof}
                            alt="Bukti Transfer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-[#2B303A] truncate">
                              Bukti Bayar Terlampir
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                              Siap
                            </span>
                          </div>

                          <p className="text-[10px] sm:text-[11px] text-[#059669] font-medium">
                            Foto berhasil dipilih dan siap dikirim bersama pesanan.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveProof}
                          className="p-2 rounded-xl bg-white hover:bg-[#FEF2F2] border border-[#E0D3BC] hover:border-[#FECACA] text-[#667085] hover:text-[#E11D48] transition-all cursor-pointer shadow-2xs shrink-0"
                          title="Hapus / Ganti Foto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Confirm CTA */}
              {isWA ? (
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-black text-xs sm:text-sm shadow-md shadow-[#10B981]/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isSubmitting ? "Menyimpan Pesanan..." : "Lanjut ke WhatsApp & Buat Order"}</span>
                </button>
              ) : (
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? "Memproses Pesanan..." : "Saya Sudah Membayar ✓"}
                </button>
              )}
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 sm:py-6 space-y-3 sm:space-y-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-[#2B303A]">
                  {isWA ? "Pesanan Berhasil Dicatat!" : "Pembayaran Berhasil Dikonfirmasi!"}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#667085] max-w-sm mx-auto leading-relaxed">
                  Pesanan <strong>{totalRobux.toLocaleString("id-ID")} Robux</strong> untuk akun <strong>@{username}</strong> dengan no. WA <strong>+{customerPhone.replace(/^0/, "62")}</strong> telah berhasil tersimpan ke sistem Zenwol.id.
                </p>
              </div>

              {/* Invoice Box */}
              <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-[#E8DEC9] flex items-center justify-between max-w-xs mx-auto text-xs">
                <span className="text-[#667085]">ID Invoice: <strong>{invoiceId}</strong></span>
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
                    setCustomerPhone("");
                    setPhoneError(null);
                  }}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#FAF5EA] text-[#2B303A] font-bold text-xs hover:bg-[#F3E9D3] transition-all cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const message = isWA
                      ? `Halo Admin Zenwol.id! 👋 Saya ingin konfirmasi pesanan via WA:\n- Invoice: ${invoiceId}\n- Username: @${username}\n- No WA Pembeli: ${customerPhone}\n\nMohon bantuannya untuk prosesnya ya min. Terima kasih!`
                      : `Halo Admin Zenwol.id! Saya sudah melakukan pembayaran untuk:\n- Invoice: ${invoiceId}\n- Username: ${username}\n- No WA Pembeli: ${customerPhone}\n\nMohon bantuannya untuk cek proses pesanan saya ya min. Terima kasih!`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Chat ke WhatsApp</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
