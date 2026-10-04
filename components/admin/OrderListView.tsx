"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RotateCw,
  Search,
  ArrowRight,
  CheckCircle,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";
import { formatRupiah, formatRobux } from "@/data/adminMock";
import { AdminTab } from "./AdminSidebar";

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
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
            Menunggu Bayar
          </span>
        );
      case "diproses":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            Diproses
          </span>
        );
      case "selesai":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
            Selesai
          </span>
        );
      case "dibatalkan":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            {desc}
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCw
            className={`w-4 h-4 text-[#C29841] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E7D8]">
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
          <div className="text-xs font-bold text-[#8C7A5B]">
            Menampilkan {filteredOrders.length} pesanan
          </div>
        </div>

        {/* Order Items List */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-[#8C7A5B]">
            <FileText className="w-12 h-12 mx-auto text-[#D9C6A3] mb-3 stroke-[1.5]" />
            <div className="text-base font-extrabold text-[#2B303A]">
              Tidak ada pesanan ditemukan
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Belum ada pesanan pada status ini atau filter pencarian tidak cocok.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]/40 transition-all group"
              >
                {/* Left Block: ID, Status, Details */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-[#C29841] tracking-tight group-hover:text-[#A57E2F] transition-colors">
                      #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#667085] font-semibold">
                    <span className="font-bold text-[#2B303A]">
                      @{order.username}
                    </span>
                    <span>•</span>
                    <span>
                      {order.date}, {order.time}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded border border-[#10B981]/30 text-[#10B981] bg-[#ECFDF5] text-[10px] font-black uppercase">
                      {order.paymentMethod}
                    </span>
                    <span>
                      {order.hasProof ? (
                        <span className="text-[#10B981] font-bold">
                          (Ada bukti)
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF]">(Tanpa foto)</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Right Block: Amount, Price & Actions */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0E7D8]">
                  {/* Robux & Price */}
                  <div className="flex items-center gap-2.5 md:text-right">
                    <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-[#2B303A]">
                        {formatRobux(order.robuxAmount)}
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#C29841]">
                        {formatRupiah(order.price)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (Matching Image 3: "Proses" & "Detail ->") */}
                  <div className="flex items-center gap-2">
                    {order.status === "menunggu_bayar" && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, "diproses")}
                        className="px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] hover:bg-[#DBEAFE] font-bold text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        Proses
                      </button>
                    )}

                    {order.status === "diproses" && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, "selesai")}
                        className="px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5] font-bold text-xs transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        Selesaikan
                      </button>
                    )}

                    <button
                      onClick={() => onSelectOrder(order)}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
