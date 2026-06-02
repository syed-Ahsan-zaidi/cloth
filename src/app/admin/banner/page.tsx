"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShieldX, Tag, Save, Eye, EyeOff } from "lucide-react";

const PRESET_COLORS = [
  { label: "Rose",   value: "#e11d48" },
  { label: "Black",  value: "#111827" },
  { label: "Green",  value: "#16a34a" },
  { label: "Blue",   value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Orange", value: "#ea580c" },
];

export default function AdminBannerPage() {
  const { data: session, status } = useSession();
  const [text, setText] = useState("");
  const [active, setActive] = useState(false);
  const [bgColor, setBgColor] = useState("#e11d48");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/banner")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setText(data.text || "");
          setActive(data.active || false);
          setBgColor(data.bgColor || "#e11d48");
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/banner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, active, bgColor }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (status === "loading") return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" /></div>;

  if (!session || session.user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShieldX size={56} className="text-rose-400" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sale Banner</h1>
      <p className="text-gray-500 text-sm mb-8">Poori website ke upar banner dikhao — kisi bhi sale ya offer ke liye</p>

      {/* Preview */}
      {text && (
        <div className="mb-6 rounded-xl overflow-hidden">
          <div className="py-2.5 px-4 flex items-center justify-center gap-2 text-white text-sm" style={{ backgroundColor: bgColor }}>
            <Tag size={14} />
            <span>{text}</span>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">Preview</p>
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
        {/* Active toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-800">Banner Active</p>
            <p className="text-xs text-gray-400 mt-0.5">ON karo toh poori site pe dikhega</p>
          </div>
          <button
            onClick={() => setActive(!active)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
          >
            {active ? <><Eye size={16} /> ON</> : <><EyeOff size={16} /> OFF</>}
          </button>
        </div>

        {/* Banner text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="e.g. EID SALE — Up to 50% OFF! Use code EID50 at checkout"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors resize-none"
          />
        </div>

        {/* Background color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Background Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setBgColor(c.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all text-white ${bgColor === c.value ? "border-gray-800 scale-105" : "border-transparent"}`}
                style={{ backgroundColor: c.value }}
              >
                {c.label}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 cursor-pointer"
                title="Custom color"
              />
              <span className="text-xs text-gray-400">Custom</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            "✓ Saved!"
          ) : (
            <><Save size={18} /> Save Karo</>
          )}
        </button>
      </div>
    </div>
  );
}
