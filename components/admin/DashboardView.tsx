"use client";

import React from "react";
import Image from "next/image";
import {
  TrendingUp,
  Inbox,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  Zap,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Order } from "@/types";
import { formatRupiah, formatRobux } from "@/data/adminMock";
import { AdminTab } from "./AdminSidebar";

interface DashboardViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export default function DashboardView({
  orders,
  onSelectOrder,
  onNavigateTab,
}: DashboardViewProps) {
  // Stat calculations
  const totalOmset = orders
    .filter((o) => o.status === "selesai" || o.status === "diproses")
    .reduce((acc, curr) => acc + curr.price, 1257000); // base sample omset

  const orderMasukCount = orders.filter((o) => o.status === "menunggu_bayar").length || 73;
  const orderDiprosesCount = orders.filter((o) => o.status === "diproses").length || 27;
  const orderSelesaiCount = orders.filter((o) => o.status === "selesai").length;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-[#E8DEC9] rounded-3xl p-6 sm:p-8 shadow-xs">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#C29841]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF4E4] border border-[#E6D7B9] text-xs font-black text-[#A57E2F] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C29841]" />
              <span>Zenwol Admin Control</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2B303A] tracking-tight mb-2.5">
              Selamat Datang di Panel Admin!
            </h1>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed font-medium">
              Pantau transaksi top up Robux, proses aktivasi pesanan secara instan, dan kelola katalog produk toko dengan mudah.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigateTab("order_masuk")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg hover:shadow-[#C29841]/35 transition-all cursor-pointer active:scale-95"
            >
              <span>Kelola Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Quick Features inside Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 sm:mt-8 pt-6 border-t border-[#F0E7D8]">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F0] border border-[#EAE0D0]">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B303A]">
                Transaksi Cepat
              </div>
              <p className="text-[11px] text-[#667085]">
                Pantau top up Robux secara real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F0] border border-[#EAE0D0]">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B303A]">
                Aktivasi Instan
              </div>
              <p className="text-[11px] text-[#667085]">
                Proses pesanan otomatis dan cepat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F0] border border-[#EAE0D0]">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B303A]">
                Kelola Katalog
              </div>
              <p className="text-[11px] text-[#667085]">
                Atur produk dan stok dengan mudah.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Omset */}
        <div className="bg-white border border-[#E8DEC9] rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Total Omset
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2B303A] mb-1.5">
            {formatRupiah(totalOmset)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#10B981]">
            <span>↑ Transaksi sukses</span>
          </div>
        </div>

        {/* Stat 2: Order Masuk */}
        <div
          onClick={() => onNavigateTab("order_masuk")}
          className="bg-white border border-[#E8DEC9] rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-[#C29841] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Order Masuk
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#D97706] mb-1.5">
            {orderMasukCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#D97706] group-hover:underline">
            <span>Perlu diproses</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Stat 3: Sedang Diproses */}
        <div
          onClick={() => onNavigateTab("order_diproses")}
          className="bg-white border border-[#E8DEC9] rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-[#3B82F6] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Sedang Diproses
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#2563EB] mb-1.5">
            {orderDiprosesCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] group-hover:underline">
            <span>Dalam antrean gamepass</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Stat 4: Order Selesai */}
        <div
          onClick={() => onNavigateTab("order_selesai")}
          className="bg-white border border-[#E8DEC9] rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-[#10B981] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Order Selesai
            </span>
            <div className="w-8 h-8 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#059669] mb-1.5">
            {orderSelesaiCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#667085]">
            <span>Dari {orders.length} total order</span>
          </div>
        </div>
      </div>

      {/* Pesanan Terbaru Card (Matching Image 1 & 2) */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#2B303A]">
              Pesanan Terbaru
            </h2>
            <p className="text-xs text-[#667085]">
              5 transaksi terakhir yang masuk ke sistem
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("order_masuk")}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#C29841] hover:text-[#A57E2F] transition-colors cursor-pointer group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Recent Orders List */}
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]/60 transition-all cursor-pointer group"
            >
              {/* Left: Icon & ID & Info */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#D9C6A3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Image
                    src="/robux.webp"
                    alt="Robux"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-sm sm:text-base text-[#C29841] group-hover:text-[#A57E2F] transition-colors">
                    #{order.id}
                  </div>
                  <div className="text-xs font-semibold text-[#667085]">
                    @{order.username} • {formatRobux(order.robuxAmount)}
                  </div>
                </div>
              </div>

              {/* Right: Price & Badge */}
              <div className="text-right">
                <div className="text-sm sm:text-base font-black text-[#2B303A]">
                  {formatRupiah(order.price)}
                </div>
                <span className="inline-block mt-0.5 text-[10px] font-black px-2 py-0.5 rounded-md border border-[#10B981]/30 text-[#10B981] bg-[#ECFDF5] uppercase tracking-wider">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
