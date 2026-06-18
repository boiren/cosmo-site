// ============================================================
// utils/formatters.js
// ============================================================
export const formatPrice = (amount) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));

export const calcDiscount = (price, oldPrice) =>
  oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0;

// ============================================================
// utils/validators.js
// ============================================================
export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
export const isValidPhone = (phone) => /^(\+90|0)?[0-9]{10}$/.test(phone.replace(/\s/g, ''));
export const isValidTC = (tc) => /^\d{11}$/.test(tc);
export const isValidVKN = (vkn) => /^\d{10}$/.test(vkn);

// ============================================================
// utils/orderStatus.js — Sipariş durum çevirileri
// ============================================================
export const ORDER_STATUS = {
  beklemede: { label: 'Beklemede', color: 'bg-amber-100 text-amber-800' },
  onaylandi: { label: 'Onaylandı', color: 'bg-blue-100 text-blue-800' },
  hazirlaniyor: { label: 'Hazırlanıyor', color: 'bg-indigo-100 text-indigo-800' },
  kargoda: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800' },
  teslim_edildi: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  iptal: { label: 'İptal', color: 'bg-red-100 text-red-800' },
  iade: { label: 'İade', color: 'bg-slate-100 text-slate-800' },
};

export const PAYMENT_STATUS = {
  beklemede: { label: 'Beklemede', color: 'bg-amber-100 text-amber-800' },
  odendi: { label: 'Ödendi', color: 'bg-green-100 text-green-800' },
  basarisiz: { label: 'Başarısız', color: 'bg-red-100 text-red-800' },
  iade: { label: 'İade Edildi', color: 'bg-slate-100 text-slate-800' },
};
