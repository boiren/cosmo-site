import { useEffect, useState } from "react"
import { adminAPI } from "../../services/api"
import { formatDate } from "../../utils/helpers"

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data.users || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-sm text-gray-400 mt-1">{filtered.length} kullanıcı</p>
        </div>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Ad veya e-posta ara..."
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Kullanıcı bulunamadı</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Kullanıcı","E-posta","Telefon","Rol","Kayıt Tarihi","Durum"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-gray-900">{u.name}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{u.email}</td>
                    <td className="px-5 py-4 text-gray-500">{u.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={"text-xs font-bold px-2.5 py-1 rounded-full " +
                        (u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600")}>
                        {u.role === "admin" ? "👑 Admin" : "Üye"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={"text-xs font-semibold px-2.5 py-1 rounded-full " +
                        (u.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600")}>
                        {u.isActive !== false ? "Aktif" : "Askıya Alınmış"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}