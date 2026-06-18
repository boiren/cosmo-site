import axios from 'axios'
import toast from 'react-hot-toast'

// =========================================================
// API İstemcisi
//
// Geliştirme (VITE_API_URL boş):
//   baseURL = '/api'  →  Vite proxy /api → localhost:5000
//
// Production (VITE_API_URL='https://api.mihomesanal.com'):
//   baseURL = 'https://api.mihomesanal.com/api'
// =========================================================

const rawBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const BASE_URL = rawBase ? `${rawBase}/api` : '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request — JWT token ekle
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cosmo_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response — hata yönetimi
api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || 'Bir hata oluştu'
    if (err.response?.status === 401) {
      localStorage.removeItem('cosmo_token')
      if (!window.location.pathname.startsWith('/admin/giris')) {
        window.location.href = '/giris'
      }
    } else if (err.response?.status >= 500) {
      toast.error('Sunucu hatası. Lütfen tekrar deneyin.')
    }
    return Promise.reject({ ...err, message: msg })
  }
)

// ── AUTH ──────────────────────────────────────────────────
export const authAPI = {
  register:       (data)  => api.post('/auth/register', data),
  login:          (data)  => api.post('/auth/login', data),
  getProfile:     ()      => api.get('/auth/profile'),
  updateProfile:  (data)  => api.put('/auth/profile', data),
  changePassword: (data)  => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:  (data)  => api.post('/auth/reset-password', data),
}

// ── PRODUCTS ──────────────────────────────────────────────
export const productsAPI = {
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getBySlug:    (slug)   => api.get(`/products/slug/${slug}`),
  getByCategory:(cat)    => api.get(`/products/category/${cat}`),
  search:       (q)      => api.get('/products/search', { params: { q } }),
}

// ── CART ──────────────────────────────────────────────────
export const cartAPI = {
  get:          ()              => api.get('/cart'),
  add:          (data)          => api.post('/cart', data),
  update:       (itemId, qty)   => api.put(`/cart/${itemId}`, { qty }),
  remove:       (itemId)        => api.delete(`/cart/${itemId}`),
  clear:        ()              => api.delete('/cart'),
  applyCoupon:  (code)          => api.post('/cart/coupon', { code }),
}

// ── ORDERS ────────────────────────────────────────────────
export const ordersAPI = {
  create:       (data) => api.post('/orders', data),
  getMyOrders:  ()     => api.get('/orders/my-orders'),
  getById:      (id)   => api.get(`/orders/${id}`),
}

// ── PAYMENTS ──────────────────────────────────────────────
export const paymentsAPI = {
  init:      (data)    => api.post('/payments/init', data),
  getStatus: (orderId) => api.get(`/payments/status/${orderId}`),
}

// ── ADMIN ─────────────────────────────────────────────────
export const adminAPI = {
  getDashboard:       ()             => api.get('/admin/dashboard'),
  getOrders:          (params)       => api.get('/admin/orders', { params }),
  getOrder:           (id)           => api.get(`/admin/orders/${id}`),
  updateOrderStatus:  (id, data)     => api.put(`/admin/orders/${id}/status`, data),
  createProduct:      (data)         => api.post('/admin/products', data),
  updateProduct:      (id, data)     => api.put(`/admin/products/${id}`, data),
  deleteProduct:      (id)           => api.delete(`/admin/products/${id}`),
  getUsers:           (params)       => api.get('/admin/users', { params }),
  getCoupons:         ()             => api.get('/admin/coupons'),
  createCoupon:       (data)         => api.post('/admin/coupons', data),
  updateCoupon:       (id, data)     => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon:       (id)           => api.delete(`/admin/coupons/${id}`),
  getSettings:        ()             => api.get('/admin/settings'),
  updateSettings:     (data)         => api.put('/admin/settings', data),
  updateLegalPage:    (page, data)   => api.put(`/admin/legal-pages/${page}`, data),
}

export default api
