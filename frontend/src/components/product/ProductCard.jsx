import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"
import { fmt, discountPct } from "../../utils/helpers"

const pid = (p) => String(p?._id || p?.id || "")

const BADGE_COLORS = {
  blue:   "bg-blue-600",
  red:    "bg-red-500",
  green:  "bg-emerald-500",
  purple: "bg-purple-600",
  orange: "bg-orange-500",
}

export default function ProductCard({ product }) {
  const { addToCart }   = useCart()
  const [adding, setAdding] = useState(false)

  const pct      = product.oldPrice > product.price ? discountPct(product.price, product.oldPrice) : 0
  const imgSrc   = product.images?.[0] || "/images/placeholder.jpg"
  const outOfStock = !product.stock || product.stock === 0

  const handleAdd = async (e) => {
    e.preventDefault()
    if (outOfStock || adding) return
    setAdding(true)
    addToCart(product)
    await new Promise(r => setTimeout(r, 1500))
    setAdding(false)
  }

  return (
    <Link
      to={`/urunler/${product.slug}`}
      className="card group block overflow-hidden"
    >
      {/* Görsel */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingTop: "68%" }}>
        <img
          src={imgSrc}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = "/images/placeholder.jpg" }}
        />

        {/* Badge'ler */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`${BADGE_COLORS[product.badgeColor] || BADGE_COLORS.blue} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>
              {product.badge}
            </span>
          )}
          {pct > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              %{pct} İndirim
            </span>
          )}
        </div>

        {/* Stok uyarısı */}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute bottom-3 right-3 bg-orange-500/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            Son {product.stock} ürün
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full">Stokta Yok</span>
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="p-5">
        <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
          {product.category?.replace(/-/g, " ")}
        </p>
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {product.shortDesc}
        </p>

        {/* Yıldızlar */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <svg key={i} className={`w-3.5 h-3.5 ${i <= 4 ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="text-gray-400 text-xs ml-1">(128)</span>
        </div>

        {/* Fiyat — API'den canlı */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">{fmt(product.price)}</span>
          {product.oldPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{fmt(product.oldPrice)}</span>
          )}
        </div>

        {/* Sepete ekle */}
        <button
          onClick={handleAdd}
          disabled={outOfStock || adding}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
            adding
              ? "bg-emerald-500 text-white"
              : outOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
          }`}
        >
          {adding ? "✓ Eklendi" : outOfStock ? "Stokta Yok" : "Sepete Ekle"}
        </button>
      </div>
    </Link>
  )
}
