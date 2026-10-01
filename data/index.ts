import { RobuxPackage, Testimonial } from "@/types";

export const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: "p1", robux: 1800, price: 35000, isPopular: false },
  { id: "p2", robux: 2200, price: 45000, originalPrice: 55000, isPromo: true, isPopular: true, tag: "PROMO" },
  { id: "p3", robux: 2700, price: 50000, isPopular: true },
  { id: "p4", robux: 3200, price: 60000, isPopular: false },
  { id: "p5", robux: 3700, price: 70000, isPopular: true },
  { id: "p6", robux: 4200, price: 80000, isPopular: false },
  { id: "p7", robux: 4700, price: 90000, isPopular: false },
  { id: "p8", robux: 5500, price: 100000, isPopular: true },
  { id: "p9", robux: 6800, price: 125000, originalPrice: 140000, isPromo: true, tag: "PROMO" },
  { id: "p10", robux: 10000, price: 180000, isSultan: true },
  { id: "p11", robux: 15000, price: 270000, isSultan: true },
  { id: "p12", robux: 20000, price: 355000, isSultan: true },
  { id: "p13", robux: 30000, price: 530000, isSultan: true },
  { id: "p14", robux: 50000, price: 880000, isSultan: true },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    username: "londoireng61",
    avatarColor: "bg-[#2B303A]",
    timeAgo: "Baru saja",
    rating: 4,
    comment: "Sedikit slowrespon ehee overall semuanya aman kok, robuxnya langsung mendarat mulus!",
    packagePurchased: "4.200 Robux",
    hasProof: true,
  },
  {
    id: "t2",
    username: "Crasiel17",
    avatarColor: "bg-[#C29841]",
    timeAgo: "10 menit yang lalu",
    rating: 5,
    comment: "Mantap banget Zenwol.id! Proses cuma 5 menitan langsung masuk pending robux. Bakal langganan terus di sini.",
    packagePurchased: "2.200 Robux",
    hasProof: true,
  },
  {
    id: "t3",
    username: "FarisGamerID",
    avatarColor: "bg-[#3F4856]",
    timeAgo: "25 menit yang lalu",
    rating: 5,
    comment: "Awalnya ragu karena baru pertama kali, pas coba paket sultan 10.000 Robux ternyata beneran aman dan terbukti legal!",
    packagePurchased: "10.000 Robux",
    hasProof: true,
  },
  {
    id: "t4",
    username: "BagasRoblox_99",
    avatarColor: "bg-[#A57E2F]",
    timeAgo: "1 jam yang lalu",
    rating: 5,
    comment: "Harga paling murah dibanding toko sebelah, CS ramah banget waktu nanya alur pembelian via QRIS.",
    packagePurchased: "5.500 Robux",
    hasProof: true,
  },
  {
    id: "t5",
    username: "Nayla_Sky",
    avatarColor: "bg-[#4A5568]",
    timeAgo: "2 jam yang lalu",
    rating: 5,
    comment: "Top markotop! Tanpa ribet kasih password, cukup username langsung diproses kilat. Makasih Zenwol!",
    packagePurchased: "2.700 Robux",
    hasProof: true,
  }
];

export const CONTACT_INFO = {
  whatsappNumber: "6281234567890",
  brandName: "Zenwol.id",
  tagline: "Top Up Robux Resmi & Legal",
};
