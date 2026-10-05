"use client";

import React, { useState, useEffect } from "react";
import { X, Star, MessageSquareQuote } from "lucide-react";
import { formatRobux } from "@/lib/formatters";

interface ProductOption {
  id: number;
  name: string;
  robux: number;
  price: number;
}

export interface TestimonialData {
  id?: string;
  username: string;
  rating: number;
  comment: string;
  packagePurchased: string;
  isVerified?: boolean;
  isActive?: boolean;
  adminReply?: string;
  timeAgo?: string;
}

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TestimonialData) => void;
  editingItem?: TestimonialData | null;
}

export default function AddTestimonialModal({
  isOpen,
  onClose,
  onSave,
  editingItem,
}: AddTestimonialModalProps) {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("2.200 Robux");
  const [adminReply, setAdminReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
          if (data.data.length > 0 && !editingItem) {
            setSelectedPackage(formatRobux(data.data[0].robux));
          }
        }
      })
      .catch((err) => console.error("Error loading products for modal:", err));
  }, [editingItem]);

  useEffect(() => {
    if (editingItem) {
      setUsername(editingItem.username);
      setRating(editingItem.rating || 5);
      setComment(editingItem.comment);
      setSelectedPackage(editingItem.packagePurchased || "2.200 Robux");
      setAdminReply(editingItem.adminReply || "");
    } else {
      setUsername("");
      setRating(5);
      setComment("");
      setAdminReply("");
    }
    setError(null);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Silakan masukkan username Roblox pembeli.");
      return;
    }
    if (!comment.trim()) {
      setError("Silakan tuliskan isi ulasan testimoni.");
      return;
    }

    onSave({
      id: editingItem ? editingItem.id : undefined,
      username: username.replace(/^@/, "").trim(),
      rating,
      comment: comment.trim(),
      packagePurchased: selectedPackage,
      adminReply: adminReply.trim() || undefined,
      isVerified: true,
      isActive: true,
      timeAgo: editingItem?.timeAgo || "Baru saja",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8DEC9] space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header (Matching Reference Image 2) */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E7D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] flex items-center justify-center text-[#C29841]">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#2B303A] tracking-tight">
              {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
            </h2>
          </div>
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Username Roblox */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Username Roblox <span className="text-[#E11D48]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#C29841]">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: APG_Channel11"
                className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 pl-9 pr-4 text-xs sm:text-sm font-bold text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
                required
              />
            </div>
          </div>

          {/* Field 2: Rating Kepuasan */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Rating Kepuasan (1 - 5 Bintang)
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#E0D3BC]">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-[#F59E0B] text-[#F59E0B]"
                          : "text-[#D1D5DB]"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-black text-[#A57E2F] ml-2">
                {rating} Bintang
              </span>
            </div>
          </div>

          {/* Field 3: Isi Ulasan Testimoni */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Isi Ulasan Testimoni <span className="text-[#E11D48]">*</span>
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tuliskan pengalaman / ulasan kepuasan pembeli..."
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl p-3.5 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all resize-none"
              required
            />
          </div>

          {/* Field 4: Paket Robux */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Paket Robux (Opsional)
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all cursor-pointer"
            >
              {products.length > 0 ? (
                products.map((pkg) => (
                  <option key={pkg.id} value={formatRobux(pkg.robux)}>
                    {formatRobux(pkg.robux)} - Rp {Number(pkg.price).toLocaleString("id-ID")}
                  </option>
                ))
              ) : (
                <option value="Robux Instant">Robux Instant</option>
              )}
            </select>
          </div>

          {/* Field 5: Balasan Admin (Opsional) */}
          <div>
            <label className="block text-xs font-extrabold text-[#2B303A] mb-1.5">
              Balasan Admin (Opsional)
            </label>
            <input
              type="text"
              value={adminReply}
              onChange={(e) => setAdminReply(e.target.value)}
              placeholder="Terima kasih kak sudah langganan di Zenwol.id!"
              className="w-full bg-white border border-[#E0D3BC] rounded-2xl py-3 px-4 text-xs sm:text-sm font-medium text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>

          {/* Action Buttons */}
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
              {editingItem ? "Simpan Perubahan" : "Tambah Testimoni"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
