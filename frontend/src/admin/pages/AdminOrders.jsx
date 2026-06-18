import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { adminAPI } from "../../services/api"
import { fmt, formatDate, orderStatusMap } from "../../utils/helpers"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    adminAPI.getOrders()
      .then(r => setOrders(r.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    const matchSearch = !search ||
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryAddress?.name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} sipariş</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Sipariş No veya Müşteri ara..."
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Tüm Durumlar</option>
            {Object.entries(orderStatusMap).map(([k,v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Sipariş bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Sipariş No","Müşteri","Tarih","Ürün","Tutar","Durum","Ödeme","İşlem"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => {
                  const st = orderStatusMap[order.status] || orderStatusMap.pending
                  const payColor = {
                    success:"bg-emerald-100 text-emerald-700",
                    failed:"bg-red-100 text-red-700",
                    pending:"bg-yellow-100 text-yellow-700",
                    refunded:"bg-gray-100 text-gray-600",
                  }[order.paymentStatus] || "bg-gray-100 text-gray-600"
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-gray-900 text-xs">{order._id?.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 text-sm">{order.deliveryAddress?.name || "—"}</div>
                        <div className="text-xs text-gray-400">{order.deliveryAddress?.city}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded-full">
                          {order.items?.length || 0} ürün
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">{fmt(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payColor}`}>
                          {{success:"Ödendi",failed:"Başarısız",pending:"Bekliyor",refunded:"İade"}[order.paymentStatus] || "Bekliyor"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/admin/siparisler/${order._id}`}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium whitespace-nowrap">
                          Detay →
                        </Link>
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