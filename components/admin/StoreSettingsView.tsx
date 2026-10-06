"use client";

import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { CONTACT_INFO } from "@/data";
import { formatRobux } from "@/lib/formatters";
import { RobuxPackage } from "@/types";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

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

  // Date state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedHour, setSelectedHour] = useState("23");
  const [selectedMinute, setSelectedMinute] = useState("59");

  const [countdownDate, setCountdownDate] = useState(
    `${new Date().getDate()} ${MONTH_NAMES[new Date().getMonth()]} ${new Date().getFullYear()} • 23:59 WIB`
  );
  const [availablePackages, setAvailablePackages] = useState<RobuxPackage[]>([]);

  // Section 3: QRIS & Logo
  const [qrisNMID] = useState("ID1029384756102");
  const [logoPath] = useState("/logo.jpg");

  // Modal Countdown Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Toast / Save State
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Per-section Saving & Saved State
  const [savingSection, setSavingSection] = useState<{
    identity: boolean;
    banner: boolean;
    qris: boolean;
  }>({
    identity: false,
    banner: false,
    qris: false,
  });

  const [savedSection, setSavedSection] = useState<{
    identity: boolean;
    banner: boolean;
    qris: boolean;
  }>({
    identity: false,
    banner: false,
    qris: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Gambar QRIS & Logo (disimpan di database sebagai data URL)
  const [qrisImage, setQrisImage] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ qris: string | null; logo: string | null }>({
    qris: null,
    logo: null,
  });
  const [pendingUpload, setPendingUpload] = useState<{ qris: boolean; logo: boolean }>({
    qris: false,
    logo: false,
  });

  const isCustomImage = (src: string | null) => !!src && src !== "/logo.jpg";

  // Baca file, perkecil & kompres di browser agar ukuran kecil dan aman dikirim
  const compressImage = (file: File, maxSize: number, asPng: boolean): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("File harus berupa gambar (JPG, PNG, WEBP)."));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error("Ukuran file maksimal 10 MB."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Gagal membaca file."));
      reader.onload = () => {
        const img = new window.Image();
        img.onerror = () => reject(new Error("File gambar tidak valid."));
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Browser tidak mendukung pemrosesan gambar."));
            return;
          }
          if (!asPng) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(asPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.88));
        };
        img.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "qris" | "logo"
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError((prev) => ({ ...prev, [kind]: null }));
    try {
      const dataUrl =
        kind === "qris"
          ? await compressImage(file, 1000, true)
          : await compressImage(file, 600, false);
      if (kind === "qris") setQrisImage(dataUrl);
      else setLogoImage(dataUrl);
      setPendingUpload((prev) => ({ ...prev, [kind]: true }));
      setSavedSection((prev) => ({ ...prev, qris: false }));
      setErrorSection((prev) => ({ ...prev, qris: null }));
    } catch (err) {
      setUploadError((prev) => ({
        ...prev,
        [kind]: err instanceof Error ? err.message : "Gagal memproses gambar.",
      }));
    }
  };

  // Fetch real settings from Neon (Bypass Cloudflare and browser cache 100%)
  useEffect(() => {
    fetch(`/api/store-settings?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          if (d.store_name) setStoreName(d.store_name);
          if (d.whatsapp_number) setWhatsapp(d.whatsapp_number);
          if (d.qris_image_path) setQrisImage(d.qris_image_path);
          if (d.logo_image_path) setLogoImage(d.logo_image_path);
          if (d.promo_active !== undefined) setIsPromoActive(Boolean(d.promo_active));
          if (d.promo_title) setHeadlineBanner(d.promo_title);
          if (d.promo_subtitle) setDescPromo(d.promo_subtitle);
          if (d.promo_robux_amount && d.promo_discount_price) {
            setSelectedPromoPackage(
              `${formatRobux(d.promo_robux_amount)} (Rp ${d.promo_discount_price.toLocaleString("id-ID")})`
            );
          }
          if (d.promo_end_date) {
            const dt = new Date(d.promo_end_date);
            if (!isNaN(dt.getTime())) {
              setSelectedYear(dt.getFullYear());
              setSelectedMonthIndex(dt.getMonth());
              setSelectedDay(dt.getDate());
              const hh = String(dt.getHours()).padStart(2, "0");
              const mm = String(dt.getMinutes()).padStart(2, "0");
              setSelectedHour(hh);
              setSelectedMinute(mm);
              setCountdownDate(
                `${dt.getDate()} ${MONTH_NAMES[dt.getMonth()]} ${dt.getFullYear()} • ${hh}:${mm} WIB`
              );
            }
          }
        }
      })
      .catch((err) => console.error("Error fetching store settings:", err));

    fetch("/api/products")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          interface ProductDB {
            id: number;
            name: string;
            robux: number;
            price: number;
            is_active: boolean;
          }
          setAvailablePackages(
            res.data.map((p: ProductDB) => ({
              id: String(p.id),
              robux: p.robux,
              price: Number(p.price),
              isActive: p.is_active,
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

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

  const getSelectedPromoDetails = () => {
    const match = availablePackages.find(
      (pkg) => `${formatRobux(pkg.robux)} (Rp ${pkg.price.toLocaleString("id-ID")})` === selectedPromoPackage
    );
    if (match) {
      return {
        promo_robux_amount: match.robux,
        promo_discount_price: match.price,
        promo_original_label: `${formatRobux(match.robux)}`,
      };
    }
    // Paket tidak ditemukan di daftar: jangan menimpa nilai promo yang sudah tersimpan
    return {};
  };

  const getPromoEndDateIso = () => {
    const maxDay = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const validDay = Math.min(selectedDay, maxDay);
    const dt = new Date(selectedYear, selectedMonthIndex, validDay, Number(selectedHour), Number(selectedMinute), 0);
    return dt.toISOString();
  };

  const [errorSection, setErrorSection] = useState<{
    identity: string | null;
    banner: string | null;
    qris: string | null;
    all: string | null;
  }>({ identity: null, banner: null, qris: null, all: null });

  // Terapkan data yang benar-benar tersimpan di database kembali ke form
  const applySavedData = (d: Record<string, unknown>, parts: Array<"identity" | "banner" | "qris">) => {
    if (parts.includes("identity")) {
      if (typeof d.store_name === "string") setStoreName(d.store_name);
      if (typeof d.whatsapp_number === "string") setWhatsapp(d.whatsapp_number);
    }
    if (parts.includes("qris")) {
      if (typeof d.qris_image_path === "string") setQrisImage(d.qris_image_path);
      if (typeof d.logo_image_path === "string") setLogoImage(d.logo_image_path);
      setPendingUpload({ qris: false, logo: false });
    }
    if (parts.includes("banner")) {
      if (d.promo_active !== undefined) setIsPromoActive(Boolean(d.promo_active));
      if (typeof d.promo_title === "string") setHeadlineBanner(d.promo_title);
      if (typeof d.promo_subtitle === "string") setDescPromo(d.promo_subtitle);
      if (d.promo_end_date) {
        const dt = new Date(String(d.promo_end_date));
        if (!isNaN(dt.getTime())) {
          const hh = String(dt.getHours()).padStart(2, "0");
          const mm = String(dt.getMinutes()).padStart(2, "0");
          setSelectedYear(dt.getFullYear());
          setSelectedMonthIndex(dt.getMonth());
          setSelectedDay(dt.getDate());
          setSelectedHour(hh);
          setSelectedMinute(mm);
          setCountdownDate(
            `${dt.getDate()} ${MONTH_NAMES[dt.getMonth()]} ${dt.getFullYear()} • ${hh}:${mm} WIB`
          );
        }
      }
    }
  };

  // Helper simpan terpusat: cek HTTP status, success flag, dan tampilkan error ke user
  const saveSettings = async (
    payload: Record<string, unknown>,
    parts: Array<"identity" | "banner" | "qris">
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/store-settings?_t=${Date.now()}`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        body: JSON.stringify(payload),
      });

      let data: { success?: boolean; error?: string; data?: Record<string, unknown> } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server mengembalikan respon tidak valid (HTTP ${res.status}).`);
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || `Gagal menyimpan (HTTP ${res.status}).`);
      }

      if (data.data) applySavedData(data.data, parts);
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan. Periksa koneksi internet lalu coba lagi.";
      console.error("Error saving store settings:", err);
      return { ok: false, error: message };
    }
  };

  const runSectionSave = async (
    key: "identity" | "banner" | "qris",
    payload: Record<string, unknown>
  ) => {
    setSavingSection((prev) => ({ ...prev, [key]: true }));
    setErrorSection((prev) => ({ ...prev, [key]: null }));
    setSavedSection((prev) => ({ ...prev, [key]: false }));

    const result = await saveSettings(payload, [key]);

    if (result.ok) {
      setSavedSection((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedSection((prev) => ({ ...prev, [key]: false })), 3000);
    } else {
      setErrorSection((prev) => ({ ...prev, [key]: result.error || "Gagal menyimpan." }));
    }
    setSavingSection((prev) => ({ ...prev, [key]: false }));
  };

  // Section 1 Save Handler
  const handleSaveIdentity = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!storeName.trim()) {
      setErrorSection((prev) => ({ ...prev, identity: "Nama toko tidak boleh kosong." }));
      return;
    }
    if (!whatsapp.trim()) {
      setErrorSection((prev) => ({ ...prev, identity: "Nomor WhatsApp tidak boleh kosong." }));
      return;
    }
    await runSectionSave("identity", {
      store_name: storeName.trim(),
      whatsapp_number: whatsapp.trim(),
    });
  };

  // Section 2 Save Handler
  const handleSaveBanner = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSectionSave("banner", {
      promo_active: isPromoActive,
      promo_title: headlineBanner.trim(),
      promo_subtitle: descPromo.trim(),
      promo_end_date: getPromoEndDateIso(),
      ...getSelectedPromoDetails(),
    });
  };

  // Section 3 Save Handler
  const handleSaveQRIS = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await runSectionSave("qris", {
      qris_image_path: qrisImage || "/logo.jpg",
      logo_image_path: logoImage || "/logo.jpg",
    });
  };

  // Master Save Handler
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !whatsapp.trim()) {
      setErrorSection((prev) => ({
        ...prev,
        all: "Nama toko dan nomor WhatsApp tidak boleh kosong.",
      }));
      return;
    }
    setIsSaving(true);
    setErrorSection((prev) => ({ ...prev, all: null }));

    const result = await saveSettings(
      {
        store_name: storeName.trim(),
        whatsapp_number: whatsapp.trim(),
        promo_active: isPromoActive,
        promo_title: headlineBanner.trim(),
        promo_subtitle: descPromo.trim(),
        promo_end_date: getPromoEndDateIso(),
        ...getSelectedPromoDetails(),
        qris_image_path: qrisImage || "/logo.jpg",
        logo_image_path: logoImage || "/logo.jpg",
      },
      ["identity", "banner", "qris"]
    );

    if (result.ok) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      setErrorSection((prev) => ({ ...prev, all: result.error || "Gagal menyimpan." }));
    }
    setIsSaving(false);
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonthIndex === 0) {
      setSelectedMonthIndex(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex === 11) {
      setSelectedMonthIndex(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonthIndex((m) => m + 1);
    }
  };

  const handleApplyPromoTime = () => {
    const maxDay = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const validDay = Math.min(selectedDay, maxDay);
    setSelectedDay(validDay);

    setCountdownDate(
      `${validDay} ${MONTH_NAMES[selectedMonthIndex]} ${selectedYear} • ${selectedHour}:${selectedMinute} WIB`
    );
    setIsDatePickerOpen(false);
  };

  const handlePresetDays = (days: number) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setSelectedYear(target.getFullYear());
    setSelectedMonthIndex(target.getMonth());
    setSelectedDay(target.getDate());
  };

  const handleEndOfMonth = () => {
    const lastDay = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    setSelectedDay(lastDay);
  };

  // Calendar Day Calculation for current selected month & year
  const totalDaysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonthIndex, 1).getDay(); // 0 = Sun, 1 = Mon...
  const prevMonthTotalDays = new Date(selectedYear, selectedMonthIndex, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDayIndex },
    (_, i) => prevMonthTotalDays - firstDayIndex + i + 1
  );

  const currentMonthDays = Array.from(
    { length: totalDaysInMonth },
    (_, i) => i + 1
  );

  const remainingSlots = (7 - ((prevMonthDays.length + currentMonthDays.length) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingSlots }, (_, i) => i + 1);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Pengaturan Toko & Banner
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan banner promo pelanggan langsung di Neon DB
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
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
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
                    Tampil di navbar web utama.
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

              {/* Section 1 Save Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#F0E7D8]">
                {errorSection.identity ? (
                  <span className="text-xs font-bold text-[#E11D48] flex items-center gap-1.5">
                    ✕ {errorSection.identity}
                  </span>
                ) : savedSection.identity ? (
                  <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Identitas toko & kontak berhasil disimpan!
                  </span>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={() => handleSaveIdentity()}
                  disabled={savingSection.identity}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs font-extrabold shadow-md shadow-[#C29841]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 self-end sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSection.identity ? "Menyimpan Identitas..." : "Simpan Identitas & Kontak"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: PENGATURAN PROMO BANNER */}
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
                    {availablePackages.map((pkg) => (
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

                {/* Field 4: Waktu Berakhir Promo */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
                    Waktu Berakhir Promo (Countdown Timer)
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E0D3BC]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs shadow-2xs cursor-pointer active:scale-95 self-end sm:self-auto"
                    >
                      ATUR
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2 Save Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#F0E7D8]">
                {errorSection.banner ? (
                  <span className="text-xs font-bold text-[#E11D48] flex items-center gap-1.5">
                    ✕ {errorSection.banner}
                  </span>
                ) : savedSection.banner ? (
                  <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Pengaturan promo banner berhasil disimpan!
                  </span>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={() => handleSaveBanner()}
                  disabled={savingSection.banner}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs font-extrabold shadow-md shadow-[#C29841]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 self-end sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSection.banner ? "Menyimpan Promo..." : "Simpan Banner Promo"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: BARCODE QRIS & LOGO TOKO */}
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
                      {pendingUpload.qris ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                          Belum disimpan
                        </span>
                      ) : isCustomImage(qrisImage) ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          ✓ Terpasang
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#E11D48] border border-[#FECACA]">
                          Belum diupload
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8C7A5B] font-mono mb-3">
                      NMID: {qrisNMID}
                    </div>

                    <div
                      onClick={() => isCustomImage(qrisImage) && setPreviewImage(qrisImage)}
                      className="p-4 rounded-2xl bg-white border border-[#E0D3BC] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C29841] transition-all"
                    >
                      <div className="w-28 h-28 bg-[#FAF7F0] border border-[#E6D7B9] rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden">
                        {isCustomImage(qrisImage) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={qrisImage as string}
                            alt="QRIS"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <QrCode className="w-20 h-20 text-[#2B303A]" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#8C7A5B]">
                        {isCustomImage(qrisImage)
                          ? "Klik gambar untuk memperbesar QRIS"
                          : "Belum ada barcode QRIS, silakan upload"}
                      </span>
                    </div>
                    {uploadError.qris && (
                      <p className="text-[11px] font-bold text-[#E11D48] mt-2">✕ {uploadError.qris}</p>
                    )}
                  </div>

                  <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-xs font-bold text-[#2B303A] hover:text-[#C29841] cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#C29841]" />
                    <span>Ganti Barcode QRIS</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "qris")}
                    />
                  </label>
                </div>

                {/* Logo Box */}
                <div className="p-4 sm:p-5 rounded-2xl border border-[#E8DEC9] bg-[#FAF7F0]/50 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-[#2B303A]">
                        Status Logo Storefront
                      </span>
                      {pendingUpload.logo ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                          Belum disimpan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                          ✓ Terpasang
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8C7A5B] font-mono mb-3">
                      {isCustomImage(logoImage) ? "Logo kustom (tersimpan di database)" : logoPath}
                    </div>

                    <div
                      onClick={() => setPreviewImage(logoImage || "/logo.jpg")}
                      className="p-4 rounded-2xl bg-white border border-[#E0D3BC] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#C29841] transition-all"
                    >
                      <div className="w-28 h-28 bg-[#FAF7F0] border border-[#E6D7B9] rounded-xl flex items-center justify-center p-2 mb-2 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoImage || "/logo.jpg"}
                          alt="Storefront Logo"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#8C7A5B]">
                        Klik gambar untuk memperbesar Logo
                      </span>
                    </div>
                    {uploadError.logo && (
                      <p className="text-[11px] font-bold text-[#E11D48] mt-2">✕ {uploadError.logo}</p>
                    )}
                  </div>

                  <label className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-xs font-bold text-[#2B303A] hover:text-[#C29841] cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5 text-[#C29841]" />
                    <span>Ganti Logo Storefront</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "logo")}
                    />
                  </label>
                </div>
              </div>

              {/* Section 3 Save Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#F0E7D8]">
                {errorSection.qris ? (
                  <span className="text-xs font-bold text-[#E11D48] flex items-center gap-1.5">
                    ✕ {errorSection.qris}
                  </span>
                ) : savedSection.qris ? (
                  <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Barcode QRIS & logo berhasil disimpan!
                  </span>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={() => handleSaveQRIS()}
                  disabled={savingSection.qris}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs font-extrabold shadow-md shadow-[#C29841]/20 hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50 self-end sm:self-auto"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingSection.qris ? "Menyimpan QRIS..." : "Simpan QRIS & Logo"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Save Button */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {errorSection.all ? (
            <span className="text-xs font-bold text-[#E11D48] flex items-center justify-center sm:justify-start gap-1">
              ✕ {errorSection.all}
            </span>
          ) : isSaved ? (
            <span className="text-xs font-bold text-[#10B981] flex items-center justify-center sm:justify-start gap-1">
              <Check className="w-4 h-4" /> Semua pengaturan berhasil disimpan ke database Neon!
            </span>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#C29841]/25 hover:shadow-xl transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Semua Pengaturan"}</span>
          </button>
        </div>
      </form>

      {/* POPUP MODAL: COUNTDOWN DATE & TIME PICKER */}
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
              <h3 className="text-sm font-black text-[#2B303A]">
                {MONTH_NAMES[selectedMonthIndex]} {selectedYear}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg hover:bg-[#FAF7F0] text-[#8C7A5B] hover:text-[#C29841] transition-colors cursor-pointer active:scale-95"
                  title="Bulan Sebelumnya"
                  aria-label="Bulan Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg hover:bg-[#FAF7F0] text-[#8C7A5B] hover:text-[#C29841] transition-colors cursor-pointer active:scale-95"
                  title="Bulan Berikutnya"
                  aria-label="Bulan Berikutnya"
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
              {/* Prev month days */}
              {prevMonthDays.map((day) => (
                <div
                  key={`prev-${day}`}
                  className="h-8 w-8 mx-auto rounded-full flex items-center justify-center text-[#D1D5DB] cursor-default select-none"
                >
                  {day}
                </div>
              ))}

              {/* Current month days */}
              {currentMonthDays.map((day) => {
                const isCurrentSelected = day === selectedDay;
                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isCurrentSelected
                        ? "bg-[#C29841] text-white font-black shadow-xs scale-105"
                        : "text-[#2B303A] hover:bg-[#FAF7F0] hover:text-[#C29841]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Next month days */}
              {nextMonthDays.map((day) => (
                <div
                  key={`next-${day}`}
                  className="h-8 w-8 mx-auto rounded-full flex items-center justify-center text-[#D1D5DB] cursor-default select-none"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Time Picker Section */}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
