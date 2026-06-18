import { Link } from "react-router-dom"
import { useAdmin } from "../../context/AdminContext"
import { fmt } from "../../utils/helpers"

export default function AdminDashboard() {
  const { products, stats, backendOnline, backendChecked, admin, resetToDemo, refreshProducts, loadingProducts } = useAdmin()

  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10)
  const outStock = products.filter(p => p.stock === 0)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoş geldin, {admin?.name} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleDateString("tr-TR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        <Link to="/admin/urun-ekle"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Yeni Ürün Ekle
        </Link>
      </div>

      {/* Backend durum banner */}
      {backendChecked && (
        <div className={`rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 ${
          backendOnline
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-amber-50 border border-amber-200"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{backendOnline ? "🟢" : "⚡"}</span>
            <div>
              {backendOnline ? (
                <>
                  <p className="text-emerald-800 font-semibold text-sm">Backend Bağlı — MongoDB Aktif</p>
                  <p className="text-emerald-700 text-xs mt-0.5">
                    Ürünler MongoDB'den çekiliyor. Değişiklikler kalıcı olarak kaydedilir.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-amber-800 font-semibold text-sm">Offline Mod — Backend Kapalı</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    Değişiklikler localStorage'a kaydediliyor. Backend başlatılınca sync olur.
                    <span className="block mt-1 font-mono text-amber-600">cd backend &amp;&amp; npm run seed:products &amp;&amp; npm run dev</span>
                  </p>
                </>
              )}
            </div>
          </div>
          <button
            onClick={refreshProducts}
            disabled={loadingProducts}
            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
              backendOnline
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-100 hover:bg-amber-200 text-amber-800"
            } disabled:opacity-50`}
          >
            <span className={loadingProducts ? "animate-spin" : ""}>🔄</span>
            {loadingProducts ? "Yükleniyor..." : "Yenile"}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Ürün",  value: stats.totalProducts, icon: "📦", color: "blue",    link: "/admin/urunler" },
          { label: "Stokta",       value: stats.inStock,       icon: "✅", color: "emerald", link: "/admin/urunler" },
          { label: "Stok Yok",     value: stats.outOfStock,    icon: "⛔", color: "red",     link: "/admin/urunler" },
          { label: "Öne Çıkan",    value: stats.featured,      icon: "⭐", color: "amber",   link: "/admin/urunler" },
        ].map((s, i) => (
          <Link key={i} to={s.link}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold text-${s.color}-600 mb-1`}>{s.value}</div>
            <div className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Düşük stok uyarısı */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">⚠️ Stok Uyarısı</h2>
            <Link to="/admin/urunler" className="text-xs text-blue-600 hover:underline font-medium">Tümü →</Link>
          </div>
          {lowStock.length === 0 && outStock.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <div className="text-3xl mb-2">✅</div>
              Tüm ürünlerde yeterli stok var
            </div>
          ) : (
            <div className="space-y-2">
              {[...outStock, ...lowStock].slice(0, 6).map(p => (
                <Link key={p._id || p.id} to={`/admin/urun-duzenle/${p._id || p.id}`}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{p.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    p.stock === 0 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {p.stock === 0 ? "Stok Yok" : `Son ${p.stock}`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Hızlı işlemler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">🚀 Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/admin/urun-ekle",  icon: "➕", label: "Ürün Ekle",      color: "blue"   },
              { to: "/admin/urunler",    icon: "📋", label: "Ürün Listesi",   color: "gray"   },
              { to: "/admin/kuponlar",   icon: "🏷️", label: "Kupon Ekle",     color: "purple" },
              { to: "/admin/ayarlar",    icon: "⚙️", label: "Ayarlar",        color: "gray"   },
              { to: "/",                 icon: "🌐", label: "Siteyi Gör",     color: "green"  },
            ].map(item => (
              <Link key={item.to} to={item.to} target={item.to === "/" ? "_blank" : undefined}
                className="bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent
                  rounded-xl p-4 text-center transition-all group">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-semibold text-gray-600 group-hover:text-blue-700 transition-colors">
                  {item.label}
                </div>
              </Link>
            ))}

            {/* Demo reset */}
            <button onClick={() => { if(confirm("Demo ürünlere sıfırlansın mı? Mevcut ürünler silinir.")) resetToDemo() }}
              className="bg-red-50 hover:bg-red-100 border border-transparent rounded-xl p-4 text-center transition-all group">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-xs font-semibold text-red-600 group-hover:text-red-700 transition-colors">Demo Sıfırla</div>
            </button>
          </div>
        </div>

        {/* Son eklenen ürünler */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">📦 Ürünler</h2>
            <Link to="/admin/urunler" className="text-xs text-blue-600 hover:underline font-medium">Tümünü Yönet →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Ürün","Fiyat","Stok","Durum","İşlem"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.slice(0, 8).map(p => (
                  <tr key={p._id || p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-[200px]">{p.name}</div>
                          {p.badge && <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full">{p.badge}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-bold text-gray-900">{fmt(p.price)}</div>
                      {p.oldPrice && <div className="text-xs text-gray-400 line-through">{fmt(p.oldPrice)}</div>}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.stock === 0 ? "bg-red-100 text-red-700"
                        : p.stock < 10 ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}>{p.stock}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${p.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.isActive !== false ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link to={`/admin/urun-duzenle/${p._id || p.id}`}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">
                        Düzenle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
