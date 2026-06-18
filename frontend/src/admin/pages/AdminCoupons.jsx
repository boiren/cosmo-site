import { useEffect, useState } from "react"
import { adminAPI } from "../../services/api"
import { fmt } from "../../utils/helpers"
import toast from "react-hot-toast"

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ code:"", type:"percent", value:"", minOrder:"", usageLimit:"", active:true })

  useEffect(() => {
    adminAPI.getCoupons().then(r => setCoupons(r.data.coupons || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await adminAPI.createCoupon(form)
      setCoupons(prev => [...prev, res.data.coupon])
      setForm({ code:"", type:"percent", value:"", minOrder:"", usageLimit:"", active:true })
      toast.success("Kupon oluşturuldu")
    } catch (err) { toast.error(err.message || "Hata") }
  }

  const handleToggle = async (id, active) => {
    try {
      await adminAPI.updateCoupon(id, { active: !active })
      setCoupons(prev => prev.map(c => c._id === id ? { ...c, active: !active } : c))
    } catch { toast.error("Güncelleme başarısız") }
  }

  const handleDelete = async (id) => {
    if (!confirm("Kuponu silmek istediğinize emin misiniz?")) return
    try {
      await adminAPI.deleteCoupon(id)
      setCoupons(prev => prev.filter(c => c._id !== id))
      toast.success("Kupon silindi")
    } catch { toast.error("Silme başarısız") }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Kupon Yönetimi</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Yeni Kupon Oluştur</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kupon Kodu</label>
              <input required value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value.toUpperCase()}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                placeholder="COSMO20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">İndirim Tipi</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit Tutar (TL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                İndirim Değeri {form.type === "percent" ? "(%)" : "(TL)"}
              </label>
              <input required type="number" min="1" value={form.value}
                onChange={e => setForm(p => ({...p, value: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={form.type === "percent" ? "20" : "100"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Sipariş Tutarı (TL)</label>
              <input type="number" min="0" value={form.minOrder}
                onChange={e => setForm(p => ({...p, minOrder: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0 (limit yok)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kullanım Limiti</label>
              <input type="number" min="1" value={form.usageLimit}
                onChange={e => setForm(p => ({...p, usageLimit: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Boş = sınırsız" />
            </div>
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              Kupon Oluştur
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">Mevcut Kuponlar</h2>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Yükleniyor...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">Henüz kupon oluşturulmadı</div>
          ) : (
            <div className="space-y-3">
              {coupons.map(c => (
                <div key={c._id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div>
                    <div className="font-mono font-bold text-gray-900 text-sm">{c.code}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {c.type === "percent" ? `%${c.value} indirim` : `${c.value} TL indirim`}
                      {c.minOrder > 0 && ` · Min. ${c.minOrder} TL`}
                      {c.usageLimit && ` · ${c.usageCount || 0}/${c.usageLimit} kullanım`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(c._id, c.active)}
                      className={"text-xs font-semibold px-2.5 py-1 rounded-full " +
                        (c.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500")}>
                      {c.active ? "Aktif" : "Pasif"}
                    </button>
                    <button onClick={() => handleDelete(c._id)}
                      className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full hover:bg-red-100">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}