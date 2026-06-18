import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import toast from "react-hot-toast"

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role !== "admin") {
        toast.error("Admin yetkisi gerekli")
        return
      }
      navigate("/admin")
    } catch (err) {
      toast.error(err.message || "Giriş başarısız")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <img
            src="/images/logo/logo-white.png"
            srcSet="/images/logo/logo-white.png 1x, /images/logo/logo-white-2x.png 2x"
            alt="Cosmo Technology"
            width="140"
            height="81"
            className="h-10 w-auto object-contain mx-auto mb-4 opacity-90"
          />
          <h1 className="text-xl font-bold text-white">Admin Girişi</h1>
          <p className="text-gray-500 text-sm mt-1">Cosmo Technology Yönetim Paneli</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-5 border border-gray-800">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">E-posta</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@mihomesanal.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Şifre</label>
            <input
              type="password" required value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className={"w-full py-3 rounded-xl font-semibold text-sm transition-all " +
              (loading ? "bg-blue-800 text-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-blue-900/30 hover:shadow-md")}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-6">Cosmo Technology · mihomesanal.com</p>
      </div>
    </div>
  )
}