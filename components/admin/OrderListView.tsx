"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RotateCw,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatRupiah, formatRobux } from "@/lib/formatters";
import { AdminTab } from "./AdminSidebar";
import ProofStorageManager from "./ProofStorageManager";

interface OrderListViewProps {
  currentTab: AdminTab;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function OrderListView({
  currentTab,
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onRefresh,
  isRefreshing = false,
}: OrderListViewProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);

  const getReviewUrl = (orderId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://zenwol.id";
    return `${origin}/?review=${orderId}`;
  };

  const handleSendReviewWA = (order: Order) => {
    const link = getReviewUrl(order.id);
    const cleanPhone = order.whatsappNumber ? order.whatsappNumber.replace(/[^0-9]/g, "") : "";
    const msg = encodeURIComponent(
      `Halo kak @${order.username}! Pesanan Robux #${order.id} sebesar ${formatRobux(
        order.robuxAmount
      )} sudah selesai kami proses yaa kak. ✨\n\nBoleh minta tolong luangkan waktu sebentar untuk memberikan ulasan / rating kepuasan belanja kamu melalui link berikut:\n${link}\n\nTerima kasih banyak sudah berbelanja di Zenwol.id! 🙏`
    );
    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
    } else {
      navigator.clipboard.writeText(link);
      setCopiedReviewId(order.id);
      setTimeout(() => setCopiedReviewId(null), 2000);
    }
  };

  const handleCopyReviewLink = (orderId: string) => {
    const link = getReviewUrl(orderId);
    navigator.clipboard.writeText(link);
    setCopiedReviewId(orderId);
    setTimeout(() => setCopiedReviewId(null), 2000);
  };

  const getTitleAndDesc = () => {
    switch (currentTab) {
      case "order_masuk":
        return {
          title: "Order Masuk",
          desc: "Kelola dan proses seluruh pesanan Robux baru yang masuk ke Zenwol",
        };
      case "order_diproses":
        return {
          title: "Order Diproses",
          desc: "Daftar transaksi yang sedang dalam antrean pengiriman atau gamepass",
        };
      case "order_selesai":
        return {
          title: "Order Selesai",
          desc: "Riwayat seluruh pesanan yang berhasil diselesaikan dengan sukses",
        };
      case "order_dibatalkan":
        return {
          title: "Order Dibatalkan",
          desc: "Daftar pesanan yang dibatalkan oleh pelanggan atau admin",
        };
      default:
        return {
          title: "Semua Pesanan",
          desc: "Kelola dan pantau seluruh transaksi pelanggan",
        };
    }
  };

  const { title, desc } = getTitleAndDesc();

  // Filter orders by tab
  const tabFilteredOrders = orders.filter((order) => {
    if (currentTab === "order_masuk") return order.status === "menunggu_bayar";
    if (currentTab === "order_diproses") return order.status === "diproses";
    if (currentTab === "order_selesai") return order.status === "selesai";
    if (currentTab === "order_dibatalkan") return order.status === "dibatalkan";
    return true;
  });

  // Filter by local search
  const filteredOrders = tabFilteredOrders.filter((o) => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.username.toLowerCase().includes(q) ||
      o.robloxUserId.includes(q) ||
      o.paymentMethod.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "menunggu_bayar":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            Menunggu Bayar
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            Selesai
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5 sm:mt-1 font-medium">
            {desc}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50 active:scale-95"
        >
          <RotateCw
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C29841] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>
 
       {/* Storage & 60-Day Backup Warning Manager */}
       <ProofStorageManager />
 
       {/* Main Container */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-3.5 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#F0E7D8]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter order atau username..."
              className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-[#8C7A5B]">
            Menampilkan <span className="font-extrabold text-[#2B303A]">{filteredOrders.length}</span> pesanan
          </div>
        </div>

        {/* Order Items List */}
        {filteredOrders.length === 0 ? (
          <div className="py-12 sm:py-16 text-center text-[#8C7A5B]">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[#D9C6A3] mb-3 stroke-[1.5]" />
            <div className="text-sm sm:text-base font-extrabold text-[#2B303A]">
              Tidak ada pesanan ditemukan
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Belum ada pesanan pada status ini atau filter pencarian tidak cocok.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-3.5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl border border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]/40 transition-all group"
              >
                {/* Left Block: ID, Status, Details */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm sm:text-lg font-black text-[#C29841] tracking-tight group-hover:text-[#A57E2F] transition-colors">
                      #{order.id}
                    </span>
                    <div className="shrink-0">{getStatusBadge(order.status)}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#667085] font-medium">
                    <span className="font-extrabold text-[#2B303A]">
                      @{order.username}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap">
                      {order.date}, {order.time}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#10B981]/30 text-[#059669] bg-[#ECFDF5] text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                      {order.paymentMethod}
                    </span>
                    {order.hasProof ? (
                      <span className="text-[11px] font-bold text-[#10B981] whitespace-nowrap">
                        (Ada bukti)
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">
                        (Tanpa foto)
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Block: Amount, Price & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F0E7D8]">
                  {/* Robux & Price */}
                  <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={20}
                        height={20}
                        className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                      />
                    </div>
                    <div className="leading-tight shrink-0">
                      <div className="text-xs sm:text-sm font-black text-[#2B303A] whitespace-nowrap">
                        {formatRobux(order.robuxAmount)}
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#C29841] whitespace-nowrap">
                        {formatRupiah(order.price)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {order.status === "menunggu_bayar" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateOrderStatus(order.id, "diproses");
                        }}
                        className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-[#DBEAFE] font-bold text-xs whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        Proses
                      </button>
                    )}

                    {order.status === "diproses" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateOrderStatus(order.id, "selesai");
                        }}
                        className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5] font-bold text-xs whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        Selesaikan
                      </button>
                    )}

                    {order.status === "selesai" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendReviewWA(order);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5] font-bold text-xs whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95"
                          title="Kirim link review testimoni via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Kirim Review</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyReviewLink(order.id);
                          }}
                          className={`p-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                            copiedReviewId === order.id
                              ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]"
                              : "bg-white border-[#E0D3BC] text-[#8C7A5B] hover:text-[#2B303A] hover:bg-[#FAF7F0]"
                          }`}
                          title="Salin Link Token Review"
                        >
                          {copiedReviewId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => onSelectOrder(order)}
                      className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs whitespace-nowrap shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
