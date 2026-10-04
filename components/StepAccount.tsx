import React from "react";
import Image from "next/image";
import { User, Search, CheckCircle2, AlertCircle, Info, ExternalLink, ShieldCheck } from "lucide-react";
import { RobloxUserProfile } from "@/types";

interface StepAccountProps {
  username: string;
  onChangeUsername: (val: string) => void;
  robloxUser: RobloxUserProfile | null;
  errorMessage: string | null;
  isCheckingUser: boolean;
  onCheckAccount: () => void;
}

export default function StepAccount({
  username,
  onChangeUsername,
  robloxUser,
  errorMessage,
  isCheckingUser,
  onCheckAccount,
}: StepAccountProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCheckAccount();
    }
  };

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
              onKeyDown={handleKeyDown}
              placeholder="Contoh: BloxyGamer123 atau Zenwol"
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
                <span>Memeriksa API...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Cek Akun</span>
              </>
            )}
          </button>
        </div>

        {/* Success / Real Roblox Avatar Preview Card */}
        {robloxUser && (
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#F0FDF4] border border-[#A7F3D0] flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              {/* Roblox Avatar Thumbnail */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#10B981] overflow-hidden p-0.5 shrink-0 shadow-xs">
                <Image
                  src={robloxUser.avatarUrl}
                  alt={robloxUser.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>

              {/* User Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-black text-[#065F46] truncate">
                    {robloxUser.displayName}
                  </span>
                  {robloxUser.hasVerifiedBadge && (
                    <span title="Verified Roblox Badge" className="inline-flex">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs text-[#047857] font-semibold truncate">
                    (@{robloxUser.name})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[#059669] mt-0.5">
                  <span>ID: {robloxUser.id}</span>
                  <span>•</span>
                  <a
                    href={robloxUser.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-0.5 hover:underline font-bold text-[#047857]"
                  >
                    Profil Roblox <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Valid Badge */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-[#10B981] text-white px-2.5 py-1 rounded-full font-black shadow-2xs">
                <CheckCircle2 className="w-3 h-3" />
                AKUN VALID
              </span>
            </div>
          </div>
        )}

        {/* Error Notification if Account Not Found */}
        {errorMessage && (
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center gap-2.5 text-xs font-semibold text-[#BE123C] animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E11D48]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Disclaimer Note */}
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
