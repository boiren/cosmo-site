import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ordersAPI } from "../services/api"
import { fmt, formatDate } from "../utils/helpers"

export default function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (id) ordersAPI.getById(id).then(r => setOrder(r.data.order)).catch(() => {})
  }, [id])

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Siparişiniz Alındı!</h1>
          <p className="text-gray-500 mb-2">Sipariş numaranız:</p>
          <p className="font-mono font-bold text-blue-600 text-lg mb-6">{id?.slice(-8).toUpperCase()}</p>
          {order && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tarih</span><span className="font-medium">{formatDate(order.createdAt)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Toplam</span><span className="font-bold text-gray-900">{fmt(order.total)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Durum</span><span className="text-yellow-600 font-semibold">İşlemde</span></div>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500 mb-8">Sipariş onayı {order?.deliveryAddress?.name || "e-posta adresinize"} gönderildi.</p>
          <div className="flex gap-3">
            <Link to="/siparislerim" className="btn-secondary flex-1">Siparişlerim</Link>
            <Link to="/" className="btn-primary flex-1">Ana Sayfa</Link>
          </div>
        </div>
      </div>
    </div>
  )
}