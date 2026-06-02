import Link from "next/link";
import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-rose-500">CLOTH</span>
              <span className="text-2xl font-light text-white">house</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Premium Pakistani fashion for every occasion. Quality fabrics, timeless designs.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61585680794100" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={`https://wa.me/923224167508`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <MessageCircle size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/shop?category=Kurta", label: "Kurtas" },
                { href: "/shop?category=Suits", label: "Suits" },
                { href: "/shop?category=Bridal", label: "Bridal" },
                { href: "/wishlist", label: "Wishlist" },
                { href: "/cart", label: "Cart" },
              ].map((link, index) => (
                <li key={`quick-link-${index}`}>
                  <Link href={link.href} className="hover:text-rose-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
                { href: "#", label: "Size Guide" },
                { href: "#", label: "Shipping Policy" },
                { href: "#", label: "Returns & Exchange" },
                { href: "#", label: "Track Order" },
              ].map((link, index) => (
                <li key={`customer-link-${index}`}>
                  <Link href={link.href} className="hover:text-rose-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide text-sm">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-rose-500 mt-0.5 shrink-0" />
                <span>123 Fashion Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-rose-500 shrink-0" />
                <span>+92 3224167508</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <span className="break-all">ahsanzaidi51272@gmail.com</span>
              </li>
            </ul>

            {/* Newsletter */}
           
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>© 2026 ClothHaus. All rights reserved. Made with ❤️ by  Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
