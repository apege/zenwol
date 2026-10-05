"use client";

import React, { useState } from "react";
import {
  RotateCw,
  Search,
  ShieldAlert,
  UserCheck,
  ExternalLink,
  Users,
} from "lucide-react";
import { Order } from "@/types";
import { formatRupiah } from "@/lib/formatters";

interface CustomersViewProps {
  orders?: Order[];
}

interface CustomerItem {
  username: string;
  robloxUserId: string;
  whatsappNumber: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  isBlacklisted?: boolean;
}

export default function CustomersView({ orders = [] }: CustomersViewProps) {
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [blacklistedUsernames, setBlacklistedUsernames] = useState<string[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleToggleBlacklist = (username: string) => {
    const key = username.toLowerCase();
    setBlacklistedUsernames((prev) =>
      prev.includes(key) ? prev.filter((u) => u !== key) : [...prev, key]
    );
  };

  // Aggregate customer list dynamically from real orders in Neon database
  const customerMap = new Map<string, CustomerItem>();

  orders.forEach((o) => {
    if (!o.username) return;
    const key = o.username.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpend += o.price;
      if (o.whatsappNumber && existing.whatsappNumber === "-") {
        existing.whatsappNumber = o.whatsappNumber;
      }
    } else {
      customerMap.set(key, {
        username: o.username,
        robloxUserId: o.robloxUserId || "-",
        whatsappNumber: o.whatsappNumber || "-",
        totalOrders: 1,
        totalSpend: o.price,
        lastOrderDate: o.date,
        isBlacklisted: blacklistedUsernames.includes(key),
      });
    }
  });

  const customers = Array.from(customerMap.values());

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.username.toLowerCase().includes(q) ||
      c.robloxUserId.includes(q) ||
      c.whatsappNumber.includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Daftar Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5 sm:mt-1 font-medium">
            Data pembeli yang otomatis diagregasi langsung dari transaksi real database Neon
          </p>
        </div>

        <button
          onClick={handleRefresh}
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

      {/* Main Container */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-3.5 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#F0E7D8]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari username, ID Roblox, atau WhatsApp..."
              className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-full py-2 sm:py-2.5 pl-9 pr-4 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-[#8C7A5B]">
            Menampilkan <span className="font-extrabold text-[#2B303A]">{filteredCustomers.length}</span> pelanggan
          </div>
        </div>

        {/* Customer Items List */}
        {filteredCustomers.length === 0 ? (
          <div className="py-12 sm:py-16 text-center text-[#8C7A5B]">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[#D9C6A3] mb-3 stroke-[1.5]" />
            <div className="text-sm sm:text-base font-extrabold text-[#2B303A]">
              Belum ada pelanggan ditemukan
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Data pelanggan akan otomatis terkumpul saat ada pesanan yang masuk.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-3.5">
            {filteredCustomers.map((c) => {
              const cleanPhone = c.whatsappNumber.replace(/[^0-9]/g, "");

              return (
                <div
                  key={c.username}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl border transition-all ${
                    c.isBlacklisted
                      ? "bg-[#FEF2F2]/40 border-[#FECACA]"
                      : "bg-white border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]/40"
                  }`}
                >
                  {/* Left Block: Username, Status Badge, Details */}
                  <div className="space-y-1 sm:space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-lg font-black text-[#C29841] tracking-tight truncate">
                        @{c.username}
                      </span>
                      <a
                        href={`https://www.roblox.com/search/users?keyword=${c.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9CA3AF] hover:text-[#C29841] transition-colors"
                        title="Buka profil Roblox"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Status Badge */}
                      {c.isBlacklisted ? (
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" />
                          Blacklisted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] uppercase tracking-wider">
                          <UserCheck className="w-3 h-3" />
                          Aktif
                        </span>
                      )}
                    </div>

                    {/* Metadata: ID • WA • Order terakhir */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-[#667085] font-semibold">
                      <span>ID: {c.robloxUserId}</span>
                      <span>•</span>
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#10B981] flex items-center gap-1 transition-colors"
                      >
                        <span>WA: {c.whatsappNumber}</span>
                      </a>
                      <span>•</span>
                      <span>Order terakhir: {c.lastOrderDate}</span>
                    </div>
                  </div>

                  {/* Right Block: Order Count, Total Spend & Blacklist Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#F0E7D8]">
                    <div className="text-left sm:text-right">
                      <div className="text-[9px] sm:text-[10px] font-black text-[#8C7A5B] uppercase tracking-wider">
                        {c.totalOrders}X ORDER
                      </div>
                      <div className="text-sm sm:text-lg font-black text-[#2B303A]">
                        {formatRupiah(c.totalSpend)}
                      </div>
                    </div>

                    {/* Blacklist Action Button */}
                    <div>
                      <button
                        onClick={() => handleToggleBlacklist(c.username)}
                        className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                          c.isBlacklisted
                            ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626] hover:bg-[#FEE2E2]"
                            : "bg-white border-[#FCA5A5] text-[#E11D48] hover:bg-[#FEF2F2]"
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{c.isBlacklisted ? "Buka Blacklist" : "Blacklist"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
