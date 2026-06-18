import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import { fmt, formatDate, orderStatusMap, paymentStatusMap } from "../../utils/helpers"
import toast from "react-hot-toast"

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ status:"", trackingNumber:"", carrier:"" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminAPI.getOrder(id)
      .then(r => {
        setOrder(r.data.order)
        setForm({
          status:         r.data.order.status || "pending",
          trackingNumber: r.data.order.trackingNumber || "",
          carrier:        r.data.order.carrier || "",
        })
      })
      .catch(() => navigate("/admin/siparisler"))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const updated = await adminAPI.updateOrderStatus(id, form)
      setOrder(updated.data.order)
      toast.success("Sipariş güncellendi")
    } catch {
      toast.error("Güncelleme başarısız")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
  if (!order)  return null

  const st = orderStatusMap[order.status] || orderStatusMap.pending
  const py = paymentStatusMap?.[order.paymentStatus] || { label:"Bekliyor", color:"text-yellow-700 bg-yellow-50" }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button onClick={() => navigate("/admin/siparisler")}
          className="text-gray-400 hover:text-gray-700 text-sm transition-colors">← Siparişlere Dön</button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sipariş #{order._id?.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${st.color}`}>{st.label}</span>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${py.color}`}>{py.label}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Sipariş İçeriği</h2>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{item.name || item.product?.name}</div>
                    <div className="text-sm text-gray-400">Birim: {fmt(item.price)} × {item.qty}</div>
                  </div>
                  <div className="font-bold text-gray-900 text-sm">{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500"><span>Ara Toplam</span><span>{fmt(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>İndirim</span><span>-{fmt(order.discount)}</span></div>}
              <div className="flex justify-between text-sm text-gray-500"><span>Kargo</span><span>{order.shipping === 0 ? "Ücretsiz" : fmt(order.shipping)}</span></div>
              {order.coupon && <div className="flex justify-between text-sm text-blue-600"><span>Kupon ({order.coupon})</span><span>uygulandı</span></div>}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Toplam</span><span>{fmt(order.total)}</span></div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Teslimat Adresi", addr: order.deliveryAddress },
              { title: "Fatura Adresi",   addr: order.billingAddress || order.deliveryAddress },
            ].map(({ title, addr }) => addr && (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">{title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="font-medium text-gray-900">{addr.name}</p>
                  {addr.phone && <p>{addr.phone}</p>}
                  {addr.address && <p>{addr.address}</p>}
                  {addr.district && <p>{addr.district} / {addr.city}</p>}
                  {addr.zip && <p>{addr.zip}</p>}
                  {addr.company && <p className="mt-2 text-gray-500">Firma: {addr.company}</p>}
                  {addr.taxId && <p className="text-gray-500">Vergi/TC: {addr.taxId}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-3 text-sm">Ödeme Bilgisi</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-400 text-xs mb-1">Ödeme Durumu</div>
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${py.color}`}>{py.label}</span>
              </div>
              {order.paymentMethod && <div>
                <div className="text-gray-400 text-xs mb-1">Yöntem</div>
                <div className="font-medium text-gray-900">{order.paymentMethod}</div>
              </div>}
              {order.paymentReference && <div>
                <div className="text-gray-400 text-xs mb-1">Referans No</div>
                <div className="font-mono text-gray-700 text-xs">{order.paymentReference}</div>
              </div>}
            </div>
          </div>
        </div>

        {/* Right column — Update panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
            <h2 className="font-bold text-gray-900 mb-5">Sipariş Güncelle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sipariş Durumu</label>
                <select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {Object.entries(orderStatusMap).map(([k,v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kargo Firması</label>
                <select value={form.carrier} onChange={e => setForm(p=>({...p,carrier:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seçiniz</option>
                  {["Yurtiçi Kargo","Aras Kargo","MNG Kargo","PTT Kargo","Sürat Kargo","Sendeo","UPS"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Takip Numarası</label>
                <input value={form.trackingNumber} onChange={e => setForm(p=>({...p,trackingNumber:e.target.value}))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kargo takip numarası" />
              </div>
              <button onClick={handleUpdate} disabled={saving}
                className={"w-full py-3 rounded-xl text-white font-semibold text-sm transition-all " +
                  (saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700")}>
                {saving ? "Kaydediliyor..." : "Güncelle"}
              </button>
            </div>

            {/* Tracking display */}
            {order.trackingNumber && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">Kargo Takip</div>
                <div className="font-mono font-bold text-blue-800">{order.trackingNumber}</div>
                {order.carrier && <div className="text-xs text-blue-600 mt-1">{order.carrier}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}