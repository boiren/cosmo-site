import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success("Başarıyla giriş yapıldı")
      navigate("/")
    } catch (err) {
      toast.error(err.message || "Giriş başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">C</div>
          <h1 className="text-2xl font-bold text-gray-900">Hesabınıza Giriş Yapın</h1>
          <p className="text-gray-500 mt-2">Siparişlerinizi takip edin ve daha fazlasını yapın</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field" placeholder="ornek@email.com" />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Şifre</label>
                <Link to="/sifremi-unuttum" className="text-sm text-blue-600 hover:underline">Şifremi Unuttum</Link>
              </div>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className={"btn-primary w-full " + (loading ? "opacity-70 cursor-not-allowed" : "")}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Hesabınız yok mu?{" "}
            <Link to="/uye-ol" className="text-blue-600 font-semibold hover:underline">Üye Ol</Link>
          </p>
        </div>
      </div>
    </div>
  )
}