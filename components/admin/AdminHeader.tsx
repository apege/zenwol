"use client";

import React from "react";
import Image from "next/image";
import { Search, LogOut, Menu, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileMenu: () => void;
  onLogout?: () => void;
}

export default function AdminHeader({
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#EAE0D0] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-4 transition-all">
      <div className="max-w-7xl mx-auto space-y-2.5 sm:space-y-0">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-6">
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 rounded-xl bg-white border border-[#E0D3BC] text-[#2B303A] hover:bg-[#F3EFE6] transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-[#D9C6A3] bg-white p-0.5">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <span className="font-extrabold text-sm sm:text-base text-[#2B303A]">
                Zen<span className="text-[#C29841]">wol.id</span>
              </span>
            </div>
          </div>

          {/* Desktop Search Bar (Hidden on mobile, shown on sm and above) */}
          <div className="hidden sm:block flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari order, username, ID..."
                className="w-full bg-white border border-[#E0D3BC] rounded-full py-2 sm:py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/40 focus:border-[#C29841] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Right Section: Admin Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-1.5 sm:pl-3 pr-2 sm:pr-4 py-1 sm:py-1.5 rounded-full bg-white border border-[#E0D3BC] shadow-2xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#C29841] to-[#E6D7B9] p-0.5 shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image
                    src="/logo.jpg"
                    alt="Admin"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="hidden xs:block text-left leading-none">
                <div className="text-[11px] sm:text-xs font-black text-[#2B303A] flex items-center gap-1">
                  <span>Admin</span>
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C29841]" />
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-[#C29841] mt-0.5">
                  Super Admin
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-full bg-white border border-[#E0D3BC] text-[#E11D48] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile-Only Search Bar (Full width below header on mobile) */}
        <div className="block sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C7A5B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari order, username, ID..."
              className="w-full bg-white border border-[#E0D3BC] rounded-full py-1.5 pl-8 pr-3 text-xs text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/40 focus:border-[#C29841] transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
