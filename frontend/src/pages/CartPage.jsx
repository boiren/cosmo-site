import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { fmt } from "../utils/helpers"
import { useState } from "react"
import { cartAPI } from "../services/api"
import toast from "react-hot-toast"

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal, discountAmount, shipping, total, coupon, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [applying, setApplying] = useState(false)

  const handleCoupon = async () => {
    if (!couponCode.trim()) return
    setApplying(true)
    try {
      const res = await cartAPI.applyCoupon(couponCode)
      applyCoupon(couponCode, res.data.discount)
      toast.success("Kupon uygulandı!")
    } catch (err) {
      toast.error(err.message || "Geçersiz kupon kodu")
    } finally {
      setApplying(false)
    }
  }

  if (items.length === 0) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sepetiniz boş</h2>
        <p className="text-gray-500 mb-8">Harika ürünlerimizi keşfetmeye başlayın.</p>
        <Link to="/urunler" className="btn-primary">Alışverişe Başla</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">Sepetim ({items.length} ürün)</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-5 flex gap-5">
                <img src={item.images[0]} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{item.shortDesc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 disabled:opacity-40">−</button>
                      <span className="px-4 py-1.5 font-semibold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600">+</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">{fmt(item.price * item.qty)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-6 text-lg">Sipariş Özeti</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ara Toplam</span><span>{fmt(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Kupon İndirimi</span><span>-{fmt(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Kargo</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Ücretsiz</span> : fmt(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-blue-600">{fmt(500 - subtotal)} daha ekleyin, kargo ücretsiz!</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Toplam</span><span className="text-lg">{fmt(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              {!coupon ? (
                <div className="flex gap-2 mb-6">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Kupon kodu" className="input-field text-sm flex-1" />
                  <button onClick={handleCoupon} disabled={applying}
                    className="btn-secondary text-sm px-4 flex-shrink-0">
                    {applying ? "..." : "Uygula"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-6">
                  <span className="text-emerald-700 text-sm font-semibold">{coupon} uygulandı</span>
                  <button onClick={removeCoupon} className="text-red-500 text-sm hover:text-red-700">Kaldır</button>
                </div>
              )}

              <Link to="/odeme" className="btn-primary w-full text-center block">Ödemeye Geç →</Link>
              <Link to="/urunler" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4">Alışverişe Devam Et</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}