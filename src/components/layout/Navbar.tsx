"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, LayoutDashboard, LogIn, PackageSearch } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isAdmin = session?.user?.role === "admin";

  const navLinks = isAdmin
    ? [
        { href: "/admin/orders", label: "Orders Dashboard" },
        { href: "/admin/products", label: "Manage Products" },
        { href: "/admin/banner", label: "Sale Banner" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-rose-600 tracking-tight">CLOTH</span>
            <span className="text-2xl font-light text-gray-700">house</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-rose-600 font-medium transition-colors text-sm uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 gap-2 border border-gray-200 w-56">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none text-sm text-gray-700 w-full"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/wishlist" className="relative text-gray-600 hover:text-rose-600 transition-colors">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-gray-600 hover:text-rose-600 transition-colors">
              <ShoppingCart size={22} />
              {totalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <span className="text-rose-600 font-bold text-sm">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <>
                        <Link href="/admin/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard size={16} className="text-rose-600" />
                          Orders Dashboard
                        </Link>
                        <Link href="/admin/products" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard size={16} className="text-rose-600" />
                          Manage Products
                        </Link>
                        <Link href="/admin/banner" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard size={16} className="text-rose-600" />
                          Sale Banner
                        </Link>
                      </>
                    )}

                    {!isAdmin && (
                      <Link href="/account/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <PackageSearch size={16} className="text-gray-500" />
                        Mere Orders
                      </Link>
                    )}

                    <button
                      onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut size={16} className="text-gray-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-rose-600 transition-colors">
                <LogIn size={20} />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 gap-2 border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none text-sm text-gray-700 w-full"
            />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-rose-600 font-medium py-3 border-b border-gray-100 text-sm uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              {!isAdmin && (
                <Link href="/account/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-rose-600 font-medium py-3 border-b border-gray-100 text-sm">
                  <PackageSearch size={16} /> Mere Orders
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-gray-700 hover:text-rose-600 font-medium py-3 text-sm w-full"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-700 hover:text-rose-600 font-medium py-3 text-sm uppercase tracking-wide"
            >
              Login / Signup
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
