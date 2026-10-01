"use client";

import React, { useState, useEffect } from "react";
import { RobuxPackage } from "@/types";
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
import CheckoutModal from "@/components/modals/CheckoutModal";
import HowToOrderModal from "@/components/modals/HowToOrderModal";
import CSModal from "@/components/modals/CSModal";

export default function HomePage() {
  // States
  const [username, setUsername] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<string | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<RobuxPackage>(ROBUX_PACKAGES[1]); // Default to 2.200 Robux Promo
  const [filterCategory, setFilterCategory] = useState<"all" | "popular" | "promo" | "sultan">("all");
  const [paymentMethod, setPaymentMethod] = useState<"website" | "whatsapp">("website");
  
  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false);
  const [isCSModalOpen, setIsCSModalOpen] = useState(false);
  const [orderInvoiceId, setOrderInvoiceId] = useState("");

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

  const handleCheckAccount = () => {
    if (!username.trim()) {
      alert("Silakan masukkan username Roblox kamu terlebih dahulu!");
      return;
    }
    setIsCheckingUser(true);
    setTimeout(() => {
      setIsCheckingUser(false);
      setVerifiedUser(username.trim());
    }, 600);
  };

  const handleOpenCheckout = () => {
    if (!username.trim()) {
      const element = document.getElementById("step-account");
      element?.scrollIntoView({ behavior: "smooth" });
      alert("Silakan masukkan username Roblox Anda pada Langkah 1 terlebih dahulu!");
      return;
    }

    if (paymentMethod === "whatsapp") {
      const invoice = `ZW-${Math.floor(100000 + Math.random() * 900000)}`;
      const message = `Halo Admin Zenwol.id! 👋\n\nSaya ingin melakukan Top Up Robux dengan rincian:\n- *Invoice*: ${invoice}\n- *Username Roblox*: ${username}\n- *Paket Robux*: ${selectedPackage.robux.toLocaleString("id-ID")} Robux\n- *Total Harga*: Rp ${selectedPackage.price.toLocaleString("id-ID")}\n- *Metode*: Pembayaran via WhatsApp\n\nMohon bantuannya untuk proses pembayarannya min. Terima kasih!`;
      window.open(`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
      return;
    }

    const newInvoice = `ZW-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderInvoiceId(newInvoice);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F8F5EE] text-[#1F242D] selection:bg-[#C29841] selection:text-white pb-32">
      {/* 1. Floating Aesthetic Particles */}
      <FloatingParticles />

      {/* 2. Top Navigation Bar */}
      <Navbar
        onOpenHowToOrder={() => setIsHowToOrderOpen(true)}
        onOpenCS={() => setIsCSModalOpen(true)}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 3. Main Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 relative z-10">
        {/* Section: Hero Promo Card with Countdown */}
        <HeroPromo
          promoPackage={ROBUX_PACKAGES[1]}
          timeLeft={timeLeft}
          onSelectPromo={() => setSelectedPackage(ROBUX_PACKAGES[1])}
        />

        {/* Section: 5 USP Feature Strip */}
        <FeatureStrip />

        {/* Section: Step 1 - Masukkan Data Akun */}
        <StepAccount
          username={username}
          onChangeUsername={(val) => {
            setUsername(val);
            if (verifiedUser) setVerifiedUser(null);
          }}
          verifiedUser={verifiedUser}
          isCheckingUser={isCheckingUser}
          onCheckAccount={handleCheckAccount}
        />

        {/* Section: Step 2 - Pilih Robux */}
        <StepPackages
          packages={ROBUX_PACKAGES}
          selectedPackage={selectedPackage}
          onSelectPackage={(pkg) => setSelectedPackage(pkg)}
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
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 5. Interactive Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        username={username}
        selectedPackage={selectedPackage}
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
