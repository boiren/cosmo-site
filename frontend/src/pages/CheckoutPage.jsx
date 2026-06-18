import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { ordersAPI } from "../services/api"
import { fmt } from "../utils/helpers"
import toast from "react-hot-toast"

const STEPS = ["Teslimat", "Fatura", "Ödeme"]

export default function CheckoutPage() {
  const { items, subtotal, discountAmount, shipping, total, coupon, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [delivery, setDelivery] = useState({ name: user?.name || "", phone: "", address: "", city: "", district: "", zip: "" })
  const [billing, setBilling] = useState({ same: true, type: "individual", name: "", taxId: "", taxOffice: "", company: "", address: "", city: "" })
  const [agreements, setAgreements] = useState({ mss: false, onbilgi: false, kvkk: false })

  const updateDelivery = (k, v) => setDelivery(prev => ({ ...prev, [k]: v }))
  const updateBilling = (k, v) => setBilling(prev => ({ ...prev, [k]: v }))

  const nextStep = () => {
    if (step === 0) {
      if (!delivery.name || !delivery.phone || !delivery.address || !delivery.city) {
        toast.error("Lütfen teslimat bilgilerini eksiksiz doldurun"); return
      }
    }
    if (step < 2) setStep(s => s + 1)
  }

  const placeOrder = async () => {
    if (!agreements.mss || !agreements.onbilgi || !agreements.kvkk) {
      toast.error("Lütfen tüm sözleşmeleri onaylayın"); return
    }
    setLoading(true)
    try {
      const res = await ordersAPI.create({
        items: items.map(i => ({ product: i.id, qty: i.qty, price: i.price })),
        deliveryAddress: delivery,
        billingAddress: billing.same ? delivery : billing,
        coupon,
        subtotal, shipping, discount: discountAmount, total,
      })
      clearCart()
      navigate(`/siparis-tamamlandi/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.message || "Sipariş oluşturulamadı")
      navigate("/siparis-basarisiz")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Sepetiniz boş</h2>
        <Link to="/urunler" className="btn-primary">Ürünlere Git</Link>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">Ödeme</h1>

        {/* Steps */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={"flex items-center gap-2 " + (i <= step ? "text-blue-600" : "text-gray-400")}>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold " +
                  (i < step ? "bg-blue-600 text-white" : i === step ? "bg-blue-100 text-blue-700 border-2 border-blue-600" : "bg-gray-100 text-gray-400")}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className="font-semibold text-sm hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={"flex-1 h-0.5 mx-3 min-w-[40px] " + (i < step ? "bg-blue-600" : "bg-gray-200")} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 0: Delivery */}
            {step === 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-6 text-lg">Teslimat Bilgileri</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Ad Soyad", type: "text", full: false },
                    { key: "phone", label: "Telefon", type: "tel", full: false },
                    { key: "address", label: "Adres", type: "text", full: true },
                    { key: "district", label: "İlçe", type: "text", full: false },
                    { key: "city", label: "İl", type: "text", full: false },
                    { key: "zip", label: "Posta Kodu", type: "text", full: false },
                  ].map(f => (
                    <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                      <input type={f.type} value={delivery[f.key]} onChange={e => updateDelivery(f.key, e.target.value)}
                        className="input-field" />
                    </div>
                  ))}
                </div>
                <button onClick={nextStep} className="btn-primary mt-6 w-full">Devam Et →</button>
              </div>
            )}

            {/* Step 1: Billing */}
            {step === 1 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-6 text-lg">Fatura Bilgileri</h2>
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <input type="checkbox" checked={billing.same} onChange={e => updateBilling("same", e.target.checked)}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Teslimat adresiyle aynı</span>
                </label>
                {!billing.same && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {["individual", "corporate"].map(t => (
                        <button key={t} onClick={() => updateBilling("type", t)}
                          className={"flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors " +
                            (billing.type === t ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600")}>
                          {t === "individual" ? "Bireysel" : "Kurumsal"}
                        </button>
                      ))}
                    </div>
                    {billing.type === "corporate" && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Şirket Adı</label>
                          <input value={billing.company} onChange={e => updateBilling("company", e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Vergi No</label>
                          <input value={billing.taxId} onChange={e => updateBilling("taxId", e.target.value)} className="input-field" /></div>
                        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Vergi Dairesi</label>
                          <input value={billing.taxOffice} onChange={e => updateBilling("taxOffice", e.target.value)} className="input-field" /></div>
                      </div>
                    )}
                    {billing.type === "individual" && (
                      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">TCKN</label>
                        <input value={billing.taxId} onChange={e => updateBilling("taxId", e.target.value)} className="input-field" /></div>
                    )}
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1">Geri</button>
                  <button onClick={nextStep} className="btn-primary flex-1">Devam Et →</button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-6 text-lg">Ödeme</h2>

                {/* Payment placeholder */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-amber-800 mb-2">Sanal POS Entegrasyonu Yakında</h3>
                  <p className="text-amber-700 text-sm leading-relaxed mb-4">
                    iyzico, PayTR, Param veya banka sanal POS entegrasyonu yakında aktif olacaktır.
                    Şu anda siparişinizi oluşturabilir, ödemenizi sonradan tamamlayabilirsiniz.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["iyzico", "PayTR", "Param", "Sipay"].map(p => (
                      <span key={p} className="bg-white border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>

                {/* ── SANAL POS ENTEGRASYON NOKTASI ──
                    Aşağıdaki div içine ödeme sağlayıcı formu/widget'ı entegre edilecek.
                    Örnek: iyzico ödeme formu, PayTR iframe, vs.
                    POST /api/payments/init → token al → sağlayıcı formunu göster
                */}
                <div id="payment-provider-container" className="hidden">
                  {/* Provider form buraya */}
                </div>

                {/* Agreements */}
                <div className="space-y-3 mb-6">
                  {[
                    { key: "mss", label: "Mesafeli Satış Sözleşmesi'ni", link: "/mesafeli-satis-sozlesmesi" },
                    { key: "onbilgi", label: "Ön Bilgilendirme Formu'nu", link: "/on-bilgilendirme-formu" },
                    { key: "kvkk", label: "KVKK Aydınlatma Metni'ni", link: "/kvkk" },
                  ].map(a => (
                    <label key={a.key} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={agreements[a.key]} onChange={e => setAgreements(prev => ({ ...prev, [a.key]: e.target.checked }))}
                        className="w-4 h-4 accent-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        <Link to={a.link} target="_blank" className="text-blue-600 hover:underline">{a.label}</Link>{" "}
                        okudum ve onaylıyorum.
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Geri</button>
                  <button onClick={placeOrder} disabled={loading}
                    className={"btn-primary flex-1 " + (loading ? "opacity-70 cursor-not-allowed" : "")}>
                    {loading ? "İşleniyor..." : "Siparişi Tamamla"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-5">Sipariş Özeti</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold">{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Ara Toplam</span><span>{fmt(subtotal)}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>İndirim</span><span>-{fmt(discountAmount)}</span></div>}
                <div className="flex justify-between text-sm text-gray-600"><span>Kargo</span><span>{shipping === 0 ? "Ücretsiz" : fmt(shipping)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Toplam</span><span>{fmt(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}