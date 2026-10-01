import React from "react";
import { Zap, ShieldCheck, User, MessageCircle, Award } from "lucide-react";

export default function FeatureStrip() {
  return (
    <section className="bg-white/90 backdrop-blur rounded-3xl border border-[#E6D7B9] p-4 sm:p-6 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Feature 1 */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
            <Zap className="w-5 h-5 fill-[#C29841]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2B303A]">Proses Cepat</h2>
            <p className="text-[11px] text-[#667085]">5 - 10 Menit Beres</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2B303A]">Pembayaran Aman</h2>
            <p className="text-[11px] text-[#667085]">Legal & Terpercaya</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2B303A]">Hanya Username</h2>
            <p className="text-[11px] text-[#667085]">Tanpa Password Akun</p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2B303A]">Fast Respon 24/7</h2>
            <p className="text-[11px] text-[#667085]">Admin Ramah & Sigap</p>
          </div>
        </div>

        {/* Feature 5 */}
        <div className="flex items-center gap-3 p-2 col-span-2 md:col-span-1">
          <div className="w-10 h-10 rounded-2xl bg-[#FAF3E3] border border-[#E8D9B7] flex items-center justify-center shrink-0 text-[#C29841]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-[#2B303A]">Garansi 100%</h2>
            <p className="text-[11px] text-[#667085]">Uang Kembali Jika Gagal</p>
          </div>
        </div>
      </div>
    </section>
  );
}
