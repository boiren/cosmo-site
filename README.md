# 🚀 Cosmo Technology — E-Ticaret Projesi

**Marka:** Cosmo Technology  
**Firma:** Mi Home Sanal Mağazacılık  
**Domain:** mihomesanal.com  
**Stack:** React + Tailwind CSS (Frontend) · Node.js + Express + MongoDB (Backend)

---

## 📁 Proje Yapısı

```
cosmo/
├── frontend/                    # React + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── layout/          # Navbar, Footer
│       │   └── product/         # ProductCard
│       ├── pages/               # Tüm sayfalar
│       ├── admin/               # Admin panel
│       │   ├── AdminLayout.jsx
│       │   └── pages/
│       ├── context/             # CartContext, AuthContext
│       ├── services/            # api.js (axios)
│       ├── data/                # products.js (ürün datası)
│       └── utils/               # helpers.js
│
└── backend/                     # Node.js + Express + MongoDB
    └── src/
        ├── config/              # MongoDB bağlantısı
        ├── models/              # User, Product, Order, Coupon, Settings
        ├── controllers/         # auth, product, order, cart, admin
        ├── routes/              # REST API rotaları
        ├── middlewares/         # JWT auth, error handler
        ├── services/
        │   ├── paymentService.js          # Modüler ödeme servisi
        │   ├── providers/
        │   │   ├── placeholderAdapter.js  # Aktif (test modu)
        │   │   ├── iyzicoAdapter.js       # Hazır şablon
        │   │   ├── paytrAdapter.js        # Hazır şablon
        │   │   ├── paramAdapter.js        # Hazır şablon
        │   │   └── sipayAdapter.js        # Hazır şablon
        │   ├── cargoService.js            # Kargo entegrasyonu şablonu
        │   └── invoiceService.js          # E-fatura şablonu
        └── utils/               # JWT, e-posta, seed
```

---

## ⚡ Hızlı Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (lokal veya MongoDB Atlas)
- npm veya yarn

---

### 1. Backend Kurulumu

```bash
cd cosmo/backend
cp .env.example .env
# .env dosyasını düzenleyin (MongoDB URI, JWT secret vb.)

npm install
npm run dev
# Backend http://localhost:5000 adresinde çalışır
# İlk çalıştırmada admin kullanıcı ve demo ürünler otomatik oluşturulur
```

**İlk admin girişi:**
- E-posta: `admin@mihomesanal.com`
- Şifre: `Admin123!`

---

### 2. Frontend Kurulumu

```bash
cd cosmo/frontend
cp .env.example .env    # Opsiyonel — proxy zaten /api'ye yönlendirir

npm install
npm run dev
# Frontend http://localhost:3000 adresinde çalışır
```

---

### 3. Environment Variables (.env)

**Backend `.env`** (`.env.example`'dan kopyalayın):

| Değişken | Açıklama |
|----------|----------|
| `PORT` | Backend port (varsayılan: 5000) |
| `MONGODB_URI` | MongoDB bağlantı URL'i |
| `JWT_SECRET` | JWT imzalama anahtarı |
| `ADMIN_EMAIL` | İlk admin e-postası |
| `ADMIN_PASSWORD` | İlk admin şifresi |
| `SMTP_*` | E-posta ayarları (Nodemailer) |
| `PAYMENT_PROVIDER` | `iyzico` / `paytr` / `param` / `sipay` |
| `IYZICO_API_KEY` | iyzico entegrasyonu için |
| `PAYTR_MERCHANT_ID` | PayTR entegrasyonu için |

---

## 💳 Sanal POS Entegrasyonu

Ödeme altyapısı **modüler adapter sistemiyle** hazırlanmıştır.

### Aktif etmek için:

1. `.env` dosyasında sağlayıcıyı seçin:
   ```env
   PAYMENT_PROVIDER=iyzico  # veya paytr / param / sipay
   ```

2. İlgili adapter dosyasını açın ve yorum satırlarını kaldırın:
   - `backend/src/services/providers/iyzicoAdapter.js`
   - `backend/src/services/providers/paytrAdapter.js`
   - `backend/src/services/providers/paramAdapter.js`
   - `backend/src/services/providers/sipayAdapter.js`

3. API anahtarlarını `.env` dosyasına ekleyin

4. `npm install iyzipay` (iyzico için) veya ilgili SDK'yı ekleyin

### API Endpoint'leri:

| Endpoint | Açıklama |
|----------|----------|
| `POST /api/payments/init` | Ödeme başlat → 3D Secure URL al |
| `POST /api/payments/callback` | 3D Secure sonucu (sağlayıcı çağırır) |
| `POST /api/payments/webhook` | Webhook bildirimleri |
| `GET /api/payments/status/:orderId` | Ödeme durumu sorgula |

---

## 🌐 API Referansı

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/register` | Kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş yap |
| GET | `/api/auth/profile` | Profil bilgisi (JWT) |
| PUT | `/api/auth/profile` | Profil güncelle |
| POST | `/api/auth/forgot-password` | Şifre sıfırlama |

### Ürünler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/products` | Ürün listesi (filtreleme, sıralama) |
| GET | `/api/products/slug/:slug` | Slug ile ürün detay |
| GET | `/api/products/category/:cat` | Kategoriye göre ürünler |
| GET | `/api/products/:id` | ID ile ürün detay |

### Siparişler
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/orders` | Sipariş oluştur |
| GET | `/api/orders/my-orders` | Siparişlerim |
| GET | `/api/orders/:id` | Sipariş detay |

### Sepet
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/cart/coupon` | Kupon uygula |

### Admin (JWT + Admin rol gerekli)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/admin/dashboard` | Dashboard istatistikleri |
| GET/PUT | `/api/admin/orders` | Sipariş yönetimi |
| POST/PUT/DELETE | `/api/admin/products` | Ürün yönetimi |
| GET | `/api/admin/users` | Kullanıcı listesi |
| CRUD | `/api/admin/coupons` | Kupon yönetimi |
| GET/PUT | `/api/admin/settings` | Site ayarları |
| PUT | `/api/admin/legal-pages/:page` | Yasal sayfa içerikleri |

---

## 🏭 Production Yayına Alma

### Backend (VPS / Render / Railway)

```bash
# PM2 ile production
npm install -g pm2
NODE_ENV=production pm2 start src/server.js --name cosmo-backend
pm2 save && pm2 startup
```

### Frontend (Vercel / Netlify)

```bash
cd frontend
npm run build
# dist/ klasörünü yükleyin
# Build komutu: npm run build
# Output klasörü: dist
```

### Nginx Proxy (VPS)

```nginx
server {
    listen 80;
    server_name mihomesanal.com;

    # Frontend (React build)
    location / {
        root /var/www/cosmo/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### MongoDB Atlas (Önerilen)
1. [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) ücretsiz cluster oluşturun
2. Connection string'i `.env` dosyasında `MONGODB_URI`'ye yapıştırın

---

## 📦 Sayfalar

### Frontend Sayfaları
| URL | Sayfa |
|-----|-------|
| `/` | Ana Sayfa |
| `/urunler` | Ürün Listesi |
| `/urunler/:slug` | Ürün Detay |
| `/kategori/:category` | Kategori Filtresi |
| `/sepet` | Sepet |
| `/odeme` | Checkout (3 adım) |
| `/siparis-tamamlandi/:id` | Sipariş Başarılı |
| `/siparis-basarisiz` | Sipariş Başarısız |
| `/giris` | Giriş Yap |
| `/uye-ol` | Üye Ol |
| `/hesabim` | Hesabım |
| `/siparislerim` | Siparişlerim |
| `/hakkimizda` | Hakkımızda |
| `/iletisim` | İletişim |
| `/sss` | SSS |
| `/kvkk` | KVKK |
| `/gizlilik-politikasi` | Gizlilik |
| `/cerez-politikasi` | Çerez Politikası |
| `/mesafeli-satis-sozlesmesi` | MSS |
| `/on-bilgilendirme-formu` | Ön Bilgilendirme |
| `/iade-degisim-politikasi` | İade Politikası |

### Admin Panel Sayfaları
| URL | Sayfa |
|-----|-------|
| `/admin/giris` | Admin Giriş |
| `/admin` | Dashboard |
| `/admin/urunler` | Ürün Yönetimi |
| `/admin/urunler/ekle` | Ürün Ekle |
| `/admin/urunler/:id/duzenle` | Ürün Düzenle |
| `/admin/siparisler` | Sipariş Yönetimi |
| `/admin/siparisler/:id` | Sipariş Detay |
| `/admin/kullanicilar` | Kullanıcılar |
| `/admin/kuponlar` | Kupon Yönetimi |
| `/admin/ayarlar` | Site Ayarları |

---

## 🔒 Güvenlik

- Helmet.js ile HTTP başlık güvenliği
- CORS — yalnızca belirlenen domain
- Rate limiting — API ve auth endpoint'leri
- JWT — 30 günlük token
- bcryptjs — şifre hashleme
- Input validation — express-validator
- MongoDB injection koruması (Mongoose)

---

## 📧 İletişim

**Cosmo Technology — Mi Home Sanal Mağazacılık**  
Web: mihomesanal.com  
E-posta: destek@mihomesanal.com

