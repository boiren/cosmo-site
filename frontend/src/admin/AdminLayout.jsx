import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"

const NAV = [
  { to:"/admin",              label:"Dashboard",     d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to:"/admin/urunler",      label:"Ürünler",       d:"M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { to:"/admin/siparisler",   label:"Siparişler",    d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { to:"/admin/kullanicilar", label:"Kullanıcılar",  d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { to:"/admin/kuponlar",     label:"Kuponlar",      d:"M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
  { to:"/admin/ayarlar",      label:"Ayarlar",       d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate("/admin/giris")
    else if (user.role !== "admin") navigate("/")
  }, [user])

  if (!user || user.role !== "admin") return null

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-950 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div>
            <img
              src="/images/logo/logo-white.png"
              srcSet="/images/logo/logo-white.png 1x, /images/logo/logo-white-2x.png 2x"
              alt="Cosmo Technology"
              width="100"
              height="58"
              className="h-8 w-auto object-contain opacity-90 mb-1"
            />
            <div className="text-[9px] text-gray-500 tracking-widest font-medium">ADMIN PANEL</div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => {
            const active = location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to))
            return (
              <Link key={item.to} to={item.to}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors " +
                  (active ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800")}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path d={item.d}/>
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400 mb-1 font-medium">{user.name}</div>
          <div className="text-xs text-gray-600 mb-3">{user.email}</div>
          <button onClick={() => { logout(); navigate("/admin/giris") }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}