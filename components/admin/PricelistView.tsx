"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, RotateCw } from "lucide-react";
import { RobuxPackage } from "@/types";
import { formatRupiah, formatRobux } from "@/lib/formatters";
import AddPricelistModal from "./AddPricelistModal";

interface DBProduct {
  id: number;
  name: string;
  robux: number;
  price: number;
  is_active: boolean;
  image_path?: string;
}

export default function PricelistView() {
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RobuxPackage | null>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: RobuxPackage[] = data.data.map((p: DBProduct) => ({
          id: String(p.id),
          robux: p.robux,
          price: Number(p.price),
          isActive: p.is_active,
          isPromo: p.robux === 2200 || p.robux === 6800,
          isPopular: p.robux >= 2200 && p.robux <= 5500,
          isSultan: p.robux >= 10000,
        }));
        setPackages(mapped);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleOpenAddModal = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: RobuxPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket Robux ini dari database?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setPackages((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleSavePackage = async (data: {
    id?: string;
    robux: number;
    price: number;
    isActive: boolean;
    isPromo?: boolean;
    isPopular?: boolean;
    isSultan?: boolean;
  }) => {
    try {
      if (data.id) {
        // Edit existing in Neon DB
        const res = await fetch(`/api/products/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${data.robux.toLocaleString("id-ID")} Robux`,
            robux: data.robux,
            price: data.price,
            is_active: data.isActive,
          }),
        });
        const resData = await res.json();
        if (resData.success) {
          await fetchPackages();
        }
      } else {
        // Add new to Neon DB
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${data.robux.toLocaleString("id-ID")} Robux`,
            robux: data.robux,
            price: data.price,
            is_active: data.isActive,
            image_path: "/robux.webp",
          }),
        });
        const resData = await res.json();
        if (resData.success) {
          await fetchPackages();
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5 sm:mt-1 font-medium">
            Kelola daftar nominal Robux dan harga jual langsung dari database Neon PostgreSQL
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchPackages}
            className="p-2.5 rounded-2xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Add Nominal CTA Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Nominal</span>
          </button>
        </div>
      </div>

      {/* Grid Catalog of Robux Packages */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-3.5 sm:p-7 shadow-xs">
        {isLoading && packages.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A5B] font-bold text-sm">
            Memuat pricelist dari database...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {packages.map((pkg) => {
              const isPackageActive = pkg.isActive !== false;

              return (
                <div
                  key={pkg.id}
                  className={`relative p-3.5 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isPackageActive
                      ? "bg-[#FAF7F0]/60 border-[#F0E7D8] hover:border-[#C29841] hover:bg-[#FAF7F0]"
                      : "bg-[#F3F4F6]/60 border-[#E5E7EB] opacity-75"
                  }`}
                >
                  <div>
                    {/* Top Bar: Coin & Nominal + Status Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2.5 sm:mb-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FBF4E4] to-[#F3E7CA] border border-[#D9C6A3] flex items-center justify-center shrink-0 shadow-2xs">
                          <Image
                            src="/robux.webp"
                            alt="Robux"
                            width={26}
                            height={26}
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm sm:text-lg text-[#2B303A] tracking-tight">
                            {formatRobux(pkg.robux)}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-[#C29841]">
                            {formatRupiah(pkg.price)}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge (AKTIF / NONAKTIF) */}
                      <div>
                        {isPackageActive ? (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] uppercase tracking-wider">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] uppercase tracking-wider">
                            Nonaktif
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badges / Tags if any */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-2">
                      {pkg.isPromo && (
                        <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#E11D48] border border-[#FECACA]">
                          PROMO
                        </span>
                      )}
                      {pkg.isPopular && (
                        <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                          POPULAR
                        </span>
                      )}
                      {pkg.isSultan && (
                        <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-[#F5EDE0] text-[#A57E2F] border border-[#E6D7B9]">
                          SULTAN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions: Edit and Delete Buttons */}
                  <div className="pt-2.5 sm:pt-3 border-t border-[#EAE0D0] flex items-center justify-between mt-2">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7A5B]">
                      Instant Delivery
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(pkg)}
                        className="p-1.5 sm:p-2 rounded-xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#C29841] hover:border-[#C29841] transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Edit Nominal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-1.5 sm:p-2 rounded-xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#E11D48] hover:border-[#FECACA] hover:bg-[#FEF2F2] transition-all cursor-pointer shadow-2xs active:scale-95"
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
        )}
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
