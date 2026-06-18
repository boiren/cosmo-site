import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", kvkk: false })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error("Şifreler eşleşmiyor"); return }
    if (!form.kvkk) { toast.error("KVKK metnini onaylamanız gerekiyor"); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      toast.success("Hesabınız oluşturuldu")
      navigate("/")
    } catch (err) {
      toast.error(err.message || "Kayıt başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">C</div>
          <h1 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h1>
          <p className="text-gray-500 mt-2">Cosmo Technology ailesine katılın</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key:"name", label:"Ad Soyad", type:"text", placeholder:"Ad Soyad" },
              { key:"email", label:"E-posta", type:"email", placeholder:"ornek@email.com" },
              { key:"phone", label:"Telefon", type:"tel", placeholder:"05XX XXX XX XX" },
              { key:"password", label:"Şifre", type:"password", placeholder:"En az 8 karakter" },
              { key:"confirm", label:"Şifre Tekrar", type:"password", placeholder:"••••••••" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} required value={form[f.key]} placeholder={f.placeholder}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="input-field" />
              </div>
            ))}
            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input type="checkbox" checked={form.kvkk} onChange={e => setForm(p => ({ ...p, kvkk: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 mt-0.5" />
              <span className="text-sm text-gray-600">
                <Link to="/kvkk" target="_blank" className="text-blue-600 hover:underline">KVKK Aydınlatma Metni</Link>'ni okudum ve onaylıyorum.
              </span>
            </label>
            <button type="submit" disabled={loading} className={"btn-primary w-full mt-2 " + (loading ? "opacity-70 cursor-not-allowed" : "")}>
              {loading ? "Kayıt oluşturuluyor..." : "Üye Ol"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Zaten üye misiniz?{" "}
            <Link to="/giris" className="text-blue-600 font-semibold hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  )
}