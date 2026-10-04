"use client";

import React, { useState } from "react";
import {
  RotateCw,
  Search,
  Plus,
  ShieldAlert,
  Unlock,
  ExternalLink,
  ShieldCheck,
  UserX,
} from "lucide-react";
import AddBlacklistModal from "./AddBlacklistModal";

export interface BlacklistItem {
  id: string;
  username: string;
  whatsappNumber: string;
  dateAdded: string;
  reason: string;
  totalOrders: number;
  totalSpend: number;
}

const INITIAL_BLACKLIST: BlacklistItem[] = [
  {
    id: "BLK-001",
    username: "Perusuh_Gajelas",
    whatsappNumber: "0895412735876",
    dateAdded: "12 Sep 2026",
    reason: "Indikasi Penipuan",
    totalOrders: 0,
    totalSpend: 0,
  },
  {
    id: "BLK-002",
    username: "Scammer_Robux99",
    whatsappNumber: "081298765432",
    dateAdded: "18 Sep 2026",
    reason: "Kirim bukti transfer palsu",
    totalOrders: 0,
    totalSpend: 0,
  },
];

export default function BlacklistView() {
  const [blacklist, setBlacklist] = useState<BlacklistItem[]>(INITIAL_BLACKLIST);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleUnblock = (id: string, username: string) => {
    if (confirm(`Apakah Anda yakin ingin membuka blokir untuk @${username}?`)) {
      setBlacklist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddBlacklist = (data: {
    username: string;
    whatsappNumber?: string;
    reason: string;
  }) => {
    const newItem: BlacklistItem = {
      id: `BLK-${String(blacklist.length + 1).padStart(3, "0")}`,
      username: data.username,
      whatsappNumber: data.whatsappNumber || "-",
      dateAdded: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      reason: data.reason,
      totalOrders: 0,
      totalSpend: 0,
    };
    setBlacklist((prev) => [newItem, ...prev]);
  };

  const filteredList = blacklist.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.username.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.whatsappNumber.includes(q) ||
      item.reason.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Section (Matching Reference Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Daftar Blacklist
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Daftar akun pelanggan yang diblokir karena indikasi penipuan atau penyalahgunaan
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Tambah Blacklist Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:from-[#D01840] hover:to-[#A71034] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#E11D48]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Blacklist</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw
              className={`w-4 h-4 text-[#C29841] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        {/* Search & Counter Bar (Matching Reference Image 1) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0E7D8]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari akun blacklist..."
              className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>
          <div className="text-xs font-bold text-[#8C7A5B]">
            Menampilkan{" "}
            <span className="font-extrabold text-[#2B303A]">
              {filteredList.length}
            </span>{" "}
            akun blacklist
          </div>
        </div>

        {/* Blacklisted Users List (Matching Reference Image 1) */}
        {filteredList.length === 0 ? (
          <div className="py-16 text-center text-[#8C7A5B]">
            <ShieldCheck className="w-12 h-12 mx-auto text-[#10B981] mb-3 stroke-[1.5]" />
            <div className="text-base font-extrabold text-[#2B303A]">
              Tidak ada akun yang diblacklist
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Semua pelanggan aktif dan tidak ada catatan kecurangan yang terdaftar.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-[#FECACA] bg-[#FEF2F2]/30 hover:bg-[#FEF2F2]/50 transition-all"
              >
                {/* Left Block: Username, Blacklisted Badge, Details, Reason */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-base sm:text-lg font-black text-[#E11D48] tracking-tight line-through">
                      @{item.username}
                    </span>
                    <a
                      href={`https://www.roblox.com/search/users?keyword=${item.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9CA3AF] hover:text-[#E11D48] transition-colors"
                      title="Lihat profil Roblox"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Blacklist Badge */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3" />
                      Blacklisted
                    </span>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-[#667085] font-semibold">
                    <span>ID: {item.id}</span>
                    <span>•</span>
                    <span>
                      WA:{" "}
                      <span className="text-[#10B981] font-bold">
                        {item.whatsappNumber}
                      </span>
                    </span>
                    <span>•</span>
                    <span>Ditambahkan: {item.dateAdded}</span>
                  </div>

                  {/* Reason Row */}
                  <div className="text-xs font-bold text-[#E11D48] pt-0.5">
                    <span className="font-semibold text-[#8C7A5B]">Alasan:</span>{" "}
                    {item.reason}
                  </div>
                </div>

                {/* Right Block: Order Count, Spend & Buka Blokir Button */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-[#FECACA]">
                  <div className="text-left md:text-right">
                    <div className="text-[10px] font-black text-[#8C7A5B] uppercase tracking-wider">
                      {item.totalOrders} PESANAN
                    </div>
                    <div className="text-base sm:text-lg font-black text-[#2B303A]">
                      Rp {item.totalSpend}
                    </div>
                  </div>

                  {/* Buka Blokir Button (Matching Reference Image 1) */}
                  <div>
                    <button
                      onClick={() => handleUnblock(item.id, item.username)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#A7F3D0] text-[#059669] hover:bg-[#ECFDF5] text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Unlock className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Buka Blokir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Blacklist Modal */}
      <AddBlacklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddBlacklist}
      />
    </div>
  );
}
