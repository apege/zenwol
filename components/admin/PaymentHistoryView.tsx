"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RotateCw,
  Search,
  TrendingUp,
  Globe,
  MessageCircle,
  CheckCircle2,
  Receipt,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { formatRupiah, formatRobux } from "@/data/adminMock";

interface PaymentLogItem {
  id: string;
  username: string;
  channel: "WEBSITE" | "WHATSAPP";
  status: "LUNAS";
  date: string;
  amount: number;
  robuxAmount: number;
}

const INITIAL_PAYMENT_LOGS: PaymentLogItem[] = [
  {
    id: "ZEN16327827",
    username: "MFMftRyan",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "18 Sep 2026",
    amount: 70000,
    robuxAmount: 3700,
  },
  {
    id: "ZEN87025771",
    username: "MFMftRyan",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "15 Sep 2026",
    amount: 70000,
    robuxAmount: 3700,
  },
  {
    id: "ZEN79246810",
    username: "MFMftRyan",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "15 Sep 2026",
    amount: 70000,
    robuxAmount: 3700,
  },
  {
    id: "ZEN55073812",
    username: "MFMftRyan",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "15 Sep 2026",
    amount: 70000,
    robuxAmount: 3700,
  },
  {
    id: "ZEN38073439",
    username: "Ekoo1801",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "9 Sep 2026",
    amount: 45000,
    robuxAmount: 2200,
  },
  {
    id: "ZEN91823746",
    username: "londoireng61",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "8 Sep 2026",
    amount: 80000,
    robuxAmount: 4200,
  },
  {
    id: "ZEN82736451",
    username: "Crasiel17",
    channel: "WEBSITE",
    status: "LUNAS",
    date: "7 Sep 2026",
    amount: 45000,
    robuxAmount: 2200,
  },
];

export default function PaymentHistoryView() {
  const [logs, setLogs] = useState<PaymentLogItem[]>(INITIAL_PAYMENT_LOGS);
  const [activeChannelTab, setActiveChannelTab] = useState<"semua" | "website" | "whatsapp">("semua");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  // Calculations
  const totalDanaMasuk = 1257000;
  const totalRobuxTerjual = 65600;
  const totalTransaksiCount = 27;
  const avgOrderValue = Math.round(totalDanaMasuk / totalTransaksiCount); // 46.556

  const websiteCount = 27;
  const whatsappCount = 0;

  const filteredLogs = logs.filter((log) => {
    if (activeChannelTab === "website" && log.channel !== "WEBSITE") return false;
    if (activeChannelTab === "whatsapp" && log.channel !== "WHATSAPP") return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.id.toLowerCase().includes(q) ||
      log.username.toLowerCase().includes(q) ||
      log.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section (Matching Reference Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Log mutasi kas masuk dan ringkasan pembayaran pesanan Robux yang berhasil
          </p>
        </div>

        <button
          onClick={handleRefresh}
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

      {/* 3 Top KPI Cards (Matching Reference Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Dana Masuk */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Total Dana Masuk
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B303A]">
            {formatRupiah(totalDanaMasuk)}
          </div>
          <p className="text-xs font-semibold text-[#667085]">
            Dari {totalTransaksiCount} transaksi pembayaran lunas
          </p>
        </div>

        {/* Card 2: Total Robux Terjual */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Total Robux Terjual
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={18}
                height={18}
                className="w-4 h-4 object-contain"
              />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#C29841]">
            {totalRobuxTerjual.toLocaleString("id-ID")}{" "}
            <span className="text-base font-extrabold text-[#A57E2F]">R$</span>
          </div>
          <p className="text-xs font-semibold text-[#667085]">
            Robux terkirim ke akun pelanggan
          </p>
        </div>

        {/* Card 3: Rata-Rata Order */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase">
              Rata-Rata Order
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
              AOV
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#2B303A]">
            {formatRupiah(avgOrderValue)}
          </div>
          <p className="text-xs font-bold text-[#10B981]">
            Average Order Value per transaksi
          </p>
        </div>
      </div>

      {/* Section: Omset Per Metode Pembayaran (Matching Reference Image 1 & 2) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
            Omset Per Metode Pembayaran
          </h2>
          <p className="text-xs text-[#667085]">
            Ringkasan total pemasukan berdasarkan metode pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Website */}
          <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
                  Website
                </span>
              </div>
              <span className="text-xs font-black text-[#C29841] bg-[#FBF4E4] border border-[#E6D7B9] px-2.5 py-1 rounded-full">
                100.0%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <div className="text-[11px] font-bold text-[#8C7A5B]">
                  Total Omset
                </div>
                <div className="text-base sm:text-lg font-black text-[#2B303A]">
                  {formatRupiah(totalDanaMasuk)}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#8C7A5B]">
                  Transaksi
                </div>
                <div className="text-base sm:text-lg font-black text-[#2B303A]">
                  {websiteCount} transaksi
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#FAF7F0] h-2.5 rounded-full overflow-hidden border border-[#E8DEC9]">
              <div className="bg-gradient-to-r from-[#C29841] to-[#A57E2F] h-full rounded-full w-full" />
            </div>
          </div>

          {/* Card: WhatsApp */}
          <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
                  WhatsApp
                </span>
              </div>
              <span className="text-xs font-black text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-full">
                0.0%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <div className="text-[11px] font-bold text-[#8C7A5B]">
                  Total Omset
                </div>
                <div className="text-base sm:text-lg font-black text-[#2B303A]">
                  Rp 0
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#8C7A5B]">
                  Transaksi
                </div>
                <div className="text-base sm:text-lg font-black text-[#2B303A]">
                  {whatsappCount} transaksi
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#FAF7F0] h-2.5 rounded-full overflow-hidden border border-[#E8DEC9]">
              <div className="bg-[#10B981] h-full rounded-full w-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Log Mutasi Pembayaran Masuk (Matching Reference Image 3) */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F0E7D8]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#2B303A]">
              Log Mutasi Pembayaran Masuk
            </h2>
            <p className="text-xs text-[#667085]">
              Riwayat penerimaan pembayaran yang valid dan sudah lunas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChannelTab("semua")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeChannelTab === "semua"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Semua ({totalTransaksiCount})
            </button>
            <button
              onClick={() => setActiveChannelTab("website")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeChannelTab === "website"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Website ({websiteCount})
            </button>
            <button
              onClick={() => setActiveChannelTab("whatsapp")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeChannelTab === "whatsapp"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              WhatsApp ({whatsappCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode order atau username..."
            className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
          />
        </div>

        {/* Transaction Log Items (Matching Reference Image 3) */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-[#F0E7D8] bg-white hover:border-[#C29841] hover:bg-[#FAF7F0]/40 transition-all group"
            >
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base sm:text-lg font-black text-[#2B303A] tracking-tight group-hover:text-[#C29841] transition-colors">
                    #{log.id}
                  </span>
                  <span className="font-extrabold text-sm text-[#C29841]">
                    @{log.username}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] uppercase tracking-wider">
                    {log.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8C7A5B]">
                  <span className="px-2 py-0.5 rounded-md bg-[#FBF4E4] text-[#A57E2F] border border-[#E6D7B9] text-[10px] font-black uppercase tracking-wider">
                    {log.channel}
                  </span>
                  <span>•</span>
                  <span>{log.date}</span>
                </div>
              </div>

              {/* Right Details: +Amount & Robux */}
              <div className="text-left sm:text-right">
                <div className="text-base sm:text-lg font-black text-[#059669]">
                  +{formatRupiah(log.amount)}
                </div>
                <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-[#C29841]">
                  <div className="w-4 h-4 rounded-full bg-[#FBF4E4] flex items-center justify-center shrink-0">
                    <Image
                      src="/robux.webp"
                      alt="Robux"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 object-contain"
                    />
                  </div>
                  <span>{formatRobux(log.robuxAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
