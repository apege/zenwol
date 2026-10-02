import React from "react";
import { User, Search, CheckCircle2, Info } from "lucide-react";

interface StepAccountProps {
  username: string;
  onChangeUsername: (val: string) => void;
  verifiedUser: string | null;
  isCheckingUser: boolean;
  onCheckAccount: () => void;
}

export default function StepAccount({
  username,
  onChangeUsername,
  verifiedUser,
  isCheckingUser,
  onCheckAccount,
}: StepAccountProps) {
  return (
    <section
      id="step-account"
      className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-4 sm:p-8 shadow-xs space-y-4 sm:space-y-6 scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Step Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C29841] text-white font-extrabold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          1
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-[#2B303A] leading-tight">
            Masukkan Data Akun
          </h2>
          <p className="text-[11px] sm:text-sm text-[#667085] mt-0.5 leading-relaxed">
            Isi data username Roblox kamu untuk pengiriman pesanan otomatis
          </p>
        </div>
      </div>

      {/* Form Input Area */}
      <div className="space-y-2.5 sm:space-y-3">
        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2B303A]">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C29841]" />
          Username Roblox
        </label>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => onChangeUsername(e.target.value)}
              placeholder="Contoh: ZenwolGamer123"
              className="w-full h-11 sm:h-13 px-3.5 sm:px-4 rounded-xl sm:rounded-2xl border border-[#D9C6A3] bg-[#FCFAF5] text-xs sm:text-sm font-semibold text-[#2B303A] placeholder-[#98A2B3] focus:outline-none focus:border-[#C29841] focus:ring-2 focus:ring-[#C29841]/20 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onCheckAccount}
            disabled={isCheckingUser}
            className="h-11 sm:h-13 px-5 sm:px-6 rounded-xl sm:rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer shrink-0 disabled:opacity-75 active:scale-95"
          >
            {isCheckingUser ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memeriksa...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Cek Akun
              </>
            )}
          </button>
        </div>

        {/* Verified Account Preview Badge if checked */}
        {verifiedUser && (
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs font-semibold text-[#065F46] animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span className="truncate">
                Akun terverifikasi: <strong className="font-extrabold">@{verifiedUser}</strong>
              </span>
            </div>
            <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-bold shrink-0 ml-2">
              VALID
            </span>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] sm:text-xs text-[#667085] flex items-start gap-1.5 pt-1 leading-relaxed">
          <Info className="w-3.5 h-3.5 text-[#C29841] shrink-0 mt-0.5" />
          <span>
            *Silakan masukkan username Roblox Anda dengan benar untuk proses transaksi otomatis 5-10 menit. Akun aman dan privasi terjaga 100%.
          </span>
        </p>
      </div>
    </section>
  );
}
