import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAdmin } from "../context/AdminContext"
import { CATEGORIES } from "../data/products"
import ProductCard from "../components/product/ProductCard"

const pid = (p) => String(p?._id || p?.id || "")

export default function ProductsPage() {
  const { category }                  = useParams()
  const { products, loadingProducts } = useAdmin()
  const [activeCategory, setActiveCategory] = useState(category || "all")
  const [sortBy, setSortBy]                 = useState("featured")

  // URL param değişince category'yi güncelle
  useEffect(() => {
    if (category) setActiveCategory(category)
  }, [category])

  const visible = products.filter(p => p.isActive !== false)

  const filtered = activeCategory === "all"
    ? visible
    : visible.filter(p => p.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return (a.price || 0) - (b.price || 0)
    if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0)
    if (sortBy === "discount") {
      const da = a.oldPrice > a.price ? 1 - a.price / a.oldPrice : 0
      const db = b.oldPrice > b.price ? 1 - b.price / b.oldPrice : 0
      return db - da
    }
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  // Kategorideki ürün sayıları (API verisine göre)
  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = visible.filter(p => p.category === cat.id).length
    return acc
  }, {})

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Tüm Ürünler</h1>
          <p className="text-gray-400">
            {loadingProducts ? "Yükleniyor..." : `${sorted.length} ürün`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Kategoriler</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                    activeCategory === "all" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>Tüm Ürünler</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    {visible.length}
                  </span>
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex justify-between items-center ${
                      activeCategory === cat.id ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.icon} {cat.label}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {catCounts[cat.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500">{sorted.length} sonuç</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Öne Çıkan</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
                <option value="discount">En Çok İndirimli</option>
              </select>
            </div>

            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="bg-gray-100 h-48" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-10 bg-gray-100 rounded mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">😕</div>
                <p className="text-gray-500">Bu kategoride ürün bulunamadı</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sorted.map(p => <ProductCard key={pid(p)} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
