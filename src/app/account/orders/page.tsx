"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, ShoppingBag, Trash2 } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode; step: number }> = {
  pending:   { label: "Order Placed",  color: "text-yellow-600",  bg: "bg-yellow-100",  icon: <Clock size={18} />,       step: 1 },
  confirmed: { label: "Confirmed",     color: "text-blue-600",    bg: "bg-blue-100",    icon: <Package size={18} />,     step: 2 },
  shipped:   { label: "Shipped",       color: "text-purple-600",  bg: "bg-purple-100",  icon: <Truck size={18} />,       step: 3 },
  delivered: { label: "Delivered",     color: "text-emerald-600", bg: "bg-emerald-100", icon: <CheckCircle size={18} />, step: 4 },
  cancelled: { label: "Cancelled",     color: "text-red-600",     bg: "bg-red-100",     icon: <XCircle size={18} />,     step: 0 },
};

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "pending",   label: "Order Placed",  icon: <Package size={16} /> },
  { status: "confirmed", label: "Confirmed",     icon: <CheckCircle size={16} /> },
  { status: "shipped",   label: "Shipped",       icon: <Truck size={16} /> },
  { status: "delivered", label: "Delivered",     icon: <CheckCircle size={16} /> },
];

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDelete = async (orderId: string) => {
    if (!confirm("Kya aap yaqeen se yeh order delete karna chahte hain?")) return;
    await fetch("/api/user/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId }),
    });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  useEffect(() => {
    if (session) {
      fetch("/api/user/orders")
        .then((r) => r.json())
        .then((data) => { setOrders(Array.isArray(data) ? data : []); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShoppingBag size={56} className="text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Login Karein</h1>
        <p className="text-gray-500">Apne orders dekhne ke liye login karein</p>
        <Link href="/auth/login" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mere Orders</h1>
      <p className="text-gray-500 text-sm mb-8">{orders.length} orders mili hain</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={56} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">Abhi koi order nahi</p>
          <Link href="/shop" className="mt-4 inline-block bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Shopping Karein
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const currentStep = cfg.step;
            const isCancelled = order.status === "cancelled";
            const date = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
            const expanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div
                  className="p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(order.id); }}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Order delete karo"
                      >
                        <Trash2 size={15} />
                      </button>
                      {expanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
                    </div>
                  </div>

                  {/* Progress bar */}
                  {!isCancelled && (
                    <div className="flex items-center">
                      {STEPS.map((step, i) => {
                        const stepNum = i + 1;
                        const done = currentStep >= stepNum;
                        const active = currentStep === stepNum;
                        return (
                          <div key={step.status} className="flex items-center flex-1">
                            <div className="flex flex-col items-center gap-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                                active ? "border-rose-600 bg-rose-600 text-white" :
                                done ? "border-rose-500 bg-rose-500 text-white" :
                                "border-gray-200 bg-white text-gray-300"
                              }`}>
                                {step.icon}
                              </div>
                              <p className={`text-xs text-center leading-tight hidden sm:block ${done ? "text-rose-600 font-medium" : "text-gray-400"}`}>
                                {step.label}
                              </p>
                            </div>
                            {i < STEPS.length - 1 && (
                              <div className={`h-0.5 flex-1 mx-1 mb-4 ${currentStep > stepNum ? "bg-rose-500" : "bg-gray-200"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isCancelled && (
                    <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
                      <XCircle size={16} className="text-red-500" />
                      <p className="text-sm text-red-600 font-medium">Yeh order cancel ho gaya hai</p>
                    </div>
                  )}
                </div>

                {/* Expanded details */}
                {expanded && (
                  <div className="border-t border-gray-100 p-4 sm:p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                              <p className="text-xs text-gray-400">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-gray-800 shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-1">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span><span>{order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-gray-900 pt-1">
                        <span>Total</span><span>Rs. {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
