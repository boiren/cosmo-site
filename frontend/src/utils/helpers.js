// Para formatı
export const fmt = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(n)

// İndirim yüzdesi
export const discountPct = (price, oldPrice) =>
  Math.round((1 - price / oldPrice) * 100)

// Stok durum rengi
export const stockStatus = (stock) => {
  if (stock === 0) return { label: 'Stokta Yok', color: 'text-red-600 bg-red-50' }
  if (stock < 10) return { label: `Son ${stock} ürün`, color: 'text-orange-600 bg-orange-50' }
  return { label: 'Stokta Mevcut', color: 'text-green-600 bg-green-50' }
}

// Tarih formatı
export const formatDate = (date) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date))

// Sipariş durumu
export const orderStatusMap = {
  pending:    { label: 'Bekliyor',        color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  processing: { label: 'Hazırlanıyor',    color: 'text-blue-700 bg-blue-50 border-blue-200' },
  shipped:    { label: 'Kargoya Verildi', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  delivered:  { label: 'Teslim Edildi',   color: 'text-green-700 bg-green-50 border-green-200' },
  cancelled:  { label: 'İptal Edildi',    color: 'text-red-700 bg-red-50 border-red-200' },
  refunded:   { label: 'İade Edildi',     color: 'text-gray-700 bg-gray-50 border-gray-200' },
}

// Ödeme durumu
export const paymentStatusMap = {
  pending:   { label: 'Bekliyor',       color: 'text-yellow-700 bg-yellow-50' },
  success:   { label: 'Başarılı',       color: 'text-green-700 bg-green-50'  },
  failed:    { label: 'Başarısız',      color: 'text-red-700 bg-red-50'      },
  refunded:  { label: 'İade Edildi',    color: 'text-gray-700 bg-gray-50'    },
}

// Kısalt
export const truncate = (str, n = 80) => str?.length > n ? str.slice(0, n) + '…' : str

// Slug oluştur
export const slugify = (str) =>
  str.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
     .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
     .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
