"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { RobuxPackage } from "@/types";

interface AddPricelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkgData: {
    id?: string;
    robux: number;
    price: number;
    isActive: boolean;
    isPromo?: boolean;
    isPopular?: boolean;
    isSultan?: boolean;
  }) => void;
  editingPkg?: RobuxPackage | null;
}

export default function AddPricelistModal({
  isOpen,
  onClose,
  onSave,
  editingPkg,
}: AddPricelistModalProps) {
  const [robux, setRobux] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isPromo, setIsPromo] = useState<boolean>(false);
  const [isPopular, setIsPopular] = useState<boolean>(false);
  const [isSultan, setIsSultan] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPkg) {
      setRobux(editingPkg.robux.toString());
      setPrice(editingPkg.price.toString());
      setIsActive(editingPkg.isActive !== false);
      setIsPromo(!!editingPkg.isPromo);
      setIsPopular(!!editingPkg.isPopular);
      setIsSultan(!!editingPkg.isSultan);
    } else {
      setRobux("");
      setPrice("");
      setIsActive(true);
      setIsPromo(false);
      setIsPopular(false);
      setIsSultan(false);
    }
    setError(null);
  }, [editingPkg, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRobux = parseInt(robux.replace(/\D/g, ""), 10);
    const cleanPrice = parseInt(price.replace(/\D/g, ""), 10);

    if (!cleanRobux || cleanRobux <= 0) {
      setError("Silakan masukkan nominal Robux yang valid.");
      return;
    }

    if (!cleanPrice || cleanPrice <= 0) {
      setError("Silakan masukkan harga jual yang valid.");
      return;
    }

    onSave({
      id: editingPkg ? editingPkg.id : undefined,
      robux: cleanRobux,
      price: cleanPrice,
      isActive,
      isPromo,
      isPopular,
      isSultan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DEC9] space-y-6 animate-scaleUp">
        {/* Header (Matching Reference Image) */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-lg sm:text-xl font-black text-[#2B303A] tracking-tight">
            {editingPkg ? "Edit Nominal Robux" : "Tambah Nominal Robux"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F3EFE6] text-[#8C7A5B] hover:text-[#2B303A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs font-bold text-[#E11D48]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Field 1: Nominal Robux */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-extrabold text-[#2B303A] mb-1.5">
              <span>Nominal Robux</span>
              <div className="w-4 h-4 rounded-full bg-[#FBF4E4] flex items-center justify-center">
                <Image
                  src="/robux.webp"
                  alt="Robux"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain"
                />
              </div>
            </label>
            <div className="relative">
              <input
                type="text"
                value={robux}
                onChange={(e) => setRobux(e.target.value)}
                placeholder="1.000"
                className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 pl-4 pr-12 text-sm sm:text-base font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#8C7A5B] bg-[#FAF7F0] px-2 py-1 rounded-lg border border-[#EAE0D0]">
                R$
              </span>
            </div>
          </div>

          {/* Field 2: Harga Jual (Rp) */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Harga Jual (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#C29841]">
                Rp
              </span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="20.000"
                className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 pl-12 pr-4 text-sm sm:text-base font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
                required
              />
            </div>
          </div>

          {/* Field 3: Checkbox Nominal Aktif */}
          <div className="pt-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => setIsActive(!isActive)}
                className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                  isActive
                    ? "bg-[#C29841] border-[#A57E2F] text-white shadow-2xs"
                    : "bg-white border-[#D1D5DB]"
                }`}
              >
                {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2B303A]">
                Nominal Aktif & Ditampilkan di Web
              </span>
            </label>
          </div>

          {/* Action Buttons (Matching Reference Image) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0E7D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EFE6] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A] text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Simpan Nominal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
