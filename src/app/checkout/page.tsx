"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ChevronRight, CreditCard, Smartphone, Wallet, CheckCircle, Tag, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { applyDiscount } from "@/data/discountCodes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

type PaymentMethod = "card" | "easypaisa" | "jazzcash" | "cod";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [couponError, setCouponError] = useState("");
  const { items, totalPrice, clearCart } = useCartStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const subtotal = totalPrice();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const handleApplyCoupon = () => {
    setCouponError("");
    const result = applyDiscount(couponInput, subtotal);
    if (!result) {
      setCouponError("Invalid discount code");
      return;
    }
    setAppliedCoupon({ code: couponInput.toUpperCase().trim(), ...result });
    setCouponInput("");
  };

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `ORD-${Date.now()}`,
          customer: { ...data, email: session?.user?.email || data.email },
          items,
          paymentMethod,
          subtotal,
          shipping,
          total,
        }),
      });
      if (!res.ok) throw new Error("Order save nahi hua");
      setOrderPlaced(true);
      clearCart();
    } catch {
      alert("Order place nahi hua. Internet check karein aur dobara try karein.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-500 mb-8">You will receive a confirmation SMS/Email shortly.</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
          <p className="text-sm text-gray-500">Order Total</p>
          <p className="text-2xl font-bold text-gray-900">Rs. {total.toLocaleString()}</p>
        </div>
        <Link href="/shop" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3.5 rounded-xl inline-block transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "cod", label: "Cash on Delivery", icon: <Wallet size={20} />, desc: "Pay when you receive" },
    { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} />, desc: "Visa, Mastercard, etc." },
    { id: "easypaisa", label: "Easypaisa", icon: <Smartphone size={20} />, desc: "Pay via Easypaisa" },
    { id: "jazzcash", label: "JazzCash", icon: <Smartphone size={20} />, desc: "Pay via JazzCash" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-8">
        <Link href="/cart" className="hover:text-rose-600">Cart</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Shipping Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    {...register("firstName", { required: "Required" })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="Ahmad"
                  />
                  {errors.firstName && <p className="text-rose-500 text-xs mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    {...register("lastName", { required: "Required" })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="Ali"
                  />
                  {errors.lastName && <p className="text-rose-500 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    {...register("email", { required: "Required", pattern: { value: /^\S+@\S+$/, message: "Invalid email" } })}
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="ahmad@example.com"
                  />
                  {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    {...register("phone", { required: "Required" })}
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="+92 300 1234567"
                  />
                  {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                  <input
                    {...register("address", { required: "Required" })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="House #, Street, Area"
                  />
                  {errors.address && <p className="text-rose-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    {...register("city", { required: "Required" })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors"
                    placeholder="Lahore"
                  />
                  {errors.city && <p className="text-rose-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                  <select
                    {...register("province", { required: "Required" })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400 transition-colors bg-white"
                  >
                    <option value="">Select Province</option>
                    <option>Punjab</option>
                    <option>Sindh</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                    <option>Islamabad</option>
                    <option>AJK</option>
                    <option>Gilgit-Baltistan</option>
                  </select>
                  {errors.province && <p className="text-rose-500 text-xs mt-1">{errors.province.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Payment Method</h2>
              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === opt.id ? "border-rose-600 bg-rose-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      className="accent-rose-600"
                    />
                    <div className={`${paymentMethod === opt.id ? "text-rose-600" : "text-gray-400"}`}>
                      {opt.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400" placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-3">
                    <input className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400" placeholder="MM/YY" />
                    <input className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-400" placeholder="CVV" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm sticky top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-16 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-800 shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-emerald-700">{appliedCoupon.code}</p>
                        <p className="text-xs text-emerald-600">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-emerald-500 hover:text-emerald-700">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Discount code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-rose-500 text-xs mt-1">{couponError}</p>}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>{shipping === 0 ? "FREE" : `Rs. ${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Place Order <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
