"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Order, OrderStatus } from "@/types";
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronDown, ChevronUp, ShieldX, RefreshCw, Trash2 } from "lucide-react";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700",   icon: <Clock size={14} /> },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700",       icon: <Package size={14} /> },
  shipped:   { label: "Shipped",   color: "bg-purple-100 text-purple-700",   icon: <Truck size={14} /> },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={14} /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700",         icon: <XCircle size={14} /> },
};

const ALL_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.role === "admin") fetchOrders();
  }, [session]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Kya aap yaqeen se is order ko delete karna chahte hain?")) return;
    await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <ShieldX size={56} className="text-rose-400" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500">Yeh page sirf admin ke liye hai.</p>
      </div>
    );
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = ALL_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Orders Dashboard</h1>
        <button onClick={fetchOrders} className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-rose-600 transition-colors shrink-0">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>
      <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">Total orders: {orders.length}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {ALL_STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "all" : s)}
              className={`rounded-xl p-3 sm:p-4 text-left border-2 transition-all ${
                filter === s ? "border-rose-500 shadow-md" : "border-transparent"
              } ${cfg.color}`}
            >
              <div className="flex items-center gap-1 mb-1">{cfg.icon}<span className="text-xs font-medium">{cfg.label}</span></div>
              <p className="text-xl sm:text-2xl font-bold">{counts[s]}</p>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-30" />
          <p>Koi order nahi mila</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onStatusChange={(s) => handleStatusChange(order.id, s)}
              onDelete={() => handleDelete(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (s: OrderStatus) => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[order.status];
  const date = new Date(order.createdAt).toLocaleString("en-PK", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">{date}</p>
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="font-medium text-gray-800 truncate">{order.customer.firstName} {order.customer.lastName}</p>
            <p className="text-xs text-gray-400 truncate">{order.customer.phone} · {order.customer.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="font-bold text-gray-900 text-xs sm:text-sm">Rs. {order.total.toLocaleString()}</span>
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${cfg.color}`}>
            {cfg.icon}<span className="hidden sm:inline">{cfg.label}</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete order"
          >
            <Trash2 size={16} />
          </button>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 sm:p-5 space-y-4 sm:space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer</p>
              <p className="text-sm text-gray-800">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
              <p className="text-sm text-gray-500">{order.customer.address}, {order.customer.city}, {order.customer.province}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Payment</p>
              <p className="text-sm text-gray-800 capitalize">{order.paymentMethod}</p>
              <p className="text-sm text-gray-500 mt-1">Subtotal: Rs. {order.subtotal.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Shipping: {order.shipping === 0 ? "FREE" : `Rs. ${order.shipping}`}</p>
              <p className="text-sm font-bold text-gray-800">Total: Rs. {order.total.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items ({order.items.length})</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-14 object-cover rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Size: {item.selectedSize} · Color: {item.selectedColor} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 shrink-0">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Status Update Karo</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => {
                const c = STATUS_CONFIG[s];
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all ${
                      order.status === s
                        ? `${c.color} border-current`
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {c.icon}{c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
