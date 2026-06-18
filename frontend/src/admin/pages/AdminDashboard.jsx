import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { adminAPI } from "../../services/api"
import { fmt, formatDate, orderStatusMap } from "../../utils/helpers"

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const STATS = data ? [
    { label: "Toplam Gelir",      value: fmt(data.totalRevenue || 0), icon: "💰", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    { label: "Toplam Sipariş",    value: data.totalOrders || 0,       icon: "📦", bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-100" },
    { label: "Toplam Kullanıcı",  value: data.totalUsers || 0,        icon: "👥", bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-100" },
    { label: "Bekleyen Sipariş",  value: data.pendingOrders || 0,     icon: "⏳", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100" },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 text-sm">Yükleniyor...</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString("tr-TR", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        <Link to="/admin/urunler/ekle"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
          <span>+</span> Ürün Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {STATS.map((s, i) => (
          <div key={i} className={`rounded-2xl p-6 border ${s.bg} ${s.border}`}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</div>
            <div className="text-sm font-medium text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Son Siparişler</h2>
            <Link to="/admin/siparisler" className="text-sm text-blue-600 hover:underline font-medium">Tümünü Gör →</Link>
          </div>
          {data?.recentOrders?.length > 0 ? (
            <div className="space-y-1">
              {data.recentOrders.map(order => {
                const st = orderStatusMap[order.status] || orderStatusMap.pending
                return (
                  <Link key={order._id} to={`/admin/siparisler/${order._id}`}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        #{order._id?.slice(-4).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{order.deliveryAddress?.name || "Müşteri"}</div>
                        <div className="text-xs text-gray-400">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color}`}>{st.label}</span>
                      <span className="font-bold text-gray-900 text-sm">{fmt(order.total)}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">Henüz sipariş yok</div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: "/admin/urunler/ekle",  icon: "📦", label: "Ürün Ekle" },
              { to: "/admin/siparisler",    icon: "🛒", label: "Siparişler" },
              { to: "/admin/kuponlar",      icon: "🏷️", label: "Kupon Ekle" },
              { to: "/admin/kullanicilar",  icon: "👥", label: "Kullanıcılar" },
              { to: "/admin/ayarlar",       icon: "⚙️", label: "Ayarlar" },
              { to: "/",                    icon: "🌐", label: "Siteye Git" },
            ].map(item => (
              <Link key={item.to} to={item.to}
                className="bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-xl p-4 text-center transition-all duration-200 group">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-xs font-semibold text-gray-600 group-hover:text-blue-700 transition-colors">{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}