import React from "react";
import { UserCheck, Zap, ShieldCheck, Sparkles } from "lucide-react";

export default function TransactionFlow() {
  return (
    <section className="bg-white rounded-3xl border border-[#E6D7B9] p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-8">
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C29841]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF3E3] border border-[#E8D9B7] text-xs font-black text-[#8C6D23] uppercase tracking-wider shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C29841]" />
          ALUR TRANSAKSI MUDAH & CEPAT
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#2B303A] tracking-tight">
          Top Up Robux Lebih Cepat & Praktis
        </h2>
        <p className="text-xs sm:text-sm font-medium text-[#667085] max-w-xl mx-auto">
          Hanya butuh 3 langkah singkat, saldo Robux resmi langsung mendarat mulus ke akun kamu
        </p>
      </div>

      {/* 3 Step Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Step 1 */}
        <div className="bg-[#FCFAF5] rounded-2xl border border-[#E8DEC9] p-6 text-center space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <UserCheck className="w-7 h-7" />
          </div>
          <div className="text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 1
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#2B303A]">
            Cukup Masukkan Username
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Hanya butuh username Roblox kamu tanpa perlu password, login, ataupun akses akun pribadi.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#FCFAF5] rounded-2xl border border-[#E8DEC9] p-6 text-center space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div className="text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 2
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#2B303A]">
            Bayar Kilat 5 - 10 Menit
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Scan barcode QRIS instan dari semua m-banking & e-wallet atau konfirmasi langsung via WhatsApp admin.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#FCFAF5] rounded-2xl border border-[#E8DEC9] p-6 text-center space-y-3 hover:border-[#C29841]/60 hover:shadow-xs transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#DFCFAE] text-[#C29841] flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 group-hover:bg-[#C29841] group-hover:text-white transition-all">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-xs font-extrabold text-[#C29841] uppercase tracking-wider">
            LANGKAH 3
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#2B303A]">
            Robux Otomatis Masuk
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Sistem otomatis mengirim Robux legal ke akun kamu dengan proteksi garansi 100% uang kembali.
          </p>
        </div>
      </div>

      {/* Bottom Guarantee & Slogan Banner */}
      <div className="bg-gradient-to-r from-[#FCFAF5] via-[#FAF3E3] to-[#FCFAF5] rounded-2xl border border-[#E6D7B9] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#2B303A]">
          <div className="w-6 h-6 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span>Garansi 100% Uang Kembali Jika Pesanan Gagal</span>
        </div>

        <div className="text-xs sm:text-sm font-black text-[#C29841] tracking-wide uppercase">
          TOP UP RESMI, MAKIN PERCAYA DIRI JADI SULTAN!
        </div>
      </div>
    </section>
  );
}
