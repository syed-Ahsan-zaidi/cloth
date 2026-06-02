"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products as staticProducts, categories, allSizes, allColors } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import { SortOption, Product } from "@/types";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.dbProducts) setDbProducts(data.dbProducts);
        if (data.hiddenIds) setHiddenIds(new Set(data.hiddenIds));
      })
      .catch(() => {});
  }, []);

  const products = useMemo(() => {
    const dbIds = new Set(dbProducts.map((p) => p.id));
    const visible = staticProducts.filter((p) => !dbIds.has(p.id) && !hiddenIds.has(p.id));
    return [...visible, ...dbProducts];
  }, [dbProducts, hiddenIds]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFilters, setShowFilters] = useState(false);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedSizes.length > 0 && !selectedSizes.some((s) => p.sizes.includes(s))) return false;
      if (selectedColors.length > 0 && !selectedColors.some((c) => p.colors.includes(c))) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });

    switch (sortBy) {
      case "price-asc": return [...result].sort((a, b) => a.price - b.price);
      case "price-desc": return [...result].sort((a, b) => b.price - a.price);
      case "rating": return [...result].sort((a, b) => b.rating - a.rating);
      case "newest": return [...result].filter((p) => p.isNew).concat(result.filter((p) => !p.isNew));
      default: return result;
    }
  }, [products, selectedCategory, selectedSizes, selectedColors, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 30000]);
    setSortBy("default");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedSizes.length > 0 || selectedColors.length > 0;

  // Render helper wrapper macro (Not a component instance)
  const renderFilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={`cat-${cat}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Size</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={`size-${size}`}
              onClick={() => toggleSize(size)}
              className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition-colors ${
                selectedSizes.includes(size) ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Color</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => (
            <button
              key={`color-${color}`}
              onClick={() => toggleColor(color)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-colors ${
                selectedColors.includes(color) ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
          Price: Rs. {priceRange[0].toLocaleString()} – Rs. {priceRange[1].toLocaleString()}
        </h3>
        <input
          type="range"
          min={0}
          max={30000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-rose-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Rs. 0</span>
          <span>Rs. 30,000</span>
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters} className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center gap-1">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop</h1>
        <p className="text-gray-500 mt-1">{filteredProducts.length} products found</p>
      </div>

      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:border-rose-300 transition-colors min-h-[40px]"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {selectedSizes.length + selectedColors.length + (selectedCategory !== "All" ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          <span className="text-xs sm:text-sm text-gray-500 hidden xs:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 pr-7 sm:pr-8 text-xs sm:text-sm font-medium text-gray-700 outline-none hover:border-rose-300 transition-colors cursor-pointer min-h-[40px]"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="lg:hidden bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          {renderFilterPanel()}
        </div>
      )}

      <div className="flex gap-4 sm:gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-6 text-lg">Filters</h2>
            {renderFilterPanel()}
          </div>
        </aside>

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-2">No products found</p>
              <p className="text-gray-300 text-sm mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="bg-rose-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
