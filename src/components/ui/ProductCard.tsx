"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.addItem);
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const { data: session } = useSession();
  const router = useRouter();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { router.push("/auth/login"); return; }
    if (inWishlist) removeItem(product.id);
    else addItem(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) { router.push("/auth/login"); return; }
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-100">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}
          <div className={`${product.images[0] ? "hidden" : ""} absolute inset-0 flex flex-col items-center justify-center gap-2`}>
            <ShoppingCart size={32} className="text-gray-300" />
            <span className="text-xs text-gray-300">No image</span>
          </div>
          {/* Out of Stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-bold text-xs px-3 py-1.5 rounded-full shadow">Out of Stock</span>
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {!product.inStock && (
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Sold Out</span>
            )}
            {product.inStock && product.isNew && (
              <span className="bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">NEW</span>
            )}
            {product.inStock && discount > 0 && (
              <span className="bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">-{discount}%</span>
            )}
          </div>
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              size={16}
              className={inWishlist ? "fill-rose-600 text-rose-600" : "text-gray-400"}
            />
          </button>
          {/* Add to Cart overlay */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5 sm:p-4">
          <p className="text-xs text-rose-500 font-medium uppercase tracking-wide mb-0.5 sm:mb-1 truncate">{product.category}</p>
          <h3 className="text-gray-800 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-1">{product.name}</h3>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1 sm:mb-2">
            <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-xs text-gray-600 truncate">{product.rating} ({product.reviews})</span>
          </div>
          {/* Price */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-900 font-bold text-sm">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through">Rs. {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
