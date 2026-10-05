export interface RobuxPackage {
  id: string;
  robux: number;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  isPopular?: boolean;
  isSultan?: boolean;
  isActive?: boolean;
  tag?: string;
}

export interface CartItem {
  pkg: RobuxPackage;
  quantity: number;
}

export interface RobloxUserProfile {
  id: number;
  name: string;
  displayName: string;
  hasVerifiedBadge: boolean;
  avatarUrl: string;
  profileUrl: string;
}

export interface Testimonial {
  id: string;
  username: string;
  avatarColor: string;
  timeAgo: string;
  rating: number;
  comment: string;
  packagePurchased: string;
  hasProof: boolean;
  proofImage?: string;
  adminReply?: string;
}

export type OrderStatus = "menunggu_bayar" | "diproses" | "selesai" | "dibatalkan";

export interface Order {
  id: string; // e.g. "ZEN78158562"
  username: string; // e.g. "n5xqpb91"
  robloxUserId: string; // e.g. "10703270514"
  whatsappNumber: string; // e.g. "6285828378025"
  robuxAmount: number; // e.g. 1800
  price: number; // e.g. 35000
  paymentMethod: "WHATSAPP" | "QRIS" | "BCA" | "MANDIRI" | "DANA" | "OVO" | "GOPAY";
  status: OrderStatus;
  date: string; // e.g. "1 Okt 2026"
  time: string; // e.g. "11.09"
  fullDateTime: string; // e.g. "1 Oktober 2026 pukul 11.09 WIB"
  hasProof: boolean;
  proofImage?: string;
  customerNote?: string;
  adminNote?: string;
  gamepassLink?: string;
}
