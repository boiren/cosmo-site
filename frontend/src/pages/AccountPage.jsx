import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  useEffect(() => { if (!user) navigate("/giris") }, [user])
  if (!user) return null

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">Hesabım</h1>
        <div className="card p-8 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-xl text-gray-900">{user.name}</div>
              <div className="text-gray-500">{user.email}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Ad Soyad", value: user.name },
              { label: "E-posta", value: user.email },
              { label: "Telefon", value: user.phone || "—" },
              { label: "Üyelik Tarihi", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "—" },
            ].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                <div className="font-medium text-gray-900">{f.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate("/siparislerim")} className="btn-primary flex-1">Siparişlerim</button>
          <button onClick={() => { logout(); navigate("/") }} className="btn-secondary flex-1">Çıkış Yap</button>
        </div>
      </div>
    </div>
  )
}