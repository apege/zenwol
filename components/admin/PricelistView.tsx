"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { ROBUX_PACKAGES } from "@/data";
import { RobuxPackage } from "@/types";
import { formatRupiah, formatRobux } from "@/data/adminMock";
import AddPricelistModal from "./AddPricelistModal";

export default function PricelistView() {
  const [packages, setPackages] = useState<RobuxPackage[]>(
    ROBUX_PACKAGES.map((p) => ({ ...p, isActive: true }))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RobuxPackage | null>(null);

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: RobuxPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket Robux ini?")) {
      setPackages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSavePackage = (data: {
    id?: string;
    robux: number;
    price: number;
    isActive: boolean;
    isPromo?: boolean;
    isPopular?: boolean;
    isSultan?: boolean;
  }) => {
    if (data.id) {
      // Edit existing
      setPackages((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? {
                ...p,
                robux: data.robux,
                price: data.price,
                isActive: data.isActive,
                isPromo: data.isPromo,
                isPopular: data.isPopular,
                isSultan: data.isSultan,
              }
            : p
        )
      );
    } else {
      // Add new
      const newPkg: RobuxPackage = {
        id: "p_" + Date.now(),
        robux: data.robux,
        price: data.price,
        isActive: data.isActive,
        isPromo: data.isPromo,
        isPopular: data.isPopular,
        isSultan: data.isSultan,
      };
      setPackages((prev) => [newPkg, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Title and "+ Tambah Nominal" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Kelola daftar nominal Robux dan harga jual yang ditampilkan di katalog toko
          </p>
        </div>

        {/* Add Nominal CTA Button (Matching Reference Image) */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Nominal</span>
        </button>
      </div>

      {/* Grid Catalog of Robux Packages */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const isPackageActive = pkg.isActive !== false;

            return (
              <div
                key={pkg.id}
                className={`relative p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPackageActive
                    ? "bg-[#FAF7F0]/60 border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]"
                    : "bg-[#F3F4F6]/60 border-[#E5E7EB] opacity-75"
                }`}
              >
                <div>
                  {/* Top Bar: Coin & Nominal + Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#D9C6A3] flex items-center justify-center shrink-0 shadow-2xs">
                        <Image
                          src="/robux.webp"
                          alt="Robux"
                          width={26}
                          height={26}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <div>
                        <div className="font-extrabold text-base sm:text-lg text-[#2B303A] tracking-tight">
                          {formatRobux(pkg.robux)}
                        </div>
                        <div className="text-xs font-black text-[#C29841]">
                          {formatRupiah(pkg.price)}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge (AKTIF / NONAKTIF) */}
                    <div>
                      {isPackageActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] uppercase tracking-wider">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] uppercase tracking-wider">
                          Nonaktif
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Badges / Tags if any */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {pkg.isPromo && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#E11D48] border border-[#FECACA]">
                        PROMO
                      </span>
                    )}
                    {pkg.isPopular && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                        POPULAR
                      </span>
                    )}
                    {pkg.isSultan && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#F5EDE0] text-[#A57E2F] border border-[#E6D7B9]">
                        SULTAN
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: Edit and Delete Buttons */}
                <div className="pt-3 border-t border-[#EAE0D0] flex items-center justify-between mt-2">
                  <span className="text-[11px] font-bold text-[#8C7A5B]">
                    Instant Delivery
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(pkg)}
                      className="p-2 rounded-xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] hover:border-[#C29841] transition-all cursor-pointer shadow-2xs"
                      title="Edit Nominal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 rounded-xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#E11D48] hover:border-[#FECACA] hover:bg-[#FEF2F2] transition-all cursor-pointer shadow-2xs"
                      title="Hapus Nominal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Pricelist Modal */}
      <AddPricelistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePackage}
        editingPkg={editingPackage}
      />
    </div>
  );
}
