"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  Download,
  Trash2,
  HardDrive,
  Clock,
  CheckCircle2,
  Loader2,
  Archive,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface ProofStatus {
  totalWithProof: number;
  expiringCount: number;
  purgedOver60Count: number;
  earliestProofDate: string | null;
  latestProofDate: string | null;
  retentionLimitDays: number;
  warningWindowDays: number;
}

export default function ProofStorageManager() {
  const [status, setStatus] = useState<ProofStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState<"expiring" | "all" | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/proofs/status");
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil status storage bukti transfer:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleDownloadZip = async (scope: "expiring" | "all") => {
    try {
      setIsExporting(scope);
      setActionMessage("Sedang menyiapkan arsip ZIP dan bukti pembayaran...");

      const url = `/api/admin/proofs/export-zip?scope=${scope}`;
      const res = await fetch(url);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal mengunduh ZIP");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `bukti_transfer_zenwol_${scope}_${dateStr}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setActionMessage("File ZIP berhasil diunduh ke perangkat Anda!");
      setTimeout(() => setActionMessage(null), 4000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal mengunduh arsip ZIP";
      alert(`Peringatan: ${msg}`);
      setActionMessage(null);
    } finally {
      setIsExporting(null);
    }
  };

  const handleManualCleanup = async () => {
    const confirmCleanup = window.confirm(
      "Apakah Anda yakin ingin menghapus data bukti pembayaran yang telah berusia lebih dari 60 hari? Catatan: Riwayat order, username Roblox, dan invoice tetap tersimpan utuh."
    );
    if (!confirmCleanup) return;

    try {
      setIsCleaning(true);
      setActionMessage("Sedang membersihkan bukti pembayaran kedaluwarsa...");
      const res = await fetch("/api/admin/proofs/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ olderThanDays: 60 }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(
          `Pembersihan selesai! ${data.clearedCount ?? data.data?.deletedCount ?? 0} bukti pembayaran kedaluwarsa telah dibersihkan.`
        );
        fetchStatus();
      } else {
        alert(data.error || "Gagal melakukan pembersihan");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(`Gagal: ${msg}`);
    } finally {
      setIsCleaning(false);
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  if (isLoading && !status) {
    return (
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 flex items-center justify-between text-xs text-[#667085] shadow-xs">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 animate-spin text-[#C29841]" />
          <span className="font-medium">Memeriksa status penyimpanan bukti pembayaran...</span>
        </div>
      </div>
    );
  }

  const expiringCount = status?.expiringCount || 0;
  const totalWithProof = status?.totalWithProof || 0;
  const purgedCount = status?.purgedOver60Count || 0;

  return (
    <div className="space-y-3">
      {/* 7-DAY EXPIRATION WARNING BANNER (High Priority Alert) */}
      {expiringCount > 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-[#FDE68A] bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#F59E0B] text-white shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DC2626] text-white">
                    Peringatan 7 Hari
                  </span>
                  <span className="text-xs font-bold text-[#B45309]">
                    Auto-Hapus 60 Hari
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-[#92400E] mt-1">
                  Ada {expiringCount} Bukti Transfer yang Akan Dihapus dalam 7 Hari ke Depan!
                </h4>
                <p className="text-xs text-[#78350F] mt-0.5 leading-relaxed font-medium">
                  Demi efisiensi storage database, bukti transfer berumur 53–60 hari akan segera dibersihkan otomatis. Segera unduh arsip ZIP jika Anda memerlukan backup bukti pembayaran.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => handleDownloadZip("expiring")}
                disabled={isExporting !== null}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isExporting === "expiring" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengunduh ZIP...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download ZIP ({expiringCount} Bukti)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN STORAGE CARD */}
      <div className="relative overflow-hidden bg-white border border-[#E8DEC9] rounded-3xl p-4 sm:p-6 shadow-xs">
        {/* Top Header & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Icon & Description */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FBF4E4] to-[#FAF7F0] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0 shadow-2xs">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-[#2B303A] tracking-tight">
                  Penyimpanan Bukti Transfer
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Auto-Clean 60 Hari
                </span>
              </div>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                Pembersihan gambar otomatis setelah 60 hari. Data order, username Roblox, dan transaksi tetap tersimpan permanen.
              </p>
            </div>
          </div>

          {/* Right: Unified Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => handleDownloadZip("all")}
              disabled={isExporting !== null || totalWithProof === 0}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#FAF7F0] border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Unduh seluruh bukti transfer yang tersimpan beserta rekapan CSV"
            >
              {isExporting === "all" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C29841]" />
              ) : (
                <Archive className="w-3.5 h-3.5 text-[#C29841]" />
              )}
              <span>Download ZIP ({totalWithProof})</span>
            </button>

            <button
              onClick={handleManualCleanup}
              disabled={isCleaning}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-[#FECACA] hover:bg-[#FEF2F2] hover:border-[#FCA5A5] text-[#E11D48] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="Bersihkan bukti gambar yang telah berusia lebih dari 60 hari"
            >
              {isCleaning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Bersihkan &gt;60 Hari</span>
            </button>

            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="h-9 w-9 rounded-xl bg-[#FAF7F0] border border-[#E0D3BC] hover:border-[#C29841] flex items-center justify-center text-[#8C7A5B] hover:text-[#C29841] transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50 shrink-0"
              title="Perbarui Status Storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Action Feedback Notification */}
        {actionMessage && (
          <div className="mt-3.5 p-3 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#15803D] font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span className="leading-snug">{actionMessage}</span>
          </div>
        )}

        {/* 4 Unified Executive KPI Mini-Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 mt-4 pt-4 border-t border-[#F0E7D8]">
          {/* Card 1: Bukti Tersedia */}
          <div className="bg-[#FAF7F0] rounded-2xl p-3 sm:p-3.5 border border-[#EAE0D0] hover:border-[#D9C6A3] transition-colors shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[#8C7A5B]">
                Bukti Tersedia
              </span>
              <div className="w-6 h-6 rounded-lg bg-white border border-[#E8DEC9] flex items-center justify-center text-[#C29841] shrink-0">
                <HardDrive className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-[#2B303A]">
                  {totalWithProof}
                </span>
                <span className="text-[11px] font-bold text-[#8C7A5B]">
                  Foto
                </span>
              </div>
              <p className="text-[10px] text-[#A39B8B] mt-0.5">
                Tersimpan di Neon
              </p>
            </div>
          </div>

          {/* Card 2: Mendekati Limit */}
          <div className="bg-[#FAF7F0] rounded-2xl p-3 sm:p-3.5 border border-[#EAE0D0] hover:border-[#D9C6A3] transition-colors shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[#8C7A5B]">
                Mendekati Limit
              </span>
              <div className={`w-6 h-6 rounded-lg bg-white border flex items-center justify-center shrink-0 ${
                expiringCount > 0 ? "border-[#FDE68A] text-[#D97706]" : "border-[#E8DEC9] text-[#8C7A5B]"
              }`}>
                <Clock className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1">
                <span className={`text-lg sm:text-xl font-black ${
                  expiringCount > 0 ? "text-[#D97706]" : "text-[#2B303A]"
                }`}>
                  {expiringCount}
                </span>
                <span className="text-[11px] font-bold text-[#8C7A5B]">
                  Foto
                </span>
              </div>
              <p className="text-[10px] text-[#A39B8B] mt-0.5">
                Sisa &le; 7 hari lagi
              </p>
            </div>
          </div>

          {/* Card 3: Storage Dihemat */}
          <div className="bg-[#FAF7F0] rounded-2xl p-3 sm:p-3.5 border border-[#EAE0D0] hover:border-[#D9C6A3] transition-colors shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[#8C7A5B]">
                Storage Dihemat
              </span>
              <div className="w-6 h-6 rounded-lg bg-white border border-[#A7F3D0] flex items-center justify-center text-[#059669] shrink-0">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-[#059669]">
                  {purgedCount}
                </span>
                <span className="text-[11px] font-bold text-[#059669]">
                  Dibersihkan
                </span>
              </div>
              <p className="text-[10px] text-[#A39B8B] mt-0.5">
                Kuota database aman
              </p>
            </div>
          </div>

          {/* Card 4: Batas Retensi */}
          <div className="bg-[#FAF7F0] rounded-2xl p-3 sm:p-3.5 border border-[#EAE0D0] hover:border-[#D9C6A3] transition-colors shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-[#8C7A5B]">
                Batas Retensi
              </span>
              <div className="w-6 h-6 rounded-lg bg-white border border-[#E8DEC9] flex items-center justify-center text-[#8C7A5B] shrink-0">
                <Archive className="w-3 h-3" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-black text-[#2B303A]">
                  {status?.retentionLimitDays || 60}
                </span>
                <span className="text-[11px] font-bold text-[#8C7A5B]">
                  Hari Maks
                </span>
              </div>
              <p className="text-[10px] text-[#A39B8B] mt-0.5">
                Siklus otomatis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
