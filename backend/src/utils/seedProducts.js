// ============================================================
// COSMO TECHNOLOGY — Ürün Seed Script
// ============================================================
// Kullanım:
//   cd backend
//   npm run seed:products
//
// Bu script:
//   1. MongoDB'ye bağlanır
//   2. Mevcut ürünleri kontrol eder (slug bazlı — çift kayıt olmaz)
//   3. Eksik ürünleri ekler, mevcut ürünleri günceller (upsert)
//   4. Başarı/hata raporunu ekrana yazar
// ============================================================

require("dotenv").config()
const mongoose = require("mongoose")
function cleanKeys(obj) {
  if (Array.isArray(obj)) return obj.map(cleanKeys)
  if (obj && typeof obj === "object") {
    const cleaned = {}
    for (const key in obj) {
      const safeKey = key.replace(/\./g, "")
      cleaned[safeKey] = cleanKeys(obj[key])
    }
    return cleaned
  }
  return obj
}

// ── Model (inline — import sorunu olmasın) ──────────────────
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  shortDesc:   String,
  description: String,
  category:    String,
  price:       Number,
  oldPrice:    Number,
  stock:       { type: Number, default: 0 },
  sku:         { type: String, sparse: true },
  images:      [String],
  features:    [String],
  specs:       { type: Map, of: String },
  badge:       String,
  badgeColor:  String,
  featured:    { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  seo:         { title: String, description: String },
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

// ── Ürün verisi — frontend/src/data/products.js ile senkron ─
const PRODUCTS = [
  {
    name:      "Cosmo Kits — Car Smart Kit E-Pro-C",
    slug:      "cosmo-kits-e-pro-c",
    shortDesc: "Lastik şişirici, akü takviye, vakum temizleyici ve araç yıkama — tek sette 4 cihaz.",
    category:  "cosmo-kits",
    price:     4999,
    oldPrice:  6499,
    stock:     35,
    sku:       "CT-KITS-EPRO-C",
    badge:     "Çok Satan",
    badgeColor:"blue",
    featured:  true,
    isActive:  true,
    images: [
      "/images/arac-seti/1.jpg",
    ],
    features: [
      "Modüler tasarım — 1 power bank, 4 farklı cihaz",
      "Lastik şişirici: 120W, 38L/min, dijital ekran, 4 mod",
      "Akü takviye (Jump Starter): 1500A tepe akımı",
      "Vakum temizleyici: 19kPa, 105.000 rpm fırçasız motor, HEPA filtre",
      "Araç yıkama tabancası: 200PSI, 6 su modu, köpük haznesi",
      "Power Bank: 15.000 mAh, 22.5W hızlı şarj, 15W kablosuz, IPX5",
      "Gece aydınlatma LED sistemi",
      "Premium EVA taşıma çantası dahil (370×260×120mm)",
    ],
    specs: new Map([
      ["Model",                "E-Pro-C"],
      ["Power Bank Kapasitesi","15.000 mAh"],
      ["Lastik Şişirici",      "120W, 38L/dakika"],
      ["Vakum Gücü",           "19 kPa / 105.000 rpm"],
      ["Araç Yıkama",          "200 PSI / 200-240 L/H"],
      ["Jump Starter",         "1500A Tepe Akımı"],
      ["Şarj Girişi",          "Type-C (5V/9V)"],
      ["Su Geçirmezlik",       "IPX5 (Power Bank)"],
      ["Çanta",                "370×260×120 mm"],
      ["Garanti",              "2 Yıl"],
    ]),
    seo: {
      title:       "Cosmo Kits Car Smart Kit E-Pro-C | 4'ü 1 Arada Araç Seti",
      description: "Lastik şişirici, 1500A jump starter, vakum ve araç yıkama — tek power bank ile çalışan modüler araç bakım seti.",
    },
  },

  {
    name:      "Cosmo Care — 3'ü 1 Arada Ağız Bakım Seti",
    slug:      "cosmo-care-ly-q1",
    shortDesc: "Sonic diş fırçası + su jeti + diş temizleyici — tek cihazda profesyonel ağız bakımı.",
    category:  "cosmo-care",
    price:     1299,
    oldPrice:  1799,
    stock:     89,
    sku:       "CT-CARE-LYQ1",
    badge:     "Yeni",
    badgeColor:"green",
    featured:  true,
    isActive:  true,
    images: [
      "/images/agiz-bakim/1.jpg",
    ],
    features: [
      "3-in-1: Sonic Diş Fırçası + Su Jeti (Floss) + Diş Temizleyici",
      "48.000 titreşim/dakika — profesyonel sonic temizlik",
      "Su jeti: 50-140 PSI, 2.500 nabız/dakika",
      "Diş taşı temizleme ucu — aylık derin temizlik",
      "IPX7 tam su geçirmez — duşta güvenle kullanım",
      "2 mod: Brush + Floss — ayrı ON/OFF butonları",
      "USB Type-C şarj — 5 saatte tam şarj, 1.200 mAh",
      "Premium EVA taşıma çantası dahil (210×120mm)",
    ],
    specs: new Map([
      ["Model",          "LY-Q1"],
      ["Titreşim",       "48.000 kez/dakika"],
      ["Su Basıncı",     "50-140 PSI"],
      ["Nabız Çıkışı",   "2.500 kez/dakika"],
      ["Pil",            "1.200 mAh Lityum"],
      ["Şarj Süresi",    "≤ 5 saat"],
      ["Şarj",           "Type-C"],
      ["Su Geçirmezlik", "IPX7"],
      ["Ağırlık",        "400,6 gram"],
      ["Boyut",          "254×32 mm"],
      ["Garanti",        "2 Yıl"],
    ]),
    seo: {
      title:       "Cosmo Care 3'ü 1 Arada Ağız Bakım Seti LY-Q1",
      description: "IPX7, 48.000 titreşim/dk sonic diş fırçası, su jeti ve diş temizleyici.",
    },
  },

  {
    name:      "Cosmo Camping — Akıllı Taşınabilir Duş Seti",
    slug:      "cosmo-camping-dus-seti",
    shortDesc: "IPX8 su geçirmez, 8.000 mAh, 180 dakika kullanım — kamp, plaj ve karavanda konforlu duş.",
    category:  "cosmo-camping",
    price:     1899,
    oldPrice:  2499,
    stock:     47,
    sku:       "CT-CAMP-DUS01",
    badge:     "Bestseller",
    badgeColor:"purple",
    featured:  true,
    isActive:  true,
    images: [
      "/images/outdoor-dus/1.jpg",
    ],
    features: [
      "IPX8 tam su geçirmez sertifika",
      "8.000 mAh büyük kapasiteli batarya",
      "180 dakika kesintisiz kullanım",
      "Dijital LED ekran — anlık sıcaklık + pil durumu",
      "2.5 Bar su basıncı",
      "45°C ye kadar ısı dayanımı",
      "USB Type-C hızlı şarj",
      "Kamp, plaj, karavan, evcil hayvan yıkama",
    ],
    specs: new Map([
      ["Batarya",         "8.000 mAh"],
      ["Kullanım",        "180 dakika (tek şarj)"],
      ["Su Basıncı",      "2.5 Bar"],
      ["Maks. Sıcaklık",  "45°C"],
      ["Su Geçirmezlik",  "IPX8"],
      ["Ekran",           "Dijital LED"],
      ["Şarj",            "Type-C"],
      ["Garanti",         "2 Yıl"],
    ]),
    seo: {
      title:       "Cosmo Camping Taşınabilir Duş Seti | IPX8, 8000mAh, 180dk",
      description: "Kamp için IPX8 taşınabilir duş. 8.000 mAh, 180 dk, 2.5 bar.",
    },
  },

  {
    name:      "Cosmo Dive — Mini Dalış Seti",
    slug:      "cosmo-dive-mini-dalis-seti",
    shortDesc: "Sualtı scooter, dalış maskesi ve sualtı feneri — derinlikleri keşfetmek için eksiksiz set.",
    category:  "cosmo-dive",
    price:     8499,
    oldPrice:  10999,
    stock:     18,
    sku:       "CT-DIVE-MINI01",
    badge:     "Sınırlı Stok",
    badgeColor:"red",
    featured:  true,
    isActive:  true,
    images: [
      "/images/dalis-seti/1.jpg",
    ],
    features: [
      "Çift fırçasız motorlu sualtı scooter",
      "IPX8 tam su geçirmez",
      "40 metreye kadar güvenli dalış",
      "Uzun pil ömrü — tek şarjla maksimum dalış",
      "Anti-fog profesyonel dalış maskesi dahil",
      "Güçlü sualtı LED feneri dahil",
      "Kompakt & taşınabilir tasarım",
      "Hem snorkeling hem tüplü dalış uyumlu",
    ],
    specs: new Map([
      ["Motor",           "Çift Fırçasız"],
      ["Su Geçirmezlik",  "IPX8"],
      ["Maks. Derinlik",  "40 metre"],
      ["Set İçeriği",     "Scooter + Maske + Fener"],
      ["Kullanım",        "Snorkeling & Tüplü Dalış"],
      ["Garanti",         "2 Yıl"],
    ]),
    seo: {
      title:       "Cosmo Dive Mini Dalış Seti | Sualtı Scooter + Maske + Fener",
      description: "Çift motorlu sualtı scooter, IPX8 maske ve fener — eksiksiz mini dalış seti.",
    },
  },
]

// ── Ana seed fonksiyonu ─────────────────────────────────────
const seedProducts = async () => {
  console.log("\n📦 Cosmo Technology — Ürün Seed Script")
  console.log("─".repeat(50))

  // MongoDB bağlantısı
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("\n❌ MONGODB_URI bulunamadı! .env dosyasını kontrol edin.")
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log("✅ MongoDB bağlantısı kuruldu\n")
    await Product.deleteMany({})
  } catch (err) {
    console.error("❌ MongoDB bağlantı hatası:", err.message)
    process.exit(1)
  }

  let inserted = 0
  let updated  = 0
  let errors   = 0

  for (const product of PRODUCTS) {
    try {
      const cleanProduct = cleanKeys(product)
const result = await Product.findOneAndUpdate(
  { slug: cleanProduct.slug },
  { $set: cleanProduct },
  {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  }
)
      // upsert yeni kayıt mı yoksa update mi?
      const isNew = result.createdAt.getTime() === result.updatedAt.getTime() ||
                    Date.now() - result.createdAt.getTime() < 3000

      if (isNew) {
        console.log(`  ➕ Eklendi:   ${product.name}`)
        inserted++
      } else {
        console.log(`  🔄 Güncellendi: ${product.name}`)
        updated++
      }
    } catch (err) {
      console.error(`  ❌ Hata [${product.slug}]: ${err.message}`)
      errors++
    }
  }

  // Özet
  console.log("\n" + "─".repeat(50))
  console.log(`✅ Tamamlandı!`)
  console.log(`   ➕ Yeni eklenen:   ${inserted}`)
  console.log(`   🔄 Güncellenen:   ${updated}`)
  console.log(`   ❌ Hatalı:        ${errors}`)
  console.log(`   📊 Toplam DB'de:  ${await Product.countDocuments()} ürün`)
  console.log("─".repeat(50))
  console.log("\n🌐 Admin paneli: http://localhost:3000/admin")
  console.log("📋 API test:     http://localhost:5000/api/products\n")

  await mongoose.disconnect()
  process.exit(errors > 0 ? 1 : 0)
}

seedProducts().catch(err => {
  console.error("\n❌ Beklenmedik hata:", err.message)
  process.exit(1)
})
