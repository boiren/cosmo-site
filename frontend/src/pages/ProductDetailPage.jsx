import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAdmin } from "../context/AdminContext"
import { useCart }  from "../context/CartContext"
import { fmt, discountPct, stockStatus } from "../utils/helpers"
import ProductCard from "../components/product/ProductCard"

const pid = (p) => String(p?._id || p?.id || "")

// specs Map veya plain object → entries dizisi
const specEntries = (specs) => {
  if (!specs) return []
  if (specs instanceof Map)      return [...specs.entries()]
  if (typeof specs === "object") return Object.entries(specs)
  return []
}

export default function ProductDetailPage() {
  const { slug }                       = useParams()
  const { products, loadingProducts }  = useAdmin()
  const { addToCart }                  = useCart()
  const [activeImg, setActiveImg]      = useState(0)
  const [qty,       setQty]            = useState(1)
  const [tab,       setTab]            = useState("desc")
  const [adding,    setAdding]         = useState(false)

  // slug değişince görseli sıfırla
  const product = products.find(p => p.slug === slug && p.isActive !== false)
  useEffect(() => { setActiveImg(0); setQty(1) }, [slug])

  // ── Yüklenme durumu ──────────────────────────────────────
  if (loadingProducts) return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-12 bg-gray-100 rounded mt-8" />
          </div>
        </div>
      </div>
    </div>
  )

  // ── Ürün bulunamadı ──────────────────────────────────────
  if (!product) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h2>
        <Link to="/urunler" className="btn-primary">Ürünlere Dön</Link>
      </div>
    </div>
  )

  // ── Hesaplamalar ─────────────────────────────────────────
  const images   = product.images?.length > 0 ? product.images : ["/images/placeholder.jpg"]
  const pct      = product.oldPrice > product.price ? discountPct(product.price, product.oldPrice) : 0
  const stock    = stockStatus(product.stock ?? 0)
  const specs    = specEntries(product.specs)
  const related  = products.filter(p =>
    p.category === product.category &&
    pid(p) !== pid(product) &&
    p.isActive !== false
  ).slice(0, 3)

  const handleAdd = async () => {
    setAdding(true)
    addToCart(product, qty)
    await new Promise(r => setTimeout(r, 1500))
    setAdding(false)
  }

  return (
    <div className="pt-16 min-h-screen">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link to="/urunler" className="hover:text-blue-600 transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Galeri ────────────────────────────────────── */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={e => { e.target.src = "/images/placeholder.jpg" }}
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-blue-600 shadow-md" : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = "/images/placeholder.jpg" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Bilgi ─────────────────────────────────────── */}
          <div>
            {/* Badge'ler */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.badge && (
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
              {pct > 0 && (
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  %{pct} İndirim
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-500 mb-5 leading-relaxed">{product.shortDesc}</p>

            {/* Yıldızlar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className={`w-4 h-4 ${i <= 4 ? "fill-amber-400" : "fill-gray-200"}`} viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-400">4.8 (128 değerlendirme)</span>
            </div>

            {/* Fiyat — API'den canlı */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-black text-gray-900">{fmt(product.price)}</span>
              {product.oldPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">{fmt(product.oldPrice)}</span>
              )}
            </div>
            {product.oldPrice > product.price && (
              <p className="text-emerald-600 font-semibold mb-5">
                {fmt(product.oldPrice - product.price)} tasarruf ediyorsunuz
              </p>
            )}

            {/* Stok */}
            <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-6 ${stock.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {stock.label}
            </div>

            {/* Adet + Butonlar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 hover:bg-gray-50 text-gray-600 text-lg transition-colors"
                >−</button>
                <span className="px-5 py-3 font-bold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock ?? 99, qty + 1))}
                  className="px-4 py-3 hover:bg-gray-50 text-gray-600 text-lg transition-colors"
                >+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!product.stock || adding}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  adding
                    ? "bg-emerald-500 text-white"
                    : !product.stock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-200 hover:shadow-lg"
                }`}
              >
                {adding ? "✓ Sepete Eklendi" : "Sepete Ekle"}
              </button>
            </div>
            <Link
              to="/sepet"
              onClick={() => addToCart(product, qty)}
              className="block text-center py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm mb-6 transition-all active:scale-95"
            >
              Hemen Satın Al
            </Link>

            {/* Güven rozetleri */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "🛡️", text: "2 Yıl Garanti" },
                { icon: "🔄", text: "30 Gün İade" },
                { icon: "🚚", text: "Ücretsiz Kargo" },
                { icon: "🔒", text: "Güvenli Ödeme" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 text-sm font-medium text-gray-700">
                  <span>{b.icon}</span>{b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs — Açıklama / Özellikler / Teknik ─────── */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 mb-8">
            {[
              ["desc",     "Ürün Açıklaması"],
              ["features", "Özellikler"],
              ["specs",    "Teknik Özellikler"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === k
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {tab === "desc" && (
            <div className="text-gray-600 leading-relaxed whitespace-pre-line max-w-3xl">
              {product.description || "Açıklama henüz eklenmemiş."}
            </div>
          )}

          {tab === "features" && (
            <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
              {(product.features || []).length === 0 ? (
                <li className="text-gray-400">Özellik eklenmemiş.</li>
              ) : (
                (product.features).map((f, i) => (
                  <li key={i} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                    <span className="text-blue-600 font-bold flex-shrink-0">✓</span>
                    <span className="text-sm text-gray-700 font-medium">{f}</span>
                  </li>
                ))
              )}
            </ul>
          )}

          {tab === "specs" && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 max-w-2xl">
              {specs.length === 0 ? (
                <div className="p-6 text-gray-400 text-sm">Teknik özellik eklenmemiş.</div>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map(([k, v], i) => (
                      <tr key={k} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4 font-semibold text-gray-700 w-1/2">{k}</td>
                        <td className="px-6 py-4 text-gray-600">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* ── İlgili Ürünler ─────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">İlgili Ürünler</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => <ProductCard key={pid(p)} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
