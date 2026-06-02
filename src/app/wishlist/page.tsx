"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart size={40} className="text-rose-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8">Save items you love to come back to them later</p>
        <Link href="/shop" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
          Explore Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
      <p className="text-gray-500 mb-8">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map((product) => {
          const discount = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <Link href={`/product/${product.id}`} className="relative block overflow-hidden aspect-[3/4]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); removeItem(product.id); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors"
                >
                  <Trash2 size={14} className="text-rose-600" />
                </button>
              </Link>

              <div className="p-4">
                <p className="text-xs text-rose-500 font-medium mb-1">{product.category}</p>
                <Link href={`/product/${product.id}`} className="font-semibold text-gray-800 text-sm hover:text-rose-600 line-clamp-1 block mb-2">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">Rs. {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 text-xs line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
