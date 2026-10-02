import React from "react";
import { UserCheck, Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function TransactionFlow() {
  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] p-4 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden space-y-6 sm:space-y-8">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-[#C29841]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="text-center space-y-2 sm:space-y-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#FAF3E3] border border-[#E8D9B7] text-[10px] sm:text-xs font-black text-[#8C6D23] uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C29841]" />
          ALUR TRANSAKSI MUDAH & CEPAT
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#2B303A] tracking-tight leading-tight">
          Top Up Robux Lebih Cepat & Praktis
        </h2>
        <p className="text-[11px] sm:text-sm font-medium text-[#667085] max-w-xl mx-auto leading-relaxed">
          Hanya butuh 3 langkah singkat, saldo Robux resmi langsung mendarat mulus ke akun kamu
        </p>
      </div>

      {/* 3 Step Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 relative z-10">
        {/* Step 1 */}
        <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E8DEC9] p-4 sm:p-6 text-center space-y-2 sm:space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <UserCheck className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 1
          </div>
          <h3 className="text-sm sm:text-lg font-black text-[#2B303A]">
            Cukup Masukkan Username
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed">
            Hanya butuh username Roblox kamu tanpa perlu password, login, ataupun akses akun pribadi.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E8DEC9] p-4 sm:p-6 text-center space-y-2 sm:space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <Zap className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 2
          </div>
          <h3 className="text-sm sm:text-lg font-black text-[#2B303A]">
            Bayar Kilat 5 - 10 Menit
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed">
            Scan barcode QRIS instan dari semua m-banking & e-wallet atau konfirmasi langsung via WhatsApp admin.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E8DEC9] p-4 sm:p-6 text-center space-y-2 sm:space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-2xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div className="text-[10px] sm:text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 3
          </div>
          <h3 className="text-sm sm:text-lg font-black text-[#2B303A]">
            Robux Otomatis Masuk
          </h3>
          <p className="text-[11px] sm:text-xs text-[#667085] leading-relaxed">
            Sistem otomatis mengirim Robux legal ke akun kamu dengan proteksi garansi 100% uang kembali.
          </p>
        </div>
      </div>

      {/* Bottom Guarantee & Slogan Banner */}
      <div className="bg-gradient-to-r from-[#FCFAF5] via-[#FAF3E3] to-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E6D7B9] p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left relative z-10 shadow-2xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2B303A]">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-sm">Garansi 100% Uang Kembali Jika Gagal</span>
        </div>

        <div className="text-[11px] sm:text-sm font-black text-[#C29841] tracking-wide uppercase">
          TOP UP RESMI, MAKIN GAYA JADI SULTAN!
        </div>
      </div>
    </section>
  );
}
