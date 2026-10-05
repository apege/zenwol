import { Order } from "@/types";
export { formatRupiah, formatRobux } from "@/lib/formatters";

// Empty initial orders fallback (real data is fetched from Neon database API)
export const INITIAL_ORDERS: Order[] = [];
