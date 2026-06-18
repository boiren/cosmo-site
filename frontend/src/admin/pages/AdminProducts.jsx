import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { adminAPI, productsAPI } from "../../services/api"
import { PRODUCTS } from "../../data/products"
import { fmt, discountPct } from "../../utils/helpers"
import toast from "react-hot-toast"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    productsAPI.getAll()
      .then(r => setProducts(r.data.products))
      .catch(() => setProducts(PRODUCTS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return
    setDeleting(id)
    try {
      await adminAPI.deleteProduct(id)
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id))
      toast.success("Ürün silindi")
    } catch {
      toast.error("Silme işlemi başarısız")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} ürün</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ürün ara..." className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
          <Link to="/admin/urunler/ekle"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
            + Ürün Ekle
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Ürün bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Ürün", "Kategori", "Fiyat", "İndirim", "Stok", "SKU", "İşlemler"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => {
                  const id = p._id || p.id
                  const pct = p.oldPrice ? discountPct(p.price, p.oldPrice) : 0
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]} alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate max-w-[180px]">{p.name}</div>
                            {p.badge && (
                              <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">{p.badge}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-gray-900">{fmt(p.price)}</div>
                        {p.oldPrice && <div className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</div>}
                      </td>
                      <td className="px-5 py-4">
                        {pct > 0 ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">%{pct}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={"text-xs font-bold px-2.5 py-1 rounded-full " +
                          (p.stock === 0 ? "bg-red-100 text-red-700" :
                           p.stock < 10 ? "bg-orange-100 text-orange-700" :
                           "bg-emerald-100 text-emerald-700")}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-gray-400 text-xs">{p.sku || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/urunler/${id}/duzenle`}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                            Düzenle
                          </Link>
                          <button
                            onClick={() => handleDelete(id)}
                            disabled={deleting === id}
                            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50">
                            {deleting === id ? "..." : "Sil"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}