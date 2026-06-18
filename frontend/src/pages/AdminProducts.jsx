import { useState } from "react"
import { Link } from "react-router-dom"
import { useAdmin } from "../../context/AdminContext"
import { fmt, discountPct } from "../../utils/helpers"
import toast from "react-hot-toast"

const CATS = {
  "arac-bakim":   "🚗 Araç Bakım",
  "dalis":        "🤿 Dalış",
  "outdoor-kamp": "⛺ Outdoor",
  "agiz-bakim":   "🦷 Ağız Bakım",
}

export default function AdminProducts() {
  const { products, deleteProduct, refreshProducts, loadingProducts, backendOnline } = useAdmin()
  const [search,     setSearch]     = useState("")
  const [catFilter,  setCatFilter]  = useState("all")
  const [confirm,    setConfirm]    = useState(null) // ürün id'si

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === "all" || p.category === catFilter
    return matchSearch && matchCat
  })

  const handleDelete = (id, name) => {
    setConfirm({ id, name })
  }

  const confirmDelete = () => {
    deleteProduct(confirm.id)
    toast.success(`"${confirm.name}" silindi`)
    setConfirm(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length} ürün</p>
        </div>
        <Link to="/admin/urun-ekle"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          <span className="text-base leading-none">+</span> Ürün Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Ürün ara..."
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
        />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Tüm Kategoriler</option>
          {Object.entries(CATS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 font-medium">Ürün bulunamadı</p>
          <Link to="/admin/urun-ekle" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
            İlk Ürünü Ekle
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => {
            const id  = p._id || p.id
            const pct = p.oldPrice ? discountPct(p.price, p.oldPrice) : 0
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
                {/* Görsel */}
                <div className="relative h-44 bg-gray-50 overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl text-gray-300">📦</div>
                  )}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {p.badge && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.badge}</span>
                    )}
                    {pct > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">%{pct} İndirim</span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.isActive !== false ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                    }`}>
                      {p.isActive !== false ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-4">
                  <p className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider mb-1">
                    {CATS[p.category] || p.category}
                  </p>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{p.name}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-gray-900 text-base">{fmt(p.price)}</span>
                      {p.oldPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">{fmt(p.oldPrice)}</span>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      p.stock === 0 ? "bg-red-100 text-red-700"
                      : p.stock < 10 ? "bg-orange-100 text-orange-700"
                      : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {p.stock === 0 ? "Stok Yok" : `${p.stock} adet`}
                    </span>
                  </div>

                  {/* Butonlar */}
                  <div className="flex gap-2">
                    <Link to={`/admin/urun-duzenle/${id}`}
                      className="flex-1 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                      ✏️ Düzenle
                    </Link>
                    <button onClick={() => handleDelete(id, p.name)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Silme onay modalı */}
      {confirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="font-bold text-gray-900 text-center mb-2">Ürünü Sil</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              <strong>"{confirm.name}"</strong> silinecek. Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                İptal
              </button>
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
