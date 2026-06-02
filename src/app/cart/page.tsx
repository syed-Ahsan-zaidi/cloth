"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-rose-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add items to your cart to continue shopping</p>
        <Link href="/shop" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const subtotal = totalPrice();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm"
            >
              <Link href={`/product/${item.product.id}`} className="shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <Link href={`/product/${item.product.id}`} className="font-semibold text-gray-800 hover:text-rose-600 line-clamp-1">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                    className="text-gray-300 hover:text-rose-500 transition-colors shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    Size: {item.selectedSize}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    Color: {item.selectedColor}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-gray-400 hover:text-rose-500 text-sm flex items-center gap-1 transition-colors"
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Add Rs. {(2000 - subtotal).toLocaleString()} more for free shipping</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-rose-300 transition-colors"
              />
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors">
                Apply
              </button>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Link>

            <Link href="/shop" className="block text-center text-rose-600 hover:text-rose-700 text-sm font-medium mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
