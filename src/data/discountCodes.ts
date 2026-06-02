export interface DiscountCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
}

export const DISCOUNT_CODES: DiscountCode[] = [
  { code: "WELCOME10", type: "percent", value: 10, description: "10% off on your first order" },
  { code: "SAVE20",    type: "percent", value: 20, description: "20% off sitewide" },
  { code: "EID50",     type: "fixed",   value: 500, description: "Rs. 500 off on Eid special" },
  { code: "FREESHIP",  type: "fixed",   value: 200, description: "Free shipping on any order" },
];

export function applyDiscount(code: string, subtotal: number): { discount: number; description: string } | null {
  const found = DISCOUNT_CODES.find((c) => c.code === code.toUpperCase().trim());
  if (!found) return null;

  const discount = found.type === "percent"
    ? Math.round((subtotal * found.value) / 100)
    : Math.min(found.value, subtotal);

  return { discount, description: found.description };
}
