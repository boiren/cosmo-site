// ============================================================
// AdminContext — API-first, localStorage fallback
// ============================================================
import {
  createContext, useContext, useReducer,
  useEffect, useState, useCallback, useRef,
} from "react"
import { PRODUCTS as STATIC_PRODUCTS } from "../data/products"

const AdminContext = createContext(null)

const DEMO_CREDENTIALS = [
  { email: "admin@cosmo.com",       password: "123456",    name: "Cosmo Admin" },
  { email: "admin@mihomesanal.com", password: "Admin123!", name: "Mi Home Admin" },
]

// ── Env-aware base URL ────────────────────────────────────────
// VITE_API_URL boşsa Vite proxy'si /api → localhost:5000 yönlendirir
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

// ── localStorage helpers ─────────────────────────────────────
const LS = {
  get: (k, fb = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
  del: (k)    => { try { localStorage.removeItem(k) } catch {} },
}

const LS_AUTH     = "cosmo_admin_auth"
const LS_PRODUCTS = "cosmo_admin_products"

const pid = (p) => String(p?._id || p?.id || "")

// ── Reducer ──────────────────────────────────────────────────
const reducer = (state, action) => {
  let next
  switch (action.type) {
    case "SET":    next = action.payload; break
    case "ADD":    next = [action.payload, ...state]; break
    case "UPDATE": next = state.map(p => pid(p) === pid(action.payload) ? { ...p, ...action.payload } : p); break
    case "DELETE": next = state.filter(p => pid(p) !== String(action.payload)); break
    default: return state
  }
  LS.set(LS_PRODUCTS, next)
  return next
}

const initProducts = () => {
  const cached = LS.get(LS_PRODUCTS)
  if (Array.isArray(cached) && cached.length > 0) return cached
  const fallback = STATIC_PRODUCTS.map(p => ({ ...p, _id: String(p.id) }))
  LS.set(LS_PRODUCTS, fallback)
  return fallback
}

// ── API fetch helper ─────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("cosmo_token")
  const url   = `${API_BASE}${path}`
  const res   = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    signal: options.signal ?? AbortSignal.timeout(8000),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
  return data
}

// ── Provider ─────────────────────────────────────────────────
export function AdminProvider({ children }) {
  const [admin,           setAdmin]          = useState(() => LS.get(LS_AUTH))
  const [authError,       setAuthError]      = useState("")
  const [products,        dispatch]          = useReducer(reducer, null, initProducts)
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [backendOnline,   setBackendOnline]  = useState(false)
  const [backendChecked,  setBackendChecked] = useState(false)
  const fetchedRef = useRef(false)

  // ── Fetch products from API ────────────────────────────────
  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setLoadingProducts(true)
    try {
      const data = await apiFetch("/api/products?limit=100&sort=featured")
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        dispatch({ type: "SET", payload: data.products })
        return true
      }
    } catch {
      // silent fail — fallback data stays
    } finally {
      if (!silent) setLoadingProducts(false)
    }
    return false
  }, [])

  // ── Init ──────────────────────────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const init = async () => {
      let online = false
      try {
        const r = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(3000) })
        online = r.ok
      } catch { /* offline */ }

      setBackendOnline(online)
      setBackendChecked(true)

      if (online) {
        await fetchProducts()
      } else {
        setLoadingProducts(false)
      }
    }
    init()
  }, [fetchProducts])

  // ── Auth ──────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthError("")

    // 1. Backend login
    if (backendOnline) {
      try {
        const data = await apiFetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        if (data.success && data.user?.role === "admin") {
          localStorage.setItem("cosmo_token", data.token)
          setAdmin(data.user)
          LS.set(LS_AUTH, data.user)
          fetchProducts(true)
          return true
        }
        setAuthError(data.message || "Admin yetkisi gerekli")
        return false
      } catch (err) {
        setAuthError(err.message || "Giriş başarısız")
        return false
      }
    }

    // 2. Demo credentials (offline fallback)
    const cred = DEMO_CREDENTIALS.find(c => c.email === email.trim() && c.password === password)
    if (cred) {
      const user = { email: cred.email, name: cred.name, role: "admin" }
      setAdmin(user)
      LS.set(LS_AUTH, user)
      return true
    }

    setAuthError("E-posta veya şifre hatalı")
    return false
  }, [backendOnline, fetchProducts])

  const logout = useCallback(() => {
    setAdmin(null)
    LS.del(LS_AUTH)
    localStorage.removeItem("cosmo_token")
  }, [])

  // ── Change password ────────────────────────────────────────
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const data = await apiFetch("/api/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return data
  }, [])

  // ── Product CRUD ───────────────────────────────────────────
  const addProduct = useCallback(async (data) => {
    if (backendOnline) {
      try {
        const result = await apiFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(data),
        })
        if (result.success && result.product) {
          dispatch({ type: "ADD", payload: result.product })
          return result.product
        }
      } catch { /* fall through to local */ }
    }
    const local = { ...data, _id: String(Date.now()), id: Date.now() }
    dispatch({ type: "ADD", payload: local })
    return local
  }, [backendOnline])

  const updateProduct = useCallback(async (id, data) => {
    // Optimistic update
    dispatch({ type: "UPDATE", payload: { ...data, _id: String(id), id } })
    if (backendOnline) {
      try {
        const result = await apiFetch(`/api/admin/products/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
        if (result.success && result.product) {
          dispatch({ type: "UPDATE", payload: result.product })
          return result.product
        }
      } catch { /* optimistic stays */ }
    }
  }, [backendOnline])

  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: "DELETE", payload: String(id) })
    if (backendOnline) {
      try {
        await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" })
      } catch { /* local already deleted */ }
    }
  }, [backendOnline])

  const refreshProducts = useCallback(async () => {
    if (backendOnline) await fetchProducts()
  }, [backendOnline, fetchProducts])

  const resetToDemo = useCallback(() => {
    const initial = STATIC_PRODUCTS.map(p => ({ ...p, _id: String(p.id) }))
    dispatch({ type: "SET", payload: initial })
  }, [])

  const stats = {
    totalProducts: products.length,
    inStock:       products.filter(p => (p.stock ?? 0) > 0).length,
    outOfStock:    products.filter(p => (p.stock ?? 0) === 0).length,
    featured:      products.filter(p => p.featured).length,
  }

  return (
    <AdminContext.Provider value={{
      admin, login, logout, authError, changePassword,
      products, loadingProducts,
      addProduct, updateProduct, deleteProduct,
      refreshProducts, resetToDemo,
      backendOnline, backendChecked,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be inside AdminProvider")
  return ctx
}
