"use client";

import React, { useState } from "react";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import DashboardView from "@/components/admin/DashboardView";
import OrderListView from "@/components/admin/OrderListView";
import OrderDetailView from "@/components/admin/OrderDetailView";
import PricelistView from "@/components/admin/PricelistView";
import CustomersView from "@/components/admin/CustomersView";
import BlacklistView from "@/components/admin/BlacklistView";
import TestimonialsView from "@/components/admin/TestimonialsView";
import PaymentHistoryView from "@/components/admin/PaymentHistoryView";
import StoreSettingsView from "@/components/admin/StoreSettingsView";
import { INITIAL_ORDERS } from "@/data/adminMock";
import { Order, OrderStatus } from "@/types";
import { Check, Info, X } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Order Counts for Badges (matching default design figures 73, 27, etc. or dynamic)
  const orderCounts = {
    masuk: orders.filter((o) => o.status === "menunggu_bayar").length || 73,
    diproses: orders.filter((o) => o.status === "diproses").length || 27,
    selesai: orders.filter((o) => o.status === "selesai").length,
    dibatalkan: orders.filter((o) => o.status === "dibatalkan").length,
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const statusLabels: Record<OrderStatus, string> = {
      menunggu_bayar: "Menunggu Pembayaran",
      diproses: "Sedang Diproses",
      selesai: "Selesai",
      dibatalkan: "Dibatalkan",
    };

    showToast(`Status pesanan #${orderId} diubah menjadi ${statusLabels[newStatus]}`);
  };

  // Save admin notes
  const handleSaveAdminNote = (orderId: string, note: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, adminNote: note } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, adminNote: note } : null));
    }

    showToast(`Catatan admin untuk order #${orderId} berhasil disimpan!`);
  };

  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Data pesanan berhasil diperbarui!");
    }, 800);
  };

  // Select order from list or dashboard
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tab change
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSelectedOrder(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Global search filtering
  const filteredOrdersBySearch = searchQuery.trim()
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.robloxUserId.includes(searchQuery)
      )
    : orders;

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#2B303A] flex flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        orderCounts={orderCounts}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={() => setShowLogoutModal(true)}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-[#2B303A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-slideUp">
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* If viewing single order detail */}
          {selectedOrder ? (
            <OrderDetailView
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateOrderStatus}
              onSaveAdminNote={handleSaveAdminNote}
            />
          ) : (
            <>
              {/* Tab Views */}
              {activeTab === "dashboard" && (
                <DashboardView
                  orders={filteredOrdersBySearch}
                  onSelectOrder={handleSelectOrder}
                  onNavigateTab={handleTabChange}
                />
              )}

              {(activeTab === "order_masuk" ||
                activeTab === "order_diproses" ||
                activeTab === "order_selesai" ||
                activeTab === "order_dibatalkan") && (
                <OrderListView
                  currentTab={activeTab}
                  orders={filteredOrdersBySearch}
                  onSelectOrder={handleSelectOrder}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onRefresh={handleRefresh}
                  isRefreshing={isRefreshing}
                />
              )}

              {activeTab === "pricelist" && <PricelistView />}

              {activeTab === "pelanggan" && (
                <CustomersView orders={filteredOrdersBySearch} />
              )}

              {activeTab === "blacklist" && <BlacklistView />}

              {activeTab === "testimoni" && <TestimonialsView />}

              {activeTab === "riwayat_pembayaran" && <PaymentHistoryView />}

              {activeTab === "pengaturan" && <StoreSettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-[#E8DEC9] shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#E11D48] flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-black text-[#2B303A]">
                Keluar dari Panel Admin?
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                Anda dapat login kembali sewaktu-waktu untuk mengelola pesanan Robux.
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E0D3BC] bg-[#FAF7F0] text-xs font-bold text-[#2B303A] hover:bg-[#F3EFE6] transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  showToast("Anda telah keluar dari panel admin.");
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-xs font-bold text-white transition-all cursor-pointer shadow-xs"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
