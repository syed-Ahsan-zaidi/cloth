"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShieldX, Plus, Trash2, Package, X, Image as ImageIcon, Pencil, EyeOff } from "lucide-react";
import { products as staticProducts, categories, allSizes, allColors } from "@/data/products";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  description: string;
  inStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "",
  price: "",
  originalPrice: "",
  images: ["", "", ""],
  category: "Kurta",
  colors: [] as string[],
  sizes: [] as string[],
  description: "",
  inStock: true,
  isNew: false,
  isFeatured: false,
};

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const [dbProducts, setDbProducts] = useState<DBProduct[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customColor, setCustomColor] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setDbProducts(Array.isArray(data.dbProducts) ? data.dbProducts : []);
    setHiddenIds(new Set(data.hiddenIds ?? []));
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === "admin") fetchProducts();
  }, [session]);

  const toggleSize = (s: string) =>
    setForm((f) => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s] }));

  const toggleColor = (c: string) =>
    setForm((f) => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter((x) => x !== c) : [...f.colors, c] }));

  const openEdit = (p: DBProduct | typeof staticProducts[0]) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      images: [...(p.images ?? []), "", ""].slice(0, 3),
      category: p.category,
      colors: p.colors ?? [],
      sizes: p.sizes ?? [],
      description: p.description ?? "",
      inStock: p.inStock ?? true,
      isNew: p.isNew ?? false,
      isFeatured: p.isFeatured ?? false,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); setError(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price || !form.description || form.sizes.length === 0 || form.colors.length === 0) {
      setError("Tamam zaroori fields bharein aur kam az kam ek size aur color chunein");
      return;
    }
    setSaving(true);
    const isDbProduct = editingId?.startsWith("PROD-");
    const url = (editingId && isDbProduct) ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = (editingId && isDbProduct) ? "PATCH" : "POST";
    const payload = editingId ? { ...form, id: editingId } : form;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) { setError("Save nahi hua, dobara try karein"); return; }
    closeForm();
    fetchProducts();
  };

  const handleDelete = async (id: string, isStatic: boolean) => {
    if (!confirm("Yeh product delete/hide karna chahte hain?")) return;
    if (isStatic) {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "hide", id }),
      });
      setHiddenIds((prev) => new Set([...prev, id]));
    } else {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setDbProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleUnhide = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setHiddenIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  if (status === "loading" || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" /></div>;
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShieldX size={56} className="text-rose-400" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{staticProducts.length + dbProducts.length} total · {hiddenIds.size} hidden</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? "Product Edit Karo" : "Naya Product Add Karo"}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="Classic Kurta" />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (Rs.) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="1299" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price (optional)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors" placeholder="1799" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors bg-white">
                  {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <ImageIcon size={14} className="inline mr-1" />Images (URLs)
                </label>
                {form.images.map((img, i) => (
                  <input key={i} value={img} onChange={(e) => {
                    const imgs = [...form.images];
                    imgs[i] = e.target.value;
                    setForm({ ...form, images: imgs });
                  }} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-400 transition-colors mb-2" placeholder={`Image ${i + 1} URL`} />
                ))}
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes *</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)} className={`w-10 h-10 rounded-xl text-sm font-semibold border-2 transition-colors ${form.sizes.includes(s) ? "border-rose-600 bg-rose-600 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors *</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {allColors.map((c) => (
                    <button key={c} type="button" onClick={() => toggleColor(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${form.colors.includes(c) ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{c}</button>
                  ))}
                </div>
                {/* Custom color */}
                <div className="flex gap-2">
                  <input
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); if (customColor.trim() && !form.colors.includes(customColor.trim())) { setForm((f) => ({ ...f, colors: [...f.colors, customColor.trim()] })); setCustomColor(""); } }
                    }}
                    placeholder="Apna color likho (e.g. Navy Blue)"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => { if (customColor.trim() && !form.colors.includes(customColor.trim())) { setForm((f) => ({ ...f, colors: [...f.colors, customColor.trim()] })); setCustomColor(""); } }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-2 rounded-xl text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
                {/* Selected colors with remove */}
                {form.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.map((c) => (
                      <span key={c} className="flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 text-xs font-medium px-2 py-1 rounded-full">
                        {c}
                        <button type="button" onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) }))} className="text-rose-400 hover:text-rose-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors resize-none" placeholder="Product description..." />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "In Stock", key: "inStock" },
                  { label: "New Arrival", key: "isNew" },
                  { label: "Featured", key: "isFeatured" },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="accent-rose-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              <button type="submit" disabled={saving} className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus size={18} /> {editingId ? "Update Karo" : "Product Save Karo"}</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* All Products List */}
      <div className="space-y-3">
        {/* Static products — skip if DB override exists */}
        {staticProducts.map((p) => {
          const isHidden = hiddenIds.has(p.id);
          const hasOverride = dbProducts.some((d) => d.id === p.id);
          if (hasOverride) return null; // DB version will show it
          return (
            <div key={p.id} className={`bg-white border rounded-2xl shadow-sm p-4 flex items-center gap-4 ${isHidden ? "opacity-50 border-gray-200" : "border-gray-100"}`}>
              <Link href={`/product/${p.id}`} className="shrink-0">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-xl bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center"><Package size={24} className="text-gray-300" /></div>
                )}
              </Link>
              <Link href={`/product/${p.id}`} className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category} · Rs. {p.price.toLocaleString()}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Static</span>
                  {isHidden && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>}
                  {!p.inStock && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Out of Stock</span>}
                </div>
              </Link>
              <div className="flex items-center gap-1 shrink-0">
                {!isHidden && (
                  <button onClick={() => openEdit(p)} className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Edit karo">
                    <Pencil size={18} />
                  </button>
                )}
                {isHidden ? (
                  <button onClick={() => handleUnhide(p.id)} className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Wapas dikhao">
                    <EyeOff size={18} />
                  </button>
                ) : (
                  <button onClick={() => handleDelete(p.id, true)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Hide karo">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* DB products */}
        {dbProducts.map((p) => {
          const isStaticOverride = staticProducts.some((s) => s.id === p.id);
          return (
          <div key={p.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center gap-4">
            <Link href={`/product/${p.id}`} className="shrink-0">
              {p.images[0] ? (
                <img src={p.images[0]} alt={p.name} className="w-16 h-16 object-cover rounded-xl bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center"><Package size={24} className="text-gray-300" /></div>
              )}
            </Link>
            <Link href={`/product/${p.id}`} className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400">{p.category} · Rs. {p.price.toLocaleString()}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {isStaticOverride
                  ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Edited</span>
                  : <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">Admin Added</span>
                }
                {p.isNew && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">New</span>}
                {p.isFeatured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Featured</span>}
                {!p.inStock && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Out of Stock</span>}
              </div>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(p.id, false)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          );
        })}

        {staticProducts.length === 0 && dbProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p>Koi product nahi mila</p>
          </div>
        )}
      </div>
    </div>
  );
}
