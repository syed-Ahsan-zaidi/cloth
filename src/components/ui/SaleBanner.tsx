"use client";

import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";

export default function SaleBanner() {
  const [banner, setBanner] = useState<{ text: string; bgColor: string } | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch("/api/banner")
      .then((r) => r.json())
      .then((data) => {
        if (data?.active && data?.text) setBanner(data);
      })
      .catch(() => {});
  }, []);

  if (!banner || !visible) return null;

  return (
    <div
      className="text-white text-xs sm:text-sm py-2.5 px-8 flex items-center justify-center gap-2 relative"
      style={{ backgroundColor: banner.bgColor }}
    >
      <Tag size={13} className="shrink-0" />
      <p className="text-center">{banner.text}</p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
      >
        <X size={15} />
      </button>
    </div>
  );
}
