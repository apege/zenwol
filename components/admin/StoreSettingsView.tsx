"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  Flame,
  QrCode,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Calendar,
  Clock,
  Upload,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";
import { CONTACT_INFO, ROBUX_PACKAGES } from "@/data";
import { formatRobux } from "@/data/adminMock";

export default function StoreSettingsView() {
  // Accordion state
  const [openSections, setOpenSections] = useState<{
    identity: boolean;
    banner: boolean;
    qris: boolean;
  }>({
    identity: true,
    banner: true,
    qris: true,
  });

  // Section 1: Identitas Toko
  const [storeName, setStoreName] = useState(CONTACT_INFO.brandName || "Zenwol.id");
  const [whatsapp, setWhatsapp] = useState(CONTACT_INFO.whatsappNumber || "6281234567890");

  // Section 2: Promo Banner
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [selectedPromoPackage, setSelectedPromoPackage] = useState("2.200 Robux (Rp 45.000)");
  const [headlineBanner, setHeadlineBanner] = useState("⚡ PROMO FLASH SALE ROBUX HARI INI!");
  const [descPromo, setDescPromo] = useState(
    "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!"
  );
  const [countdownDate, setCountdownDate] = useState("30 September 2026 • 06:59 WIB");

  // Section 3: QRIS & Logo
  const [qrisNMID] = useState("ID1029384756102");
  const [logoPath] = useState("/logo.jpg");

  // Modal Countdown Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(30);
  const [selectedHour, setSelectedHour] = useState("06");
  const [selectedMinute, setSelectedMinute] = useState("59");
  const [selectedMonth] = useState("September 2026");

  // Toast / Save State
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleSection = (key: "identity" | "banner" | "qris") => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleAllSections = () => {
    const allOpen = openSections.identity && openSections.banner && openSections.qris;
    setOpenSections({
      identity: !allOpen,
      banner: !allOpen,
      qris: !allOpen,
    });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleApplyPromoTime = () => {
    setCountdownDate(`${selectedDay} ${selectedMonth} • ${selectedHour}:${selectedMinute} WIB`);
    setIsDatePickerOpen(false);
  };

  const handlePresetDays = (days: number) => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    setSelectedDay(today.getDate());
  };

  const handleEndOfMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    setSelectedDay(lastDay);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Section (Matching Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan
          </p>
        </div>

        <button
          onClick={handleToggleAllSections}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
        >
          {openSections.identity && openSections.banner && openSections.qris ? (
            <>
              <ChevronUp className="w-4 h-4 text-[#C29841]" />
              <span>Tutup Semua Section</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 text-[#C29841]" />
              <span>Buka Semua Section</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-5">
        {/* SECTION 1: IDENTITAS TOKO & KONTAK (Matching Image 1 & 2) */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Section Header */}
          <div
            onClick={() => toggleSection("identity")}
            className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-[#FAF7F0]/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
                  Identitas Toko & Kontak
                </h2>
                <p className="text-xs text-[#667085]">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs font-bold text-[#8C7A5B] bg-[#FAF7F0] border border-[#E8DEC9] px-3 py-1 rounded-full">
                {storeName} • WA: {whatsapp}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#8C7A5B]">
                {openSections.identity ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Section Body */}
          {openSections.identity && (
            <div className="p-5 sm:p-6 pt-0 border-t border-[#F0E7D8] mt-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-4">
                {/* Field 1: Nama Toko */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Nama Toko (Navbar Pelanggan)
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
                  />
                  <p className="text-[11px] text-[#8C7A5B] mt-1.5 font-medium">
                    Tampil di navbar web utama (Zen berwarna gelap, wol.id berwarna gold).
                  </p>
                </div>

                {/* Field 2: Nomor WhatsApp */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Nomor WhatsApp Admin CS (Format 62...)
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all font-mono"
                  />
                  <p className="text-[11px] text-[#8C7A5B] mt-1.5 font-medium">
                    Tujuan konfirmasi order dan tombol bantuan CS pelanggan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PENGATURAN PROMO BANNER (Matching Image 1 & 3) */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Section Header */}
          <div
            onClick={() => toggleSection("banner")}
            className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-[#FAF7F0]/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#E11D48] shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
                  Pengaturan Promo Banner Web Pelanggan
                </h2>
                <p className="text-xs text-[#667085]">
                  Atur paket promo yang muncul pada banner hero bagian atas website toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <span className="hidden md:inline-block text-xs font-bold text-[#A57E2F] bg-[#FBF4E4] border border-[#E6D7B9] px-3 py-1 rounded-full">
                {isPromoActive ? "Promo Aktif" : "Promo Nonaktif"} • {selectedPromoPackage}
              </span>

              {/* Toggle Switch */}
              <div
                onClick={() => setIsPromoActive(!isPromoActive)}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex items-center ${
                  isPromoActive ? "bg-[#C29841]" : "bg-[#D1D5DB]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    isPromoActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>

              <div
                onClick={() => toggleSection("banner")}
                className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#8C7A5B] cursor-pointer"
              >
                {openSections.banner ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Section Body */}
          {openSections.banner && (
            <div className="p-5 sm:p-6 pt-0 border-t border-[#F0E7D8] mt-2 space-y-4">
              <div className="space-y-4 pt-4">
                {/* Field 1: Paket Promo Highlight */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Paket Promo Highlight
                  </label>
                  <select
                    value={selectedPromoPackage}
                    onChange={(e) => setSelectedPromoPackage(e.target.value)}
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all cursor-pointer"
                  >
                    {ROBUX_PACKAGES.map((pkg) => (
                      <option
                        key={pkg.id}
                        value={`${formatRobux(pkg.robux)} (Rp ${pkg.price.toLocaleString("id-ID")})`}
                      >
                        {formatRobux(pkg.robux)} (Rp {pkg.price.toLocaleString("id-ID")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field 2: Teks Headline Banner */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Teks Headline Banner
                  </label>
                  <input
                    type="text"
                    value={headlineBanner}
                    onChange={(e) => setHeadlineBanner(e.target.value)}
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
                  />
                </div>

                {/* Field 3: Teks Deskripsi Promo */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Teks Deskripsi Promo
                  </label>
                  <textarea
                    rows={2}
                    value={descPromo}
                    onChange={(e) => setDescPromo(e.target.value)}
                    className="w-full bg-white border border-[#E0D3BC] rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all resize-none"
                  />
                </div>

                {/* Field 4: Waktu Berakhir Promo (Countdown Timer) */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Waktu Berakhir Promo (Countdown Timer)
                  </label>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F0] border border-[#E0D3BC]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-[#2B303A]">
                          {countdownDate}
                        </div>
                        <p className="text-[11px] text-[#8C7A5B]">
                          Klik untuk mengatur tanggal & jam hitung mundur
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs shadow-2xs cursor-pointer active:scale-95"
                    >
                      ATUR
                    </button>
                  </div>
                </div>

                {/* Field 5: Foto / Background Banner Promo */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1">
                    Foto / Background Banner Promo (Hero Web Pelanggan)
                  </label>
                  <p className="text-[11px] text-[#8C7A5B] mb-2.5">
                    Upload foto ilustrasi atau background banner promo yang akan muncul pada card promo di header website pelanggan
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-xs font-bold text-[#2B303A] hover:text-[#C29841] cursor-pointer shadow-2xs transition-all">
                      <Upload className="w-4 h-4 text-[#C29841]" />
                      <span>Upload Banner Baru</span>
                      <span className="text-[10px] text-[#8C7A5B]">(PNG / JPG / WEBP)</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>

                    <button
                      type="button"
                      onClick={() => setPreviewImage("/robux.webp")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E0D3BC] text-xs font-bold text-[#8C7A5B] hover:text-[#2B303A] cursor-pointer shadow-2xs transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview Foto Banner</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: BARCODE QRIS & LOGO TOKO (Matching Image 1 & 4) */}
        <div className="bg-white border border-[#E8DEC9] rounded-3xl shadow-xs overflow-hidden transition-all">
          {/* Section Header */}
          <div
            onClick={() => toggleSection("qris")}
            className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-[#FAF7F0]/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#2B303A] uppercase tracking-wide">
                  Barcode QRIS & Logo Toko
                </h2>
                <p className="text-xs text-[#667085]">
                  Barcode pembayaran QRIS otomatis dan logo storefront toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-block text-xs font-bold text-[#8C7A5B] bg-[#FAF7F0] border border-[#E8DEC9] px-3 py-1 rounded-full">
                QRIS: Terpasang • Logo: Terpasang
              </span>
              <div className="w-8 h-8 rounded-full bg-[#FAF7F0] flex items-center justify-center text-[#8C7A5B]">
                {openSections.qris ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Section Body */}
          {openSections.qris && (
            <div className="p-5 sm:p-6 pt-0 border-t border-[#F0E7D8] mt-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                {/* QRIS Box */}
                <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DEC9] bg-[#FAF7F0]/50 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#2B303A]">
                        Status Barcode QRIS
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        ✓ Terpasang
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8C7A5B] font-mono mb-3">
                      NMID: {qrisNMID}
                    </div>

                    <div
                      onClick={() => setPreviewImage("/logo.jpg")}
                      className="p-4 rounded-2xl bg-white border border-[#E0D3BC] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C29841] transition-all"
                    >
                      <div className="w-28 h-28 bg-[#FAF7F0] border border-[#E6D7B9] rounded-xl flex items-center justify-center p-2 mb-2">
                        <QrCode className="w-20 h-20 text-[#2B303A]" />
                      </div>
                      <span className="text-[11px] font-bold text-[#8C7A5B]">
                        Klik gambar untuk memperbesar QRIS
                      </span>
                    </div>
                  </div>

                  <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-xs font-bold text-[#2B303A] hover:text-[#C29841] cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#C29841]" />
                    <span>Ganti Barcode QRIS</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>

                {/* Logo Box */}
                <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DEC9] bg-[#FAF7F0]/50 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#2B303A]">
                        Status Logo Storefront
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                        ✓ Terpasang
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8C7A5B] font-mono mb-3">
                      {logoPath}
                    </div>

                    <div
                      onClick={() => setPreviewImage("/logo.jpg")}
                      className="p-4 rounded-2xl bg-white border border-[#E0D3BC] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C29841] transition-all"
                    >
                      <div className="w-28 h-28 bg-[#FAF7F0] border border-[#E6D7B9] rounded-xl flex items-center justify-center p-2 mb-2">
                        <Image
                          src="/logo.jpg"
                          alt="Storefront Logo"
                          width={96}
                          height={96}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#8C7A5B]">
                        Klik gambar untuk memperbesar Logo
                      </span>
                    </div>
                  </div>

                  <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-xs font-bold text-[#2B303A] hover:text-[#C29841] cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#C29841]" />
                    <span>Ganti Logo Storefront</span>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Save Button (Matching Image 1) */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
              <Check className="w-4 h-4" /> Semua pengaturan berhasil disimpan!
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#C29841]/25 hover:shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Pengaturan</span>
          </button>
        </div>
      </form>

      {/* POPUP MODAL: COUNTDOWN DATE & TIME PICKER (Matching Image 5) */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div
            className="fixed inset-0"
            onClick={() => setIsDatePickerOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#E8DEC9] space-y-5 animate-scaleUp">
            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => handlePresetDays(3)}
                className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] hover:border-[#C29841] text-[11px] font-black whitespace-nowrap transition-all"
              >
                +3 Hari
              </button>
              <button
                type="button"
                onClick={() => handlePresetDays(7)}
                className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] hover:border-[#C29841] text-[11px] font-black whitespace-nowrap transition-all"
              >
                +7 Hari
              </button>
              <button
                type="button"
                onClick={() => handlePresetDays(14)}
                className="px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] hover:border-[#C29841] text-[11px] font-black whitespace-nowrap transition-all"
              >
                +14 Hari
              </button>
              <button
                type="button"
                onClick={handleEndOfMonth}
                className="px-3 py-1 rounded-full bg-[#C29841] text-white text-[11px] font-black whitespace-nowrap shadow-2xs"
              >
                Akhir Bulan
              </button>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-sm font-black text-[#2B303A]">{selectedMonth}</h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-lg hover:bg-[#FAF7F0] text-[#8C7A5B]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1 rounded-lg hover:bg-[#FAF7F0] text-[#8C7A5B]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 text-center text-[10px] font-black text-[#8C7A5B]">
              <span className="text-[#E11D48]">Min</span>
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
              {[27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(
                (day, idx) => {
                  const isPrevMonth = idx < 4;
                  const isCurrentSelected = day === selectedDay && !isPrevMonth;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => !isPrevMonth && setSelectedDay(day)}
                      disabled={isPrevMonth}
                      className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center transition-all ${
                        isPrevMonth
                          ? "text-[#D1D5DB] cursor-default"
                          : isCurrentSelected
                          ? "bg-[#C29841] text-white font-black shadow-xs scale-105"
                          : "text-[#2B303A] hover:bg-[#FAF7F0]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                }
              )}
            </div>

            {/* Time Picker Section (Matching Image 5) */}
            <div className="pt-3 border-t border-[#F0E7D8] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#2B303A]">
                  <Clock className="w-3.5 h-3.5 text-[#C29841]" />
                  <span>Atur Jam & Menit Berakhir</span>
                </div>
                <span className="text-xs font-mono font-black px-2 py-0.5 rounded-md bg-[#FBF4E4] text-[#A57E2F] border border-[#E6D7B9]">
                  {selectedHour}:{selectedMinute} WIB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#8C7A5B] mb-1">
                    Jam (00 - 23)
                  </label>
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-1.5 px-2 text-xs font-bold text-[#2B303A]"
                  >
                    {Array.from({ length: 24 }).map((_, i) => {
                      const val = String(i).padStart(2, "0");
                      return (
                        <option key={val} value={val}>
                          {val} : 00
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#8C7A5B] mb-1">
                    Menit (00 - 59)
                  </label>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-1.5 px-2 text-xs font-bold text-[#2B303A]"
                  >
                    {Array.from({ length: 60 }).map((_, i) => {
                      const val = String(i).padStart(2, "0");
                      return (
                        <option key={val} value={val}>
                          Menit {val}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyPromoTime}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Terapkan Waktu Promo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative bg-white rounded-3xl p-4 max-w-sm w-full border border-[#E8DEC9] shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0E7D8]">
              <span className="text-xs font-black text-[#2B303A]">
                Preview Foto / Gambar
              </span>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full hover:bg-[#FAF7F0] text-[#8C7A5B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full h-64 bg-[#FAF7F0] rounded-2xl flex items-center justify-center p-4 overflow-hidden border border-[#E8DEC9]">
              <Image
                src={previewImage}
                alt="Preview"
                width={200}
                height={200}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
