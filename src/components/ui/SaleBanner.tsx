"use client";

import { useState } from "react";
import { X, Tag } from "lucide-react";

export default function SaleBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-rose-600 text-white text-xs sm:text-sm py-2 sm:py-2.5 px-8 sm:px-4 flex items-center justify-center gap-2 sm:gap-3 relative">
      <Tag size={13} className="shrink-0 hidden xs:block" />
      <p className="text-center leading-snug">
        <span className="font-bold">EID SALE — Up to 50% OFF!</span>
        <span className="hidden sm:inline"> Use code </span>
        <span className="bg-white text-rose-600 font-bold px-1.5 sm:px-2 py-0.5 rounded-md mx-0.5 sm:mx-1 text-xs">EID50</span>
        <span className="hidden sm:inline">or <span className="bg-white text-rose-600 font-bold px-2 py-0.5 rounded-md mx-1 text-xs">SAVE20</span> at checkout</span>
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
