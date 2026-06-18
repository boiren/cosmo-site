import { useState, useEffect } from "react"
import { useAdmin } from "../../context/AdminContext"
import { adminAPI } from "../../services/api"
import toast from "react-hot-toast"

const LEGAL_PAGES = [
  { key: "kvkk", label: "KVKK Metni" },
  { key: "gizlilik-politikasi", label: "Gizlilik Politikası" },
  { key: "mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { key: "on-bilgilendirme-formu", label: "Ön Bilgilendirme Formu" },
  { key: "iade-degisim-politikasi", label: "İade ve Değişim Politikası" },
]

export default function AdminSettings() {
  const { changePassword } = useAdmin()
  const [activeTab, setActiveTab] = useState("site")
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [pwLoading, setPwLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { toast.error("Yeni şifreler eşleşmiyor"); return }
    if (pwForm.next.length < 6) { toast.error("En az 6 karakter gerekli"); return }
    setPwLoading(true)
    try {
      await changePassword(pwForm.current, pwForm.next)
      toast.success("Şifre başarıyla değiştirildi")
      setPwForm({ current: "", next: "", confirm: "" })
    } catch (err) {
      toast.error(err.message || "Şifre değiştirilemedi")
    } finally { setPwLoading(false) }
  }
  const [settings, setSettings] = useState({
    siteName: "Cosmo Technology",
    siteDesc: "Premium teknoloji ürünleri",
    phone: "0500 000 0000",
    email: "destek@mihomesanal.com",
    whatsapp: "905000000000",
    taxName: "Mi Home Sanal Mağazacılık",
    taxNo: "",
    taxOffice: "",
    address: "",
    freeShippingLimit: 500,
    ga4Id: "",
    gscCode: "",
  })
  const [activeLegal, setActiveLegal] = useState("kvkk")
  const [legalContent, setLegalContent] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminAPI.getSettings().then(r => {
      if (r.data.settings) setSettings(prev => ({ ...prev, ...r.data.settings }))
    }).catch(() => {})
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await adminAPI.updateSettings(settings)
      toast.success("Ayarlar kaydedildi")
    } catch { toast.error("Kaydetme başarısız") }
    finally { setSaving(false) }
  }

  const handleSaveLegal = async () => {
    setSaving(true)
    try {
      await adminAPI.updateLegalPage(activeLegal, { content: legalContent })
      toast.success("Yasal sayfa güncellendi")
    } catch { toast.error("Kaydetme başarısız") }
    finally { setSaving(false) }
  }

  const TABS = [
    { key: "site", label: "Site Ayarları" },
    { key: "seo", label: "SEO & Analytics" },
    { key: "legal",    label: "Yasal Sayfalar" },
    { key: "password", label: "🔑 Şifre Değiştir" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Site Ayarları</h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={"px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px " +
              (activeTab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Site Settings */}
      {activeTab === "site" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { key:"siteName", label:"Site Adı" },
              { key:"siteDesc", label:"Site Açıklaması" },
              { key:"phone", label:"Telefon" },
              { key:"email", label:"E-posta" },
              { key:"whatsapp", label:"WhatsApp No (ülke kodu ile)" },
              { key:"taxName", label:"Firma Adı" },
              { key:"taxNo", label:"Vergi No" },
              { key:"taxOffice", label:"Vergi Dairesi" },
              { key:"freeShippingLimit", label:"Ücretsiz Kargo Limiti (TL)", type:"number" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type || "text"} value={settings[f.key]}
                  onChange={e => setSettings(p => ({...p, [f.key]: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres</label>
              <textarea rows={2} value={settings.address}
                onChange={e => setSettings(p => ({...p, address: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          <button onClick={handleSaveSettings} disabled={saving}
            className={"mt-6 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-colors " +
              (saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700")}>
            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </div>
      )}

      {/* SEO & Analytics */}
      {activeTab === "seo" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics 4 ID</label>
              <input value={settings.ga4Id} onChange={e => setSettings(p => ({...p, ga4Id: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="G-XXXXXXXXXX" />
              <p className="text-xs text-gray-500 mt-1">Google Analytics 4 ölçüm kimliği</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Search Console Doğrulama Kodu</label>
              <input value={settings.gscCode} onChange={e => setSettings(p => ({...p, gscCode: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="google-site-verification kodu" />
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">SEO Notları:</p>
              <ul className="space-y-1 text-blue-600">
                <li>• Ürün sayfaları /urunler/[slug] formatında SEO uyumludur</li>
                <li>• /sitemap.xml backend tarafından otomatik oluşturulur</li>
                <li>• /robots.txt dosyası backend tarafında yönetilir</li>
              </ul>
            </div>
          </div>
          <button onClick={handleSaveSettings} disabled={saving}
            className={"mt-6 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-colors " +
              (saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700")}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      )}

      {/* Legal Pages */}
      {activeTab === "legal" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex gap-2 flex-wrap mb-5">
            {LEGAL_PAGES.map(p => (
              <button key={p.key} onClick={() => setActiveLegal(p.key)}
                className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " +
                  (activeLegal === p.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                {p.label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {LEGAL_PAGES.find(p => p.key === activeLegal)?.label}
            </label>
            <textarea rows={20} value={legalContent}
              onChange={e => setLegalContent(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              placeholder="Sayfa içeriğini buraya girin..." />
          </div>
          <button onClick={handleSaveLegal} disabled={saving}
            className={"mt-4 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-colors " +
              (saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700")}>
            {saving ? "Kaydediliyor..." : "Sayfayı Güncelle"}
          </button>
        </div>
      )}

      {/* ── Şifre Değiştirme ── */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md">
          <h2 className="font-bold text-gray-900 mb-1">Admin Şifresini Değiştir</h2>
          <p className="text-sm text-gray-400 mb-6">Mevcut şifrenizi doğrulayarak yeni şifre belirleyin.</p>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { key: "current", label: "Mevcut Şifre",       placeholder: "••••••••" },
              { key: "next",    label: "Yeni Şifre",         placeholder: "En az 6 karakter" },
              { key: "confirm", label: "Yeni Şifre (Tekrar)", placeholder: "••••••••" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input
                  type="password" required minLength={f.key !== "current" ? 6 : 1}
                  value={pwForm[f.key]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
            <button type="submit" disabled={pwLoading}
              className={"mt-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all " +
                (pwLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700")}>
              {pwLoading ? "Kaydediliyor..." : "Şifreyi Değiştir"}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}