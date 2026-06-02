import Link from "next/link";
import { ArrowRight, Heart, Award, Users, Package } from "lucide-react";
import { products } from "@/data/products";

export default function AboutPage() {
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const totalColors = new Set(products.flatMap((p) => p.colors)).size;

  const stats = [
    { icon: Package, value: String(totalProducts),   label: "Products" },
    { icon: Users,   value: String(inStockProducts), label: "In Stock" },
    { icon: Award,   value: String(totalCategories), label: "Categories" },
    { icon: Heart,   value: String(totalColors),     label: "Color Options" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">Our Story</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Crafting Fashion with <span className="text-rose-600">Love & Pride</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Cloth house was born from a passion for celebrating Pakistani culture through fashion. We bring you the finest traditional and contemporary clothing, crafted by skilled artisans across Pakistan.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 text-center shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <stat.icon size={20} className="text-rose-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that clothing is more than fabric — it&apos;s identity, heritage, and expression. Our mission is to make premium Pakistani fashion accessible to everyone, while preserving the traditional craft techniques passed down through generations.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Every piece in our collection is carefully sourced and quality-checked. We work directly with artisans and weavers to ensure fair wages and sustainable practices.
              </p>
              <Link href="/shop" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-colors">
                Explore Collection <ArrowRight size={18} />
              </Link>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-lg">
              <img
                src="https://theworldofhsy.com/cdn/shop/files/mint-blue-silk-sherwani-for-weddings-front.jpg?v=1756797152&width=533"
                alt="Pakistani Fashion Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: "Quality First",            desc: "Every garment goes through rigorous quality checks. We use only the finest fabrics and materials." },
            { title: "Authentic Craftsmanship",  desc: "We celebrate traditional Pakistani embroidery, weaving, and design techniques." },
            { title: "Customer Happiness",       desc: "Your satisfaction is our priority. We offer easy returns, 24/7 support, and fast delivery." },
          ].map((v) => (
            <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-3 h-3 bg-rose-600 rounded-full mb-4" />
              <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
