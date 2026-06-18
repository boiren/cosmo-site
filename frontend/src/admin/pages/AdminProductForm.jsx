import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { adminAPI, productsAPI } from "../../services/api"
import toast from "react-hot-toast"

const CATEGORIES = [
  { value: "arac-bakim",   label: "Araç Bakım" },
  { value: "dalis",        label: "Dalış" },
  { value: "outdoor-kamp", label: "Outdoor & Kamp" },
  { value: "agiz-bakim",   label: "Ağız Bakım" },
]

const BADGE_COLORS = ["blue","red","green","purple","orange"]

const emptyForm = {
  name: "", slug: "", shortDesc: "", description: "",
  category: "arac-bakim", price: "", oldPrice: "", stock: "", sku: "",
  badge: "", badgeColor: "blue", featured: false,
  images: "", features: "", seoTitle: "", seoDesc: "",
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    productsAPI.getById(id)
      .then(r => {
        const p = r.data.product
        setForm({
          name: p.name || "", slug: p.slug || "", shortDesc: p.shortDesc || "",
          description: p.description || "", category: p.category || "arac-bakim",
          price: p.price || "", oldPrice: p.oldPrice || "", stock: p.stock ?? "",
          sku: p.sku || "", badge: p.badge || "", badgeColor: p.badgeColor || "blue",
          featured: p.featured || false,
          images: (p.images || []).join("\n"),
          features: (p.features || []).join("\n"),
          seoTitle: p.seo?.title || "", seoDesc: p.seo?.description || "",
        })
      })
      .catch(() => toast.error("Ürün yüklenemedi"))
      .finally(() => setFetching(false))
  }, [id])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  // Otomatik slug oluştur
  const handleNameChange = (v) => {
    set("name", v)
    if (!isEdit) {
      const slug = v.toLowerCase()
        .replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ş/g,"s")
        .replace(/ı/g,"i").replace(/ö/g,"o").replace(/ç/g,"c")
        .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")
      set("slug", slug)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock) {
      toast.error("Ad, fiyat ve stok zorunludur"); return
    }
    setLoading(true)
    try {
      const data = {
        ...form,
        price:    parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
        stock:    parseInt(form.stock),
        images:   form.images.split("\n").map(s=>s.trim()).filter(Boolean),
        features: form.features.split("\n").map(s=>s.trim()).filter(Boolean),
        seo:      { title: form.seoTitle, description: form.seoDesc },
      }
      delete data.seoTitle; delete data.seoDesc

      if (isEdit) {
        await adminAPI.updateProduct(id, data)
        toast.success("Ürün güncellendi")
      } else {
        await adminAPI.createProduct(data)
        toast.success("Ürün oluşturuldu")
      }
      navigate("/admin/urunler")
    } catch (err) {
      toast.error(err.message || "İşlem başarısız")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="text-center py-20 text-gray-400">Yükleniyor...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/admin/urunler")} className="text-gray-400 hover:text-gray-700 text-sm">← Geri</button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-3">Temel Bilgiler</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ürün Adı *</label>
              <input value={form.name} onChange={e => handleNameChange(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Profesyonel Araç Bakım Seti" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL (Slug)</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="profesyonel-arac-bakim-seti" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kısa Açıklama</label>
              <input value={form.shortDesc} onChange={e => set("shortDesc", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ürün kartında görünen kısa açıklama" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Detaylı Açıklama</label>
              <textarea rows={5} value={form.description} onChange={e => set("description", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Ürün detay sayfasında görünen açıklama..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Özellikler (Her satıra bir özellik)</label>
              <textarea rows={4} value={form.features} onChange={e => set("features", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder={"Nano koruma teknolojisi\nUV filtreli formül\n2 yıl garanti"} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-3">Görseller</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Görsel URL'leri (Her satıra bir URL)</label>
              <textarea rows={4} value={form.images} onChange={e => set("images", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} />
              <p className="text-xs text-gray-400 mt-1">İlk URL kapak görseli olarak kullanılır</p>
            </div>
            {/* Önizleme */}
            {form.images.trim() && (
              <div className="flex gap-3 flex-wrap">
                {form.images.split("\n").filter(Boolean).slice(0,4).map((url, i) => (
                  <div key={i} className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-3">SEO</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SEO Başlığı</label>
              <input value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Profesyonel Araç Bakım Seti | Cosmo Technology" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Açıklama</label>
              <textarea rows={2} value={form.seoDesc} onChange={e => set("seoDesc", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Ürün için meta açıklama (160 karakter önerilir)" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-3">Fiyat & Stok</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Fiyat (TL) *</label>
              <input type="number" min="0" step="0.01" required value={form.price} onChange={e => set("price", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1299" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Eski Fiyat (TL)</label>
              <input type="number" min="0" step="0.01" value={form.oldPrice} onChange={e => set("oldPrice", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1699 (indirim için)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stok Adedi *</label>
              <input type="number" min="0" required value={form.stock} onChange={e => set("stock", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU Kodu</label>
              <input value={form.sku} onChange={e => set("sku", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CT-AB-001" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900 border-b border-gray-50 pb-3">Kategori & Etiket</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rozet Yazısı</label>
              <input value={form.badge} onChange={e => set("badge", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Çok Satan / Yeni / Sınırlı" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rozet Rengi</label>
              <div className="flex gap-2">
                {BADGE_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set("badgeColor", c)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      form.badgeColor === c ? "border-gray-900 scale-110" : "border-transparent"
                    } bg-${c}-500`}
                    style={{ backgroundColor: { blue:"#3b82f6", red:"#ef4444", green:"#22c55e", purple:"#a855f7", orange:"#f97316" }[c] }}
                  />
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">Ana sayfada öne çıkar</span>
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <button type="submit" disabled={loading}
              className={"w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all " +
                (loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-blue-100 hover:shadow-md")}>
              {loading ? "Kaydediliyor..." : isEdit ? "Değişiklikleri Kaydet" : "Ürünü Ekle"}
            </button>
            <button type="button" onClick={() => navigate("/admin/urunler")}
              className="w-full py-3 rounded-xl text-gray-600 font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
              İptal
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}