import React from "react";
import Image from "next/image";
import { ShoppingBag, X, Plus, Minus, Trash2, Zap, ArrowRight } from "lucide-react";
import { CartItem } from "@/types";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (pkgId: string, delta: number) => void;
  onRemoveItem: (pkgId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartModalProps) {
  if (!isOpen) return null;

  const totalRobux = cartItems.reduce((acc, item) => acc + item.pkg.robux * item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.pkg.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E6D7B9] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#FAF5EA] p-4 sm:p-5 border-b border-[#E8DEC9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C29841] text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#2B303A] text-sm sm:text-base leading-tight">
                Keranjang Pesanan ({totalQuantity} Item)
              </h3>
              <p className="text-[11px] sm:text-xs text-[#667085]">
                Daftar paket Robux yang siap di-checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-[#E0D3BC] flex items-center justify-center text-[#667085] hover:text-[#2B303A] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FCFAF5] border border-[#E8DEC9] flex items-center justify-center mx-auto text-[#C29841]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-[#2B303A] text-sm">Keranjang Masih Kosong</h4>
                <p className="text-xs text-[#667085] max-w-xs mx-auto">
                  Klik tombol <strong>+</strong> pada paket Robux di daftar pilihan untuk memasukkannya ke keranjang.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.pkg.id}
                  className="bg-[#FCFAF5] rounded-xl sm:rounded-2xl border border-[#E8DEC9] p-3 sm:p-3.5 flex items-center justify-between gap-3"
                >
                  {/* Item Info */}
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DEC9] p-1.5 flex items-center justify-center shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={26}
                        height={26}
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-xs sm:text-sm text-[#2B303A] truncate">
                          {item.pkg.robux.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] font-bold text-[#C29841]">Robux</span>
                      </div>
                      <div className="text-[11px] sm:text-xs font-extrabold text-[#C29841]">
                        Rp {(item.pkg.price * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controller & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-[#D9C6A3] bg-white rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.pkg.id, -1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#2B303A] hover:bg-[#FAF5EA] transition-colors cursor-pointer"
                        title="Kurangi"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 sm:w-7 text-center text-xs font-extrabold text-[#2B303A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.pkg.id, 1)}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[#2B303A] hover:bg-[#FAF5EA] transition-colors cursor-pointer"
                        title="Tambah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.pkg.id)}
                      className="p-1.5 text-[#98A2B3] hover:text-[#E11D48] transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  onClick={onClearCart}
                  className="text-[#98A2B3] hover:text-[#E11D48] font-bold transition-colors cursor-pointer"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Total & Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="bg-[#FAF7F0] p-4 sm:p-5 border-t border-[#E8DEC9] space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#667085]">
                <span>Total Robux:</span>
                <strong className="text-[#2B303A] font-bold">
                  {totalRobux.toLocaleString("id-ID")} Robux
                </strong>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="font-extrabold text-[#2B303A]">Total Pembayaran:</span>
                <span className="font-black text-[#C29841] text-base sm:text-lg">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#C29841] hover:bg-[#A57E2F] text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
            >
              <Zap className="w-4 h-4 fill-white" />
              Lanjut ke Pembayaran
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
