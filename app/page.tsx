"use client";

import React, { useState, useEffect } from "react";
import { RobuxPackage, CartItem, RobloxUserProfile, Testimonial } from "@/types";
import { CONTACT_INFO } from "@/data";

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

import { formatAdminReply } from "@/lib/formatters";

// Modals
import CartModal from "@/components/modals/CartModal";
import CheckoutModal from "@/components/modals/CheckoutModal";
import HowToOrderModal from "@/components/modals/HowToOrderModal";
import CSModal from "@/components/modals/CSModal";

const DEFAULT_PACKAGE: RobuxPackage = {
  id: "default",
  robux: 2200,
  price: 45000,
  isActive: true,
};

interface StoreSettingsState {
  store_name: string;
  whatsapp_number: string;
  promo_active?: boolean;
  promo_tag?: string;
  promo_badge?: string;
  promo_title?: string;
  promo_subtitle?: string;
  promo_robux_amount?: number;
  promo_discount_price?: number;
  promo_original_label?: string;
  promo_end_date?: string | null;
  qris_image_path?: string | null;
  logo_image_path?: string | null;
}

const SETTINGS_STORAGE_KEY = "zenwol_cached_store_settings";
const PACKAGES_STORAGE_KEY = "zenwol_cached_packages";

const getCachedStoreSettings = (): StoreSettingsState => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch {}
  }
  return {
    store_name: CONTACT_INFO.brandName || "Zenwol.id",
    whatsapp_number: CONTACT_INFO.whatsappNumber || "6281234567890",
    promo_active: true,
  };
};

const getCachedPackages = (): RobuxPackage[] => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(PACKAGES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return [];
};

const calculateTimeLeft = (endDateStr?: string | null) => {
  if (!endDateStr) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }
  const targetTime = new Date(endDateStr).getTime();
  if (isNaN(targetTime)) {
    return { days: "--", hours: "--", minutes: "--", seconds: "--" };
  }
  const difference = targetTime - Date.now();
  if (difference <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }
  const d = Math.floor(difference / (1000 * 60 * 60 * 24));
  const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((difference % (1000 * 60)) / 1000);
  return {
    days: d.toString().padStart(2, "0"),
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
};

export default function HomePage() {
  // Real Database States (No hardcoded dummy 2200 or 11:48:25 mock numbers!)
  const [packages, setPackages] = useState<RobuxPackage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettingsState>({
    store_name: CONTACT_INFO.brandName || "Zenwol.id",
    whatsapp_number: CONTACT_INFO.whatsappNumber || "6281234567890",
    promo_active: true,
  });

  // Countdown timer state: Clean placeholder, calculates live from promo_end_date
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  // User & Selection States
  const [username, setUsername] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<string | null>(null);
  const [robloxUser, setRobloxUser] = useState<RobloxUserProfile | null>(null);
  const [checkErrorMessage, setCheckErrorMessage] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(DEFAULT_PACKAGE);
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
  const [reviewToken, setReviewToken] = useState("");
  const [orderInvoiceId, setOrderInvoiceId] = useState("");

  // Toast message for cart actions
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const fetchTestimonials = () => {
    fetch("/api/testimonials?status=approved")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          interface TestimonialDB {
            id: number;
            name: string;
            message: string;
            rating: number;
            created_at: string;
            image_path?: string;
            admin_reply?: unknown;
          }
          const mapped: Testimonial[] = res.data.map((t: TestimonialDB) => ({
            id: String(t.id),
            username: t.name,
            avatarColor: "bg-[#C29841]",
            timeAgo: "Baru saja",
            rating: t.rating,
            comment: t.message,
            packagePurchased: "Robux Instant",
            hasProof: true,
            adminReply: formatAdminReply(t.admin_reply) || undefined,
          }));
          setTestimonials(mapped);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  };

  // Immediate Cache Hydration: restore saved store settings and packages on mount with 0ms delay!
  useEffect(() => {
    const cachedSettings = getCachedStoreSettings();
    if (cachedSettings.store_name || cachedSettings.promo_robux_amount) {
      setStoreSettings((prev) => ({ ...prev, ...cachedSettings }));
      if (cachedSettings.promo_end_date) {
        setTimeLeft(calculateTimeLeft(cachedSettings.promo_end_date));
      }
    }

    const cachedPkgs = getCachedPackages();
    if (cachedPkgs.length > 0) {
      setPackages(cachedPkgs);
      const targetRobux = cachedSettings.promo_robux_amount || cachedPkgs[0].robux;
      const matched = cachedPkgs.find((p) => p.robux === targetRobux) || cachedPkgs[0];
      setSelectedPackage(matched);
    }
  }, []);

  // Fetch real data from Neon APIs
  useEffect(() => {
    // 1. Fetch products
    fetch("/api/products?active_only=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          interface ProductDB {
            id: number;
            name: string;
            robux: number;
            price: number;
            is_active: boolean;
            image_path?: string;
          }
          const mapped: RobuxPackage[] = res.data.map((p: ProductDB) => ({
            id: String(p.id),
            robux: p.robux,
            price: Number(p.price),
            originalPrice: p.robux === 2200 ? 55000 : p.robux === 6800 ? 140000 : undefined,
            isPromo: p.robux === 2200 || p.robux === 6800,
            isPopular: p.robux === 2200 || p.robux === 2700 || p.robux === 3700 || p.robux === 5500,
            isSultan: p.robux >= 10000,
            isActive: p.is_active,
            tag: p.robux === 2200 ? "PROMO" : undefined,
          }));
          setPackages(mapped);
          try {
            localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(mapped));
          } catch {}
          const initialTargetRobux = storeSettings.promo_robux_amount || mapped[0]?.robux || 2200;
          const defaultPkg =
            mapped.find((p) => p.robux === initialTargetRobux) ||
            mapped.find((p) => p.robux === 2200) ||
            mapped[0];
          setSelectedPackage(defaultPkg);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));

    // 2. Fetch testimonials
    fetchTestimonials();

    // 3. Fetch store settings (Bypass Cloudflare/browser cache 100%)
    fetch(`/api/store-settings?_t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStoreSettings(res.data);
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(res.data));
          } catch {}
          if (res.data.promo_end_date) {
            setTimeLeft(calculateTimeLeft(res.data.promo_end_date));
          }
          if (res.data.promo_robux_amount) {
            const promoRobux = Number(res.data.promo_robux_amount);
            setPackages((prev) => {
              const matched = prev.find((p) => p.robux === promoRobux);
              if (matched) setSelectedPackage(matched);
              return prev;
            });
          }
        }
      })
      .catch((err) => console.error("Error fetching store settings:", err));

    // 4. Check URL parameters for review token
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("review") || urlParams.get("token") || urlParams.get("code");
      if (token) {
        setReviewToken(token.toUpperCase());
        setTimeout(() => {
          const el = document.getElementById("section-testimonials");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      }
    }
  }, []);

  // Timer effect (driven by promo_end_date from database)
  useEffect(() => {
    const endDate = storeSettings.promo_end_date;
    if (!endDate) return;

    const tick = () => {
      const calculated = calculateTimeLeft(endDate);
      setTimeLeft(calculated);
      if (
        calculated.days === "00" &&
        calculated.hours === "00" &&
        calculated.minutes === "00" &&
        calculated.seconds === "00"
      ) {
        return false;
      }
      return true;
    };

    if (!tick()) return;
    const interval = setInterval(() => {
      if (!tick()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [storeSettings.promo_end_date]);

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

    const newInvoice = `ZEN${Math.floor(10000000 + Math.random() * 90000000)}`;
    setOrderInvoiceId(newInvoice);
    setIsCheckoutOpen(true);
  };

  const promoTargetRobux = storeSettings.promo_robux_amount || 2200;
  const activePromoPackage =
    packages.find((p) => p.robux === promoTargetRobux) ||
    packages.find((p) => p.robux === 2200) ||
    selectedPackage;

  const displayPackages = React.useMemo(() => {
    const promoRobux = storeSettings.promo_robux_amount || 2200;
    return packages.map((pkg) => {
      const isTargetPromo = pkg.robux === promoRobux;
      return {
        ...pkg,
        isPromo: isTargetPromo || pkg.isPromo,
        tag: isTargetPromo ? (storeSettings.promo_badge || "PROMO") : pkg.tag,
      };
    });
  }, [packages, storeSettings.promo_robux_amount, storeSettings.promo_badge]);

  // Synchronize document title with store name
  useEffect(() => {
    if (typeof document !== "undefined" && storeSettings.store_name) {
      document.title = `${storeSettings.store_name} - Top Up Robux Resmi & Legal`;
    }
  }, [storeSettings.store_name]);

  return (
    <div className="relative min-h-screen bg-[#F8F5EE] text-[#1F242D] selection:bg-[#C29841] selection:text-white pb-28 sm:pb-36">
      {/* 1. Floating Aesthetic Particles */}
      <FloatingParticles />

      {/* 2. Top Navigation Bar with Cart Badge */}
      <Navbar
        storeName={storeSettings.store_name}
        onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
        onOpenCS={() => setIsCSModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        logoSrc={storeSettings.logo_image_path}
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
        {storeSettings.promo_active !== false && (
          <HeroPromo
            promoPackage={activePromoPackage}
            storeSettings={storeSettings}
            timeLeft={timeLeft}
            onSelectPromo={() => {
              setSelectedPackage(activePromoPackage);
              handleAddToCart(activePromoPackage);
            }}
          />
        )}

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
          packages={displayPackages.length > 0 ? displayPackages : [DEFAULT_PACKAGE]}
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
          testimonials={testimonials}
          onOpenCS={() => setIsCSModalOpen(true)}
          initialToken={reviewToken}
          onTestimonialSubmitted={fetchTestimonials}
        />

        {/* Footer */}
        <Footer
          storeName={storeSettings.store_name}
          logoSrc={storeSettings.logo_image_path}
          whatsappNumber={storeSettings.whatsapp_number || CONTACT_INFO.whatsappNumber}
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
        robloxUserId={robloxUser?.id}
        selectedPackage={selectedPackage}
        cartItems={cartItems}
        invoiceId={orderInvoiceId}
        qrisImage={storeSettings.qris_image_path}
        whatsappNumber={storeSettings.whatsapp_number || CONTACT_INFO.whatsappNumber}
        paymentMethod={paymentMethod}
      />

      <HowToOrderModal
        isOpen={isHowToOrderOpen}
        onClose={() => setIsHowToOrderOpen(false)}
      />

      <CSModal
        isOpen={isCSModalOpen}
        onClose={() => setIsCSModalOpen(false)}
        whatsappNumber={storeSettings.whatsapp_number || CONTACT_INFO.whatsappNumber}
        storeName={storeSettings.store_name}
      />
    </div>
  );
}
