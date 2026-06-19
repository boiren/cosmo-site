import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cosmo_token')
    if (token) {
      authAPI.getProfile()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('cosmo_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

const login = async (email, password) => {
  const res = await authAPI.login({ email, password })
  const data = res.data.data || res.data
  const { token, user } = data
  localStorage.setItem("cosmo_token", token)
  setUser(user)
  return user
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    const { token, user } = res.data
    localStorage.setItem('cosmo_token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('cosmo_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
