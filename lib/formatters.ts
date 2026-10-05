export const formatRupiah = (num: number | string | null | undefined): string => {
  const n = typeof num === "number" ? num : Number(num || 0);
  return "Rp " + n.toLocaleString("id-ID");
};

export const formatRobux = (amount: number | string | null | undefined): string => {
  const n = typeof amount === "number" ? amount : Number(amount || 0);
  return n.toLocaleString("id-ID") + " Robux";
};

export const formatNumberWithDots = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined || val === "") return "";
  const numStr = val.toString().replace(/\D/g, "");
  if (!numStr) return "";
  return parseInt(numStr, 10).toLocaleString("id-ID");
};

export const formatAdminReply = (reply: unknown): string => {
  if (!reply && reply !== 0) return "";
  if (typeof reply === "string") {
    let current: unknown = reply.trim();
    while (typeof current === "string" && (current.startsWith("{") || current.startsWith("\""))) {
      try {
        current = JSON.parse(current);
      } catch {
        break;
      }
    }
    if (typeof current === "string") return current;
    if (current && typeof current === "object") {
      const obj = current as Record<string, unknown>;
      return String(obj.reply || obj.message || obj.text || Object.values(obj)[0] || "");
    }
    return String(current || "");
  }
  if (typeof reply === "object" && reply !== null) {
    const obj = reply as Record<string, unknown>;
    return String(obj.reply || obj.message || obj.text || Object.values(obj)[0] || "");
  }
  return String(reply);
};


