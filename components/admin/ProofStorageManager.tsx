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
  ShieldAlert,
  Archive,
  RefreshCw,
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
          `Pembersihan selesai! ${data.data.deletedCount} bukti pembayaran kedaluwarsa telah dihapus dari Neon.`
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
      <div className="bg-[#FAF7F0] border border-[#E8DEC9] rounded-2xl p-4 flex items-center justify-between text-xs text-[#667085]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#C29841]" />
          <span>Memeriksa status kuota storage bukti transfer (Batas 60 Hari)...</span>
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
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#F59E0B] bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/70 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#F59E0B] text-white shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DC2626] text-white">
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
                  Demi menghemat storage 0.5 GB Neon & network transfer, bukti transfer berumur 53–60 hari akan segera dibersihkan otomatis. Segera unduh arsip ZIP jika Anda memerlukan backup bukti pembayaran.
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

      {/* STORAGE & BACKUP CONTROLS CARD */}
      <div className="bg-white border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841] shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-black text-[#2B303A]">
                  Manajemen Storage Bukti Transfer (Neon 0.5GB Saver)
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  <CheckCircle2 className="w-3 h-3" /> Auto-Clean 60 Hari Aktif
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#667085] mt-0.5 font-medium">
                Bukti transfer gambar dibersihkan setelah 60 hari. Data order, username Roblox, dan transaksi tetap tersimpan permanen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleDownloadZip("all")}
              disabled={isExporting !== null || totalWithProof === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              title="Unduh seluruh bukti transfer yang saat ini tersimpan beserta rekapan CSV"
            >
              {isExporting === "all" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C29841]" />
              ) : (
                <Archive className="w-3.5 h-3.5 text-[#C29841]" />
              )}
              <span>Download Semua ZIP ({totalWithProof})</span>
            </button>

            <button
              onClick={handleManualCleanup}
              disabled={isCleaning}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#DC2626] text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95"
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
              className="p-2 rounded-xl bg-[#FAF7F0] border border-[#E0D3BC] hover:border-[#C29841] text-[#667085] hover:text-[#C29841] transition-all cursor-pointer"
              title="Perbarui Status Storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Action feedback message banner */}
        {actionMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1D4ED8] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2563EB]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Storage stats mini counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 pt-3 border-t border-[#F0E7D8]">
          <div className="bg-[#FAF7F0] rounded-xl p-2.5 border border-[#EAE0D0]">
            <span className="text-[10px] uppercase font-extrabold text-[#78716C] tracking-wider block">
              Bukti Tersedia
            </span>
            <span className="text-sm sm:text-base font-black text-[#2B303A]">
              {totalWithProof} Foto
            </span>
          </div>

          <div className="bg-[#FFFBEB] rounded-xl p-2.5 border border-[#FDE68A]">
            <span className="text-[10px] uppercase font-extrabold text-[#B45309] tracking-wider block">
              Mendekati 60 Hari
            </span>
            <span className="text-sm sm:text-base font-black text-[#D97706]">
              {expiringCount} Foto (7 Hari)
            </span>
          </div>

          <div className="bg-[#F0FDF4] rounded-xl p-2.5 border border-[#BBF7D0]">
            <span className="text-[10px] uppercase font-extrabold text-[#15803D] tracking-wider block">
              Hemat Storage
            </span>
            <span className="text-sm sm:text-base font-black text-[#16A34A]">
              {purgedCount} Dihapus
            </span>
          </div>

          <div className="bg-[#FAF7F0] rounded-xl p-2.5 border border-[#EAE0D0]">
            <span className="text-[10px] uppercase font-extrabold text-[#78716C] tracking-wider block">
              Batas Retensi
            </span>
            <span className="text-sm sm:text-base font-black text-[#2B303A]">
              60 Hari Max
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
