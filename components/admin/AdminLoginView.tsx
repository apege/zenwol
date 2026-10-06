"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, User, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

export default function AdminLoginView({ onLoginSuccess }: AdminLoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Silakan isi username dan password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Username atau password salah!");
        setIsLoading(false);
        return;
      }

      // Login berhasil
      onLoginSuccess();
    } catch (err) {
      console.error("Login request error:", err);
      setErrorMessage("Gagal terhubung ke server. Periksa koneksi Anda.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-[#C29841] selection:text-white">
      {/* Decorative background blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#EBDDBF]/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#E5D2A6]/40 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl border border-[#E8DEC9] rounded-3xl shadow-2xl p-7 sm:p-9 space-y-6 animate-scaleUp">
        {/* Brand / Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-[#C29841] to-[#EBDDBF] shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] overflow-hidden p-1 flex items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="Zenwol Logo"
                width={56}
                height={56}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2B303A] tracking-tight">
              Portal Admin <span className="text-[#C29841]">Zenwol</span>
            </h1>
            <p className="text-xs text-[#667085] mt-1">
              Masukkan kredensial administrator untuk mengakses panel kontrol toko.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626] mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B303A] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C29841]" />
              <span>Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin..."
                autoComplete="username"
                disabled={isLoading}
                className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-2.5 px-3.5 text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/40 focus:border-[#C29841] focus:bg-white transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2B303A] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C29841]" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                autoComplete="current-password"
                disabled={isLoading}
                className="w-full bg-[#FAF7F0] border border-[#E0D3BC] rounded-xl py-2.5 pl-3.5 pr-11 text-sm text-[#2B303A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#C29841]/40 focus:border-[#C29841] focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A5B] hover:text-[#2B303A] transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C29841] to-[#A88235] hover:from-[#B58C37] hover:to-[#96732B] text-white text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Card Footer: Back to store & Security info */}
        <div className="pt-3 border-t border-[#EAE0D0] flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7A5B] hover:text-[#2B303A] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Website Utama</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-[10px] text-[#A39B8B]">
            <ShieldCheck className="w-3 h-3 text-[#C29841]" />
            <span>Enkripsi Sesi Aman (HMAC SHA-256)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
