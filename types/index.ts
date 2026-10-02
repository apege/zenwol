export interface RobuxPackage {
  id: string;
  robux: number;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  isPopular?: boolean;
  isSultan?: boolean;
  tag?: string;
}

export interface CartItem {
  pkg: RobuxPackage;
  quantity: number;
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
}
