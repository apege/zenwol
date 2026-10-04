"use client";

import React, { useState, useEffect } from "react";
import { RobuxPackage, CartItem, RobloxUserProfile } from "@/types";
import { ROBUX_PACKAGES, TESTIMONIALS, CONTACT_INFO } from "@/data";

// Modular Components
import FloatingParticles from "@/components/FloatingParticles";
import Navbar from "@/components/Navbar";
import HeroPromo from "@/components/HeroPromo";
import FeatureStrip from "@/components/FeatureStrip";
import StepAccount from "@/components/StepAccount";
import StepPackages from "@/components/StepPackages";
import StepPayment from "@/components/StepPayment";
import TransactionFlow from "@/components/TransactionFlow";
import TestimonialSection from "@/components/TestimonialSection";
import StickyBottomBar from "@/components/StickyBottomBar";
import Footer from "@/components/Footer";

// Modals
import CartModal from "@/components/modals/CartModal";
import CheckoutModal from "@/components/modals/CheckoutModal";
import HowToOrderModal from "@/components/modals/HowToOrderModal";
import CSModal from "@/components/modals/CSModal";

export default function HomePage() {
  // User & Selection States
  const [username, setUsername] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<string | null>(null);
  const [robloxUser, setRobloxUser] = useState<RobloxUserProfile | null>(null);
  const [checkErrorMessage, setCheckErrorMessage] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(ROBUX_PACKAGES[1]); // Default to 2.200 Robux Promo
  const [filterCategory, setFilterCategory] = useState<"all" | "popular" | "promo" | "sultan">("all");
  const [paymentMethod, setPaymentMethod] = useState<"website" | "whatsapp">("website");
  
  // Cart State (Multiple packages support)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false);
  const [isCSModalOpen, setIsCSModalOpen] = useState(false);
  const [orderInvoiceId, setOrderInvoiceId] = useState("");

  // Toast message for cart actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "11",
    minutes: "48",
    seconds: "25",
  });

  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + 11);
    target.setMinutes(target.getMinutes() + 48);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d.toString().padStart(2, "0"),
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cart Handlers
  const handleAddToCart = (pkg: RobuxPackage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedPackage(pkg);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.pkg.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.pkg.id === pkg.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { pkg, quantity: 1 }];
    });
    showToast(`+${pkg.robux.toLocaleString("id-ID")} Robux masuk keranjang`);
  };

  const handleUpdateQuantity = (pkgId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.pkg.id === pkgId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (pkgId: string) => {
    setCartItems((prev) => prev.filter((item) => item.pkg.id !== pkgId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckAccount = async () => {
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setCheckErrorMessage("Silakan masukkan username Roblox kamu terlebih dahulu!");
      setRobloxUser(null);
      setVerifiedUser(null);
      return;
    }

    setIsCheckingUser(true);
    setCheckErrorMessage(null);

    try {
      const res = await fetch("/api/roblox/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername }),
      });
      const result = await res.json();

      if (result.success && result.found && result.data) {
        setRobloxUser(result.data);
        setUsername(result.data.name);
        setVerifiedUser(result.data.name);
        setCheckErrorMessage(null);
      } else {
        setRobloxUser(null);
        setVerifiedUser(null);
        setCheckErrorMessage(result.message || "Username Roblox tidak ditemukan. Pastikan ejaan sudah benar.");
      }
    } catch {
      setRobloxUser(null);
      setVerifiedUser(null);
      setCheckErrorMessage("Gagal menghubungkan ke server Roblox API. Silakan periksa koneksi internet Anda.");
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handleOpenCheckout = () => {
    if (!username.trim()) {
      const element = document.getElementById("step-account");
      element?.scrollIntoView({ behavior: "smooth" });
      alert("Silakan masukkan username Roblox Anda pada Langkah 1 terlebih dahulu!");
      return;
    }

    // Determine what packages to checkout (cart or selected)
    const itemsToOrder = cartItems.length > 0 ? cartItems : [{ pkg: selectedPackage, quantity: 1 }];
    const totalRobux = itemsToOrder.reduce((acc, it) => acc + it.pkg.robux * it.quantity, 0);
    const totalPrice = itemsToOrder.reduce((acc, it) => acc + it.pkg.price * it.quantity, 0);

    if (paymentMethod === "whatsapp") {
      const invoice = `ZW-${Math.floor(100000 + Math.random() * 900000)}`;
      const summaryList = itemsToOrder
        .map((it) => `- ${it.pkg.robux.toLocaleString("id-ID")} Robux x ${it.quantity} (Rp ${(it.pkg.price * it.quantity).toLocaleString("id-ID")})`)
        .join("\n");

      const message = `Halo Admin Zenwol.id! 👋\n\nSaya ingin melakukan Top Up Robux dengan rincian:\n- *Invoice*: ${invoice}\n- *Username Roblox*: ${username}\n- *Daftar Paket*:\n${summaryList}\n- *Total Robux*: ${totalRobux.toLocaleString("id-ID")} Robux\n- *Total Harga*: Rp ${totalPrice.toLocaleString("id-ID")}\n- *Metode*: Pembayaran via WhatsApp\n\nMohon bantuannya untuk proses pembayarannya min. Terima kasih!`;
      window.open(`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
      return;
    }

    const newInvoice = `ZW-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderInvoiceId(newInvoice);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F8F5EE] text-[#1F242D] selection:bg-[#C29841] selection:text-white pb-28 sm:pb-36">
      {/* 1. Floating Aesthetic Particles */}
      <FloatingParticles />

      {/* 2. Top Navigation Bar with Cart Badge */}
      <Navbar
        onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
        onOpenCS={() => setIsCSModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 sm:top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1F242D]/95 backdrop-blur-md text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2.5 border border-[#C29841]/50 animate-fadeIn max-w-[92vw] whitespace-nowrap">
          <div className="w-5 h-5 rounded-full bg-[#C29841] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <span className="text-[10px] font-black">✓</span>
          </div>
          <span className="text-xs text-[#FCFAF5] font-extrabold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="bg-[#C29841] hover:bg-[#A57E2F] text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black shrink-0 transition-all cursor-pointer shadow-2xs active:scale-95 ml-1"
          >
            Lihat
          </button>
        </div>
      )}

      {/* 3. Main Sections */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-4 sm:space-y-8 relative z-10">
        {/* Section: Hero Promo Card with Countdown */}
        <HeroPromo
          promoPackage={ROBUX_PACKAGES[1]}
          timeLeft={timeLeft}
          onSelectPromo={() => {
            setSelectedPackage(ROBUX_PACKAGES[1]);
            handleAddToCart(ROBUX_PACKAGES[1]);
          }}
        />

        {/* Section: 5 USP Feature Strip */}
        <FeatureStrip />

        {/* Section: Step 1 - Masukkan Data Akun */}
        <StepAccount
          username={username}
          onChangeUsername={(val) => {
            setUsername(val);
            if (verifiedUser || robloxUser) {
              setVerifiedUser(null);
              setRobloxUser(null);
            }
            if (checkErrorMessage) setCheckErrorMessage(null);
          }}
          robloxUser={robloxUser}
          errorMessage={checkErrorMessage}
          isCheckingUser={isCheckingUser}
          onCheckAccount={handleCheckAccount}
        />

        {/* Section: Step 2 - Pilih Robux */}
        <StepPackages
          packages={ROBUX_PACKAGES}
          selectedPackage={selectedPackage}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          filterCategory={filterCategory}
          onFilterChange={(cat) => setFilterCategory(cat)}
        />

        {/* Section: Step 3 - Pilih Pembayaran */}
        <StepPayment
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={(m) => setPaymentMethod(m)}
        />

        {/* Section: Alur Transaksi Top Up Praktis */}
        <TransactionFlow />

        {/* Section: Testimoni Member */}
        <TestimonialSection
          testimonials={TESTIMONIALS}
          onOpenCS={() => setIsCSModalOpen(true)}
        />

        {/* Footer */}
        <Footer
          onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
          onOpenCS={() => setIsCSModalOpen(true)}
        />
      </main>

      {/* 4. Sticky Bottom Action Bar */}
      <StickyBottomBar
        selectedPackage={selectedPackage}
        cartItems={cartItems}
        onOpenCheckout={handleOpenCheckout}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 5. Interactive Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        username={username}
        selectedPackage={selectedPackage}
        cartItems={cartItems}
        invoiceId={orderInvoiceId}
        whatsappNumber={CONTACT_INFO.whatsappNumber}
      />

      <HowToOrderModal
        isOpen={isHowToOrderOpen}
        onClose={() => setIsHowToOrderOpen(false)}
      />

      <CSModal
        isOpen={isCSModalOpen}
        onClose={() => setIsCSModalOpen(false)}
        whatsappNumber={CONTACT_INFO.whatsappNumber}
      />
    </div>
  );
}
