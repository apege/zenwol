import React from "react";
import Image from "next/image";
import { ShieldCheck, MessageCircle, Flame, HelpCircle, Star } from "lucide-react";
import { CONTACT_INFO } from "@/data";

interface FooterProps {
  onOpenHowToOrder?: () => void;
  onOpenCS?: () => void;
  logoSrc?: string | null;
  whatsappNumber?: string;
  storeName?: string;
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer({ onOpenHowToOrder, logoSrc, whatsappNumber, storeName }: FooterProps) {
  const activeBrandName = (storeName || "Zenwol.id").trim();
  const instagramHandle =
    activeBrandName && activeBrandName.toLowerCase() !== "zenwol.id"
      ? activeBrandName.toLowerCase().replace(/[^a-z0-9_.]/g, "")
      : "gherymbuns";
  const activePhone = (whatsappNumber || CONTACT_INFO.whatsappNumber).trim();
  const cleanPhone = activePhone.replace(/[^0-9]/g, "");
  const formattedPhone = activePhone.startsWith("+")
    ? activePhone
    : `+${activePhone}`;
  return (
    <footer className="mt-16 pt-12 pb-16 border-t border-[#E8DEC9] text-[#2B303A] space-y-10">
      {/* 4 Balanced Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 items-start">
        {/* Kolom 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#D9C6A3] shadow-xs bg-white p-0.5 shrink-0">
              <Image
                src={logoSrc || "/logo.jpg"}
                alt={`${activeBrandName} Logo`}
                width={44}
                height={44}
                unoptimized={!!logoSrc && logoSrc.startsWith("data:")}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="font-extrabold text-2xl tracking-tight text-[#2B303A] leading-tight">
                {(() => {
                  if (activeBrandName.toLowerCase().startsWith("zen")) {
                    return (
                      <>
                        Zen<span className="text-[#C29841]">{activeBrandName.slice(3)}</span>
                      </>
                    );
                  }
                  return activeBrandName;
                })()}
              </div>
              <p className="text-xs font-semibold text-[#8C7A58]">
                {CONTACT_INFO.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#667085] leading-relaxed">
            Platform top up Robux terpercaya di Indonesia. Proses 5-10 menit kilat, 100% legal, tanpa password dengan garansi uang kembali.
          </p>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-bold text-[#065F46]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Official Trusted Store Indonesia
            </span>
          </div>
        </div>

        {/* Kolom 2: Menu Cepat */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2B303A] border-b border-[#E8DEC9] pb-2">
            Menu Cepat
          </h3>
          <ul className="space-y-3 text-xs font-semibold text-[#5A6578]">
            <li>
              <a
                href="#step-packages"
                className="inline-flex items-center gap-2 hover:text-[#C29841] transition-colors"
              >
                <Flame className="w-4 h-4 text-[#C29841]" />
                Pricelist Robux Promo
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenHowToOrder}
                className="inline-flex items-center gap-2 hover:text-[#C29841] transition-colors cursor-pointer text-left"
              >
                <HelpCircle className="w-4 h-4 text-[#C29841]" />
                Panduan & Cara Order
              </button>
            </li>
            <li>
              <a
                href="#section-testimonials"
                className="inline-flex items-center gap-2 hover:text-[#C29841] transition-colors"
              >
                <Star className="w-4 h-4 text-[#C29841]" />
                Ulasan & Testimoni Member
              </a>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Jam Layanan & Support */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2B303A] border-b border-[#E8DEC9] pb-2">
            Jam Layanan & Support
          </h3>
          <div className="space-y-2.5 text-xs text-[#5A6578] leading-relaxed">
            <div className="bg-[#FCFAF5] p-2.5 rounded-xl border border-[#E8DEC9]">
              <span className="text-[#8C7A58] block text-[10px] font-bold uppercase tracking-wider">Website</span>
              <span className="font-extrabold text-[#2B303A]">24 Jam Nonstop</span> (Otomatis)
            </div>
            <div className="bg-[#FCFAF5] p-2.5 rounded-xl border border-[#E8DEC9]">
              <span className="text-[#8C7A58] block text-[10px] font-bold uppercase tracking-wider">CS Admin</span>
              <span className="font-extrabold text-[#2B303A]">08:00 - 23:00 WIB</span> (Setiap Hari)
            </div>
          </div>
        </div>

        {/* Kolom 4: Hubungi Kami (Hanya Instagram & WhatsApp) */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2B303A] border-b border-[#E8DEC9] pb-2">
            Hubungi Kami
          </h3>
          <div className="space-y-2.5">
            {/* Instagram Pill */}
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FCFAF5] hover:bg-white border border-[#E8DEC9] hover:border-[#C29841] text-[#2B303A] text-xs font-bold shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FAF2DE] text-[#C29841] flex items-center justify-center shrink-0">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <span className="truncate">@{instagramHandle}</span>
            </a>

            {/* WhatsApp Pill */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FCFAF5] hover:bg-white border border-[#E8DEC9] hover:border-[#10B981] text-[#2B303A] text-xs font-bold shadow-2xs transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-[#E6F8F0] text-[#10B981] flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="truncate">WhatsApp: {formattedPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="pt-6 border-t border-[#E8DEC9] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#98A2B3]">
        <div className="flex items-center gap-3">
          <p>© {new Date().getFullYear()} Zenwol.id. All rights reserved.</p>
          <span>•</span>
          <a
            href="/admin"
            className="text-[#8C7A58] hover:text-[#C29841] font-medium transition-colors"
          >
            Panel Admin
          </a>
        </div>
        <p className="text-[11px] max-w-md">
          Zenwol.id adalah platform top up pihak ketiga yang independen dan tidak berafiliasi dengan Roblox Corporation.
        </p>
      </div>

    </footer>
  );
}
