"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  RotateCw,
  Search,
  Plus,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit2,
  Reply,
  Trash2,
  MessageSquareQuote,
  MessageSquare,
} from "lucide-react";
import AddTestimonialModal, { TestimonialData } from "./AddTestimonialModal";
import { formatAdminReply } from "@/lib/formatters";

interface DBTestimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  image_path?: string | null;
  status: string;
  order_code?: string | null;
  admin_reply?: unknown;
  created_at: string;
}

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"semua" | "aktif" | "sembunyi" | "perlu_balas">("semua");
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialData | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: TestimonialData[] = data.data.map((t: DBTestimonial) => ({
          id: String(t.id),
          username: t.name,
          rating: t.rating,
          comment: t.message,
          packagePurchased: "Robux Instant",
          isVerified: true,
          isActive: t.status === "approved",
          timeAgo: "Baru saja",
          adminReply: formatAdminReply(t.admin_reply) || undefined,
        }));
        setTestimonials(mapped);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTestimonials();
    setIsRefreshing(false);
  };

  const handleToggleVisibility = async (id?: string) => {
    if (!id) return;
    const current = testimonials.find((t) => t.id === id);
    if (!current) return;
    const newStatus = current.isActive ? "pending" : "approved";

    // Optimistic UI update
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );

    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Error toggling testimonial:", err);
      fetchTestimonials();
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm("Apakah Anda yakin ingin menghapus testimoni ini dari database?")) {
      try {
        const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (err) {
        console.error("Error deleting testimonial:", err);
      }
    }
  };

  const handleSaveReply = async (id: string) => {
    const replyVal = replyText.trim() || null;
    const payload = replyVal ? { reply: replyVal } : null;

    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, adminReply: replyVal || undefined } : t))
    );
    setReplyingId(null);
    setReplyText("");

    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_reply: payload }),
      });
    } catch (err) {
      console.error("Error saving admin reply:", err);
    }
  };

  const handleSaveTestimonial = async (data: TestimonialData) => {
    try {
      if (data.id) {
        // Edit existing
        await fetch(`/api/testimonials/${data.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username,
            message: data.comment,
            rating: data.rating,
            status: data.isActive !== false ? "approved" : "pending",
          }),
        });
      } else {
        // Create new
        await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username,
            message: data.comment,
            rating: data.rating,
            status: data.isActive !== false ? "approved" : "pending",
          }),
        });
      }
      await fetchTestimonials();
    } catch (err) {
      console.error("Error saving testimonial:", err);
    }
  };

  // Stat counts
  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.isActive !== false).length;
  const hiddenCount = testimonials.filter((t) => t.isActive === false).length;
  const needReplyCount = testimonials.filter((t) => !t.adminReply).length;

  const avgRating = totalCount
    ? (
        testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalCount
      ).toFixed(1)
    : "5.0";

  // Filtered List
  const filteredList = testimonials.filter((t) => {
    if (activeTab === "aktif" && t.isActive === false) return false;
    if (activeTab === "sembunyi" && t.isActive !== false) return false;
    if (activeTab === "perlu_balas" && !!t.adminReply) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.username.toLowerCase().includes(q) ||
      t.comment.toLowerCase().includes(q) ||
      t.packagePurchased.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-[#2B303A] tracking-tight">
            Kelola Testimoni & Ulasan
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5 sm:mt-1 font-medium">
            Moderasi ulasan pembeli langsung dari database Neon PostgreSQL
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 self-start sm:self-auto">
          {/* Tambah Testimoni Button */}
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#C29841] to-[#A57E2F] hover:from-[#B38933] hover:to-[#916E25] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C29841]/25 hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Testimoni</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white border border-[#E0D3BC] hover:border-[#C29841] text-[#2B303A] hover:text-[#C29841] text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RotateCw
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C29841] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span className="hidden xs:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards (2-Col on Mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border border-[#E8DEC9] rounded-2xl p-3.5 sm:p-5 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase mb-1 sm:mb-2 truncate">
            Total Ulasan
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#2B303A]">{totalCount}</div>
        </div>

        <div className="bg-white border border-[#E8DEC9] rounded-2xl p-3.5 sm:p-5 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase mb-1 sm:mb-2 truncate">
            Rating Rata-Rata
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#F59E0B] flex items-center gap-1">
            {avgRating} <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F59E0B] text-[#F59E0B]" />
          </div>
        </div>

        <div className="bg-white border border-[#E8DEC9] rounded-2xl p-3.5 sm:p-5 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase mb-1 sm:mb-2 truncate">
            Aktif (Tampil)
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#059669]">{activeCount}</div>
        </div>

        <div className="bg-white border border-[#E8DEC9] rounded-2xl p-3.5 sm:p-5 shadow-2xs">
          <div className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#8C7A5B] uppercase mb-1 sm:mb-2 truncate">
            Perlu Balasan
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#E11D48]">{needReplyCount}</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#E8DEC9] rounded-3xl p-3.5 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#F0E7D8]">
          {/* Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveTab("semua")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "semua"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("aktif")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "aktif"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Aktif ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab("sembunyi")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "sembunyi"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Disembunyikan ({hiddenCount})
            </button>
            <button
              onClick={() => setActiveTab("perlu_balas")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "perlu_balas"
                  ? "bg-[#C29841] text-white shadow-xs"
                  : "bg-[#FAF7F0] border border-[#E0D3BC] text-[#667085] hover:text-[#2B303A]"
              }`}
            >
              Perlu Balasan ({needReplyCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A5B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari username atau ulasan..."
              className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-full py-2 pl-9 pr-3 text-xs sm:text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30 focus:border-[#C29841] transition-all"
            />
          </div>
        </div>

        {/* Testimonials List */}
        {isLoading && testimonials.length === 0 ? (
          <div className="py-12 text-center text-[#8C7A5B] font-bold text-sm">
            Memuat ulasan dari database...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 sm:py-16 text-center text-[#8C7A5B]">
            <MessageSquareQuote className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[#D9C6A3] mb-3 stroke-[1.5]" />
            <div className="text-sm sm:text-base font-extrabold text-[#2B303A]">
              Tidak ada ulasan ditemukan
            </div>
            <p className="text-xs text-[#667085] mt-1">
              Tidak ada ulasan yang sesuai dengan filter atau kata kunci pencarian.
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredList.map((item) => {
              const isVisible = item.isActive !== false;
              const initial = item.username.charAt(0).toUpperCase();

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                    isVisible
                      ? "bg-white border-[#F0E7D8] hover:border-[#C29841]"
                      : "bg-[#F9FAFB] border-[#E5E7EB] opacity-70"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
                    {/* Left: Avatar + Details */}
                    <div className="flex items-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                      {/* Avatar Circle */}
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#C29841] to-[#E6D7B9] text-white flex items-center justify-center font-black text-sm sm:text-base shrink-0 shadow-2xs">
                        {initial}
                      </div>

                      <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                        {/* Username & Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="font-black text-sm sm:text-base text-[#2B303A] truncate">
                            @{item.username}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                            <CheckCircle2 className="w-3 h-3" />
                            Terverifikasi
                          </span>

                          <span className="text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FBF4E4] text-[#A57E2F] border border-[#E6D7B9]">
                            {item.packagePurchased}
                          </span>
                        </div>

                        {/* Stars & Time */}
                        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#8C7A5B]">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                  star <= item.rating
                                    ? "fill-[#F59E0B] text-[#F59E0B]"
                                    : "text-[#D1D5DB]"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="font-semibold">{item.timeAgo || "Baru saja"}</span>
                        </div>

                        {/* Comment */}
                        <p className="text-xs sm:text-sm text-[#2B303A] font-medium leading-relaxed pt-0.5 sm:pt-1">
                          “{item.comment}”
                        </p>

                        {/* Admin Reply if exists */}
                        {item.adminReply && (
                          <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-[#FAF7F0] border border-[#E8DEC9] text-xs space-y-0.5">
                            <div className="font-black text-[#A57E2F] flex items-center gap-1 text-[11px] sm:text-xs">
                              <MessageSquare className="w-3.5 h-3.5" />
                              Balasan Admin:
                            </div>
                            <p className="text-[#4A5568] text-[11px] sm:text-xs">{item.adminReply}</p>
                          </div>
                        )}

                        {/* Inline Reply Input */}
                        {replyingId === item.id && (
                          <div className="mt-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#FAF7F0] border border-[#E0D3BC] space-y-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Tulis balasan untuk ulasan ini..."
                              className="w-full bg-white border border-[#E0D3BC] rounded-xl py-1.5 px-2.5 text-xs text-[#2B303A] focus:outline-none focus:ring-2 focus:ring-[#C29841]/30"
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setReplyingId(null);
                                  setReplyText("");
                                }}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#667085] hover:bg-[#F3EFE6]"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleSaveReply(item.id!)}
                                className="px-3 py-1 rounded-lg bg-[#C29841] hover:bg-[#A57E2F] text-white text-xs font-bold shadow-2xs"
                              >
                                Kirim Balasan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end md:self-start pt-1 md:pt-0">
                      {/* Tampil / Sembunyikan Toggle Button */}
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                          isVisible
                            ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#059669] hover:bg-[#D1FAE5]"
                            : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#E5E7EB]"
                        }`}
                        title={isVisible ? "Sembunyikan dari web" : "Tampilkan di web"}
                      >
                        {isVisible ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Tampil</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Sembunyi</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white border border-[#E0D3BC] text-[#667085] hover:text-[#C29841] hover:border-[#C29841] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Balas Button */}
                      <button
                        onClick={() => {
                          setReplyingId(item.id!);
                          setReplyText(item.adminReply || "");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#FBF4E4] border border-[#E6D7B9] text-[#A57E2F] hover:bg-[#F5EDE0] text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Balas</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 sm:p-1.5 rounded-xl bg-white border border-[#E0D3BC] text-[#8C7A5B] hover:text-[#E11D48] hover:border-[#FECACA] hover:bg-[#FEF2F2] transition-all cursor-pointer shadow-2xs active:scale-95"
                        title="Hapus Testimoni"
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

      {/* Add / Edit Testimonial Modal */}
      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTestimonial}
        editingItem={editingItem}
      />
    </div>
  );
}
