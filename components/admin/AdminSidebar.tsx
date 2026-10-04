"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Coins,
  Users,
  MessageCircle,
  ExternalLink,
  LogOut,
  X,
  ShieldAlert,
  MessageSquareQuote,
  CreditCard,
  Settings,
} from "lucide-react";
import { CONTACT_INFO } from "@/data";

export type AdminTab =
  | "dashboard"
  | "order_masuk"
  | "order_diproses"
  | "order_selesai"
  | "order_dibatalkan"
  | "pricelist"
  | "pelanggan"
  | "blacklist"
  | "testimoni"
  | "riwayat_pembayaran"
  | "pengaturan";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  orderCounts: {
    masuk: number;
    diproses: number;
    selesai: number;
    dibatalkan: number;
  };
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  orderCounts,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}: AdminSidebarProps) {
  const handleNavClick = (tab: AdminTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-left cursor-pointer ${
      isActive
        ? "bg-[#C29841] text-white shadow-xs font-extrabold"
        : "text-[#4A5568] hover:bg-[#F3EFE6] hover:text-[#2B303A]"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#EAE0D0] w-64 lg:w-68 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#EAE0D0] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#D9C6A3] bg-white p-0.5 shadow-2xs group-hover:scale-105 transition-transform">
            <Image
              src="/logo.jpg"
              alt="Zenwol.id Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
          </div>
          <div>
            <div className="font-black text-lg tracking-tight text-[#2B303A] leading-tight">
              Zen<span className="text-[#C29841]">wol.id</span>
            </div>
            <p className="text-[10px] font-semibold text-[#8C7A5B] tracking-wide uppercase">
              Admin Panel
            </p>
          </div>
        </Link>
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg hover:bg-[#F3EFE6] text-[#4A5568] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-6">
        {/* Main Section */}
        <div>
          <button
            onClick={() => handleNavClick("dashboard")}
            className={navItemClass(activeTab === "dashboard")}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeTab === "dashboard" ? "text-white" : "text-[#C29841]"
                }`}
              />
              <span>Dashboard</span>
            </div>
          </button>
        </div>

        {/* Order Management Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Order Management
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("order_masuk")}
              className={navItemClass(activeTab === "order_masuk")}
            >
              <div className="flex items-center gap-3">
                <Inbox
                  className={`w-4 h-4 ${
                    activeTab === "order_masuk" ? "text-white" : "text-[#F59E0B]"
                  }`}
                />
                <span>Order Masuk</span>
              </div>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === "order_masuk"
                    ? "bg-white text-[#C29841]"
                    : "bg-[#FBF4E4] text-[#C29841] border border-[#E6D7B9]"
                }`}
              >
                {orderCounts.masuk}
              </span>
            </button>

            <button
              onClick={() => handleNavClick("order_diproses")}
              className={navItemClass(activeTab === "order_diproses")}
            >
              <div className="flex items-center gap-3">
                <Clock
                  className={`w-4 h-4 ${
                    activeTab === "order_diproses" ? "text-white" : "text-[#3B82F6]"
                  }`}
                />
                <span>Order Diproses</span>
              </div>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  activeTab === "order_diproses"
                    ? "bg-white text-[#C29841]"
                    : "bg-[#EBF3FF] text-[#2563EB] border border-[#BFDBFE]"
                }`}
              >
                {orderCounts.diproses}
              </span>
            </button>

            <button
              onClick={() => handleNavClick("order_selesai")}
              className={navItemClass(activeTab === "order_selesai")}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    activeTab === "order_selesai" ? "text-white" : "text-[#10B981]"
                  }`}
                />
                <span>Order Selesai</span>
              </div>
              {orderCounts.selesai > 0 && (
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === "order_selesai"
                      ? "bg-white text-[#C29841]"
                      : "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                  }`}
                >
                  {orderCounts.selesai}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick("order_dibatalkan")}
              className={navItemClass(activeTab === "order_dibatalkan")}
            >
              <div className="flex items-center gap-3">
                <XCircle
                  className={`w-4 h-4 ${
                    activeTab === "order_dibatalkan" ? "text-white" : "text-[#EF4444]"
                  }`}
                />
                <span>Order Dibatalkan</span>
              </div>
            </button>
          </div>
        </div>

        {/* Pricelist Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Pricelist
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("pricelist")}
              className={navItemClass(activeTab === "pricelist")}
            >
              <div className="flex items-center gap-3">
                <Coins
                  className={`w-4 h-4 ${
                    activeTab === "pricelist" ? "text-white" : "text-[#C29841]"
                  }`}
                />
                <span>Pricelist Robux</span>
              </div>
            </button>
          </div>
        </div>

        {/* Pelanggan Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Pelanggan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("pelanggan")}
              className={navItemClass(activeTab === "pelanggan")}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`w-4 h-4 ${
                    activeTab === "pelanggan" ? "text-white" : "text-[#64748B]"
                  }`}
                />
                <span>Daftar Pelanggan</span>
              </div>
            </button>

            <button
              onClick={() => handleNavClick("blacklist")}
              className={navItemClass(activeTab === "blacklist")}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    activeTab === "blacklist" ? "text-white" : "text-[#E11D48]"
                  }`}
                />
                <span>Blacklist</span>
              </div>
            </button>
          </div>
        </div>

        {/* Konten & Ulasan Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Konten & Ulasan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("testimoni")}
              className={navItemClass(activeTab === "testimoni")}
            >
              <div className="flex items-center gap-3">
                <MessageSquareQuote
                  className={`w-4 h-4 ${
                    activeTab === "testimoni" ? "text-white" : "text-[#C29841]"
                  }`}
                />
                <span>Kelola Testimoni</span>
              </div>
            </button>
          </div>
        </div>

        {/* Keuangan Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Keuangan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("riwayat_pembayaran")}
              className={navItemClass(activeTab === "riwayat_pembayaran")}
            >
              <div className="flex items-center gap-3">
                <CreditCard
                  className={`w-4 h-4 ${
                    activeTab === "riwayat_pembayaran" ? "text-white" : "text-[#C29841]"
                  }`}
                />
                <span>Riwayat Pembayaran</span>
              </div>
            </button>
          </div>
        </div>

        {/* Pengaturan Section */}
        <div>
          <div className="text-[10px] font-black tracking-wider text-[#A0907A] uppercase px-3.5 mb-2">
            Pengaturan
          </div>
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick("pengaturan")}
              className={navItemClass(activeTab === "pengaturan")}
            >
              <div className="flex items-center gap-3">
                <Settings
                  className={`w-4 h-4 ${
                    activeTab === "pengaturan" ? "text-white" : "text-[#8C7A5B]"
                  }`}
                />
                <span>Pengaturan Toko</span>
              </div>
            </button>
          </div>
        </div>

        {/* Help Card */}
        <div className="bg-[#FAF7F0] border border-[#E8DEC9] rounded-2xl p-4 text-center">
          <div className="text-xs font-black text-[#2B303A] mb-1">
            Butuh Bantuan?
          </div>
          <p className="text-[11px] text-[#667085] mb-3 leading-relaxed">
            Tim Zenwol siap membantu kamu!
          </p>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=Halo%20Admin%20Zenwol%2C%20saya%20butuh%20bantuan%20panel`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-white border border-[#D9C6A3] text-xs font-bold text-[#2B303A] hover:bg-[#FBF4E4] hover:border-[#C29841] transition-all shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Chat Admin</span>
          </a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="p-3.5 sm:p-4 border-t border-[#EAE0D0] flex items-center justify-between text-xs font-bold text-[#667085]">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-[#C29841] transition-colors py-1"
        >
          <span>Lihat Toko</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-[#E11D48] hover:text-[#BE123C] transition-colors cursor-pointer py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-fadeIn"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-68 max-w-[85vw] h-full shadow-2xl animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
