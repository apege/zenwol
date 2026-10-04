"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  UserCheck,
  FileEdit,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Save,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatRupiah, formatRobux } from "@/data/adminMock";

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onSaveAdminNote: (orderId: string, note: string) => void;
}

export default function OrderDetailView({
  order,
  onBack,
  onUpdateStatus,
  onSaveAdminNote,
}: OrderDetailViewProps) {
  const [adminNoteInput, setAdminNoteInput] = useState(order.adminNote || "");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveNote = () => {
    onSaveAdminNote(order.id, adminNoteInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "menunggu_bayar":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            <Clock className="w-3.5 h-3.5" />
            Menunggu Pembayaran
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <Clock className="w-3.5 h-3.5" />
            Sedang Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <XCircle className="w-3.5 h-3.5" />
            Dibatalkan
          </span>
        );
    }
  };

  // WhatsApp link preparation
  const cleanPhone = order.whatsappNumber.replace(/[^0-9]/g, "");
  const waMessage = encodeURIComponent(
    `Halo kak @${order.username}, kami dari Admin Zenwol.id ingin mengonfirmasi pesanan Robux #${order.id} sebesar ${formatRobux(
      order.robuxAmount
    )}.`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#667085] hover:text-[#C29841] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Order</span>
      </button>

      {/* Header Info & Status (Matching Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            ORDER #{order.id}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5 font-medium">
            {order.fullDateTime || `${order.date} pukul ${order.time} WIB`}
          </p>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      {/* Quick Status Bar (Matching Image 4: UBAH STATUS CEPAT) */}
      <div className="bg-white border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs font-black text-[#8C7A5B] uppercase tracking-wider">
          Ubah Status Cepat:
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onUpdateStatus(order.id, "diproses")}
            disabled={order.status === "diproses"}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer active:scale-95 ${
              order.status === "diproses"
                ? "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] opacity-60 cursor-default"
                : "bg-white text-[#2563EB] border-[#BFDBFE] hover:bg-[#EFF6FF]"
            }`}
          >
            Proses Pesanan
          </button>

          <button
            onClick={() => onUpdateStatus(order.id, "selesai")}
            disabled={order.status === "selesai"}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer active:scale-95 ${
              order.status === "selesai"
                ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] opacity-60 cursor-default"
                : "bg-white text-[#059669] border-[#A7F3D0] hover:bg-[#ECFDF5]"
            }`}
          >
            Selesaikan Order
          </button>

          <button
            onClick={() => onUpdateStatus(order.id, "dibatalkan")}
            disabled={order.status === "dibatalkan"}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer active:scale-95 ${
              order.status === "dibatalkan"
                ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] opacity-60 cursor-default"
                : "bg-white text-[#DC2626] border-[#FECACA] hover:bg-[#FEF2F2]"
            }`}
          >
            Batalkan
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] hover:bg-[#D1FAE5] text-xs font-extrabold transition-all shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Chat Pelanggan</span>
          </a>
        </div>
      </div>

      {/* Card 1: DETAIL PESANAN (Matching Image 4) */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0E7D8]">
          <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
            <Receipt className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
            Detail Pesanan
          </h2>
        </div>

        {/* Product Table Header */}
        <div className="grid grid-cols-2 text-xs font-black text-[#8C7A5B] uppercase pb-2 border-b border-[#F3EFE6]">
          <span>Produk</span>
          <span className="text-right">Harga</span>
        </div>

        {/* Product Row */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#D9C6A3] flex items-center justify-center shrink-0">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-[#2B303A]">
                {formatRobux(order.robuxAmount)}
              </div>
              <div className="text-xs text-[#667085]">
                Top Up Gamepass / Private Server
              </div>
            </div>
          </div>
          <div className="text-sm sm:text-base font-black text-[#2B303A]">
            {formatRupiah(order.price)}
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center justify-between py-3 border-t border-[#F3EFE6]">
          <span className="text-xs sm:text-sm font-bold text-[#667085]">
            Metode Pembayaran
          </span>
          <span className="px-3 py-1 rounded-full border border-[#10B981]/30 text-[#10B981] bg-[#ECFDF5] text-xs font-black uppercase">
            {order.paymentMethod}
          </span>
        </div>

        {/* Total Pembayaran */}
        <div className="flex items-center justify-between py-4 border-t border-[#E8DEC9] bg-[#FAF7F0] px-4 rounded-2xl">
          <span className="text-xs sm:text-sm font-black text-[#2B303A] uppercase">
            Total Pembayaran
          </span>
          <span className="text-lg sm:text-2xl font-black text-[#C29841]">
            {formatRupiah(order.price)}
          </span>
        </div>

        {/* Proof info */}
        <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8DEC9] text-center">
          <p className="text-xs text-[#8C7A5B]">
            {order.hasProof
              ? "Bukti transfer telah diverifikasi dan valid."
              : "Foto bukti transfer telah dibersihkan oleh sistem retensi atau tidak diunggah."}
          </p>
        </div>
      </div>

      {/* Card 2: INFORMASI PELANGGAN (Matching Image 5) */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0E7D8]">
          <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
            <UserCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
            Informasi Pelanggan
          </h2>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-[#F3EFE6]">
            <span className="text-xs sm:text-sm font-bold text-[#667085]">
              Username
            </span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-[#C29841]">
                @{order.username}
              </span>
              <a
                href={`https://www.roblox.com/search/users?keyword=${order.username}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Buka profil Roblox"
                className="text-[#8C7A5B] hover:text-[#C29841] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* User ID Roblox */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-[#F3EFE6]">
            <span className="text-xs sm:text-sm font-bold text-[#667085]">
              User ID Roblox
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-[#2B303A] font-mono">
                {order.robloxUserId}
              </span>
              <button
                onClick={() => handleCopy(order.robloxUserId, "userId")}
                className="p-1.5 rounded-lg hover:bg-[#F3EFE6] text-[#8C7A5B] hover:text-[#2B303A] transition-colors cursor-pointer"
                title="Salin ID"
              >
                {copiedField === "userId" ? (
                  <Check className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* No. WhatsApp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-[#F3EFE6]">
            <span className="text-xs sm:text-sm font-bold text-[#667085]">
              No. WhatsApp
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs sm:text-sm font-bold">
                <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                {order.whatsappNumber}
              </span>
              <button
                onClick={() => handleCopy(order.whatsappNumber, "wa")}
                className="p-1.5 rounded-lg hover:bg-[#F3EFE6] text-[#8C7A5B] hover:text-[#2B303A] transition-colors cursor-pointer"
                title="Salin No WhatsApp"
              >
                {copiedField === "wa" ? (
                  <Check className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Catatan Pelanggan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2">
            <span className="text-xs sm:text-sm font-bold text-[#667085]">
              Catatan Pelanggan
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#2B303A]">
              {order.customerNote || "Pemesanan via WhatsApp Direct"}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: CATATAN ADMIN (Matching Image 5) */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0E7D8]">
          <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
            <FileEdit className="w-4 h-4" />
          </div>
          <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
            Catatan Admin
          </h2>
        </div>

        <div>
          <textarea
            value={adminNoteInput}
            onChange={(e) => setAdminNoteInput(e.target.value)}
            rows={4}
            placeholder="Tulis catatan untuk order ini (hanya admin)..."
            className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-2xl p-4 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                <Check className="w-4 h-4" /> Catatan berhasil disimpan!
              </span>
            )}
          </div>
          <button
            onClick={handleSaveNote}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C29841]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Catatan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
