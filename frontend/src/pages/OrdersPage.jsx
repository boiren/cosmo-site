import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { ordersAPI } from "../services/api"
import { fmt, formatDate, orderStatusMap } from "../utils/helpers"

export default function OrdersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate("/giris"); return }
    ordersAPI.getMyOrders().then(r => setOrders(r.data.orders)).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">Siparişlerim</h1>
        {loading ? (
          <div className="text-center py-20 text-gray-500">Yükleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-500 mb-6">Henüz siparişiniz bulunmuyor.</p>
            <Link to="/urunler" className="btn-primary">Alışverişe Başla</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = orderStatusMap[order.status] || orderStatusMap.pending
              return (
                <div key={order._id} className="card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Sipariş No</div>
                      <div className="font-mono font-bold text-gray-900">{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <span className={"text-xs font-semibold px-3 py-1.5 rounded-full border " + status.color}>{status.label}</span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
                    <div><span className="text-gray-400">Tarih:</span> {formatDate(order.createdAt)}</div>
                    <div><span className="text-gray-400">Toplam:</span> <span className="font-bold text-gray-900">{fmt(order.total)}</span></div>
                    <div><span className="text-gray-400">Ürün Sayısı:</span> {order.items?.length}</div>
                  </div>
                  {order.trackingNumber && (
                    <div className="bg-blue-50 rounded-xl p-3 text-sm">
                      <span className="text-blue-700 font-semibold">Kargo Takip: </span>
                      <span className="font-mono text-blue-600">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}