"use client";

import { useState, use, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Ruler } from "lucide-react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/ui/ProductCard";
import { WhatsAppOrderButton } from "@/components/ui/WhatsAppButton";
import { useSession } from "next-auth/react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const resolvedParams = use(params);

  // All hooks first — no conditional returns before this block
  const [dbProduct, setDbProduct] = useState<typeof products[0] | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useCartStore((s) => s.addItem);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const { data: session } = useSession();
  const router = useRouter();

  const staticProduct = products.find((p) => p.id === resolvedParams.id);
  // DB version takes priority (handles edited static products)
  const product = dbProduct ?? staticProduct;

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.dbProducts ?? []);
        const found = list.find((p: { id: string }) => p.id === resolvedParams.id);
        setDbProduct(found ?? null);
      })
      .catch(() => {})
      .finally(() => setDbLoading(false));
  }, [resolvedParams.id]);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
    }
  }, [product?.id]);

  // Conditional returns after all hooks
  if (dbLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" /></div>;
  }

  if (!product) notFound();

  const inWishlist = isInWishlist(product!.id);

  const related = products.filter((p) => p.category === product!.category && p.id !== product!.id).slice(0, 4);
  const discount = product!.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!session) { router.push("/auth/login"); return; }
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = () => {
    if (!session) { router.push("/auth/login"); return; }
    if (inWishlist) removeItem(product.id);
    else addItem(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 flex-wrap">
        <Link href="/" className="hover:text-rose-600">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop" className="hover:text-rose-600">Shop</Link>
        <ChevronRight size={14} />
        <Link href={`/shop?category=${product.category}`} className="hover:text-rose-600">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-600 truncate max-w-[140px] sm:max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gray-50 shadow-sm">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 flex-wrap">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-square w-16 sm:w-20 border-2 transition-colors ${
                    selectedImage === idx ? "border-rose-600" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-rose-500 font-semibold text-sm uppercase tracking-wide mb-2">{product.category}</p>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl sm:text-4xl font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-400 text-sm sm:text-xl line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                <span className="bg-rose-100 text-rose-700 text-sm font-bold px-2 py-0.5 rounded-lg">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Color:</span>
              <span className="text-gray-600 text-sm">{selectedColor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...new Set(product.colors)].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                    selectedColor === color
                      ? "border-rose-600 bg-rose-50 text-rose-600"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Size:</span>
                <span className="text-gray-600 text-sm">{selectedSize}</span>
              </div>
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="flex items-center gap-1 text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                <Ruler size={14} /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    selectedSize === size
                      ? "border-rose-600 bg-rose-600 text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Size Guide Table */}
            {showSizeGuide && (
              <div className="mt-4 bg-gray-50 rounded-2xl p-4 overflow-x-auto">
                <p className="font-semibold text-gray-800 mb-3 text-sm">Size Guide (in inches)</p>
                <table className="w-full text-xs text-center">
                  <thead>
                    <tr className="bg-gray-200 rounded-lg">
                      <th className="p-2 text-left">Size</th>
                      <th className="p-2">Chest</th>
                      <th className="p-2">Waist</th>
                      <th className="p-2">Hip</th>
                      <th className="p-2">Length</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {[["XS","32","26","34","52"],["S","34","28","36","53"],["M","36","30","38","54"],["L","38","32","40","55"],["XL","40","34","42","56"],["XXL","42","36","44","57"]].map(([s, ...vals]) => (
                      <tr key={s} className="border-t border-gray-200">
                        <td className="p-2 font-semibold text-left">{s}</td>
                        {vals.map((v, i) => <td key={i} className="p-2">{v}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide block mb-3">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-rose-300 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-rose-300 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 sm:mb-8">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${
                addedToCart
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              <ShoppingCart size={20} />
              {addedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlist}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0 ${
                inWishlist ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-400 hover:border-rose-300"
              }`}
            >
              <Heart size={20} className={inWishlist ? "fill-rose-600" : ""} />
            </button>
          </div>

          <div className="mb-3">
            <WhatsAppOrderButton productName={product.name} price={product.price} />
          </div>

          <Link
            href="/checkout"
            className="w-full block text-center border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-semibold py-3.5 rounded-xl transition-colors mb-8"
          >
            Buy Now
          </Link>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { icon: Truck, text: "Free Delivery above Rs. 2000" },
              { icon: RotateCcw, text: "7-Day Easy Returns" },
              { icon: Shield, text: "100% Authentic Product" },
            ].map((b) => (
              <div key={b.text} className="bg-gray-50 rounded-xl p-3 text-center">
                <b.icon size={20} className="text-rose-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600 leading-tight">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
