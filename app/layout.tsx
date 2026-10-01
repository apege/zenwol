import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Zenwol.id - Top Up Robux Resmi, Cepat & Legal",
  description: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali di Zenwol.id.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} scroll-smooth`}>
      <body className="font-sans antialiased min-h-screen bg-[#F9F6F0] text-[#23272F] selection:bg-[#C29841] selection:text-white">
        {children}
      </body>
    </html>
  );
}
