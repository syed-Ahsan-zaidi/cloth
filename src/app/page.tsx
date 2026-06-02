import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  const totalProducts = products.length;
  const totalInStock = products.filter((p) => p.inStock).length;
  const totalCategories = new Set(products.map((p) => p.category)).size;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-rose-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                New Season Collection
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Premium Pakistani
                <span className="text-rose-600 block">Fashion</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Discover our exclusive collection of kurtas, suits, sherwanis, and bridal wear. Crafted with love, worn with pride.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3.5 rounded-xl flex items-center gap-2 transition-colors justify-center"
                >
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link
                  href="/shop?category=Bridal"
                  className="border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold px-8 py-3.5 rounded-xl transition-colors text-center"
                >
                  Bridal Collection
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 mt-8 sm:mt-10">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  <p className="text-gray-500 text-sm">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalInStock}</p>
                  <p className="text-gray-500 text-sm">In Stock</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
                  <p className="text-gray-500 text-sm">Categories</p>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative hidden md:block">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src="https://theworldofhsy.com/cdn/shop/files/mint-blue-silk-sherwani-for-weddings-front.jpg?v=1756797152&width=533"
                  alt="Pakistani Fashion"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover rounded-3xl"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                  <Truck size={18} className="text-rose-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over Rs. 2000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Kurtas", cat: "Kurta", img: "https://libasgallery.com/admin/upload/products/men-embroidered--kurta-359a.jpg" },
            { label: "Suits", cat: "Suits", img: "https://www.ethnic.com.pk/wp-content/uploads/2023/10/hunza-wool-fasunsmen-medium-grey.jpg" },
            { label: "Groom", cat: "groom", img: "https://i.etsystatic.com/23948206/r/il/b88dca/5863982875/il_570xN.5863982875_8t47.jpg" },
            { label: "Sherwani", cat: "Sherwani", img: "https://www.nameerabyfarooq.com/cdn/shop/products/PakistaniBlackSherwaniforMen_1080x.jpg?v=1644336598" },
          ].map((c) => (
            <Link
              key={c.cat}
              href={`/shop?category=${c.cat}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-md transition-shadow"
            >
              <img src={c.img} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <p className="text-white font-bold text-sm sm:text-lg">{c.label}</p>
                <p className="text-white/80 text-xs flex items-center gap-1">Shop Now <ArrowRight size={12} /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-1">Handpicked for you</p>
          </div>
          <Link href="/shop" className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div>
            <span className="bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">Limited Time Offer</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-2">Up to 50% OFF</h2>
            <p className="text-rose-100 text-base sm:text-lg">On selected bridal & formal wear</p>
          </div>
          <Link
            href="/shop"
            className="bg-white text-rose-600 hover:bg-rose-50 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap w-full sm:w-auto justify-center"
          >
            Shop the Sale <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 mt-1">Fresh off the runway</p>
          </div>
          <Link href="/shop?sort=newest" className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Facebook Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center mb-6 sm:mb-8">
          <a
            href="https://www.facebook.com/profile.php?id=61585680794100"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 fill-[#1877F2]">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-xl sm:text-2xl font-bold">Ahsan Raza</span>
          </a>
          <p className="text-gray-500 mt-2 text-sm">Follow us on Facebook for latest updates & offers</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2">
          {products.slice(0, 6).map((product) => (
            <a
              key={product.id}
              href="https://www.facebook.com/profile.php?id=61585680794100"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.facebook.com/profile.php?id=61585680794100"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Follow on Facebook
          </a>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-10 sm:py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over Rs. 2,000" },
              { icon: Shield, title: "Secure Payment", desc: "100% safe transactions" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy" },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-3">
                  <f.icon size={22} className="text-rose-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{f.title}</h3>
                <p className="text-gray-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
