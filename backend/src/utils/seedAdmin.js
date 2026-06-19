const User = require("../models/User")
const Product = require("../models/Product")

// Demo verisi — ilk çalıştırmada oluşturulur
const DEMO_PRODUCTS = [
  {
    name: "Profesyonel Araç Bakım Seti",
    slug: "profesyonel-arac-bakim-seti",
    shortDesc: "Nano teknoloji ile showroom parlaklığı. 16 parçalı eksiksiz set.",
    category: "arac-bakim",
    price: 1299,
    oldPrice: 1699,
    stock: 47,
    sku: "CT-AB-001",
    badge: "Çok Satan",
    badgeColor: "blue",
    featured: true,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
    description: "Cosmo Technology Profesyonel Araç Bakım Seti...",
    features: ["Nano koruma teknolojisi", "UV filtreli formül"],
 specs: {
      "İçerik Adedi": "16 parça",
      "Garanti": "2 yıl"
},
    }
  },
  {
    name: "Profesyonel Dalış Seti",
    slug: "profesyonel-dalis-seti",
    shortDesc: "Sualtı maceranız için CE sertifikalı premium dalış ekipmanı.",
    category: "dalis",
    price: 2849,
    oldPrice: 3499,
    stock: 12,
    sku: "CT-DL-001",
    badge: "Sınırlı Stok",
    badgeColor: "red",
    featured: true,
    images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
    description: "Cosmo Dalış Seti...",
    features: ["Anti-fog silikon maske", "CE sertifikalı"],
   specs: {
      "Maks. Derinlik": "40 metre",
      "Garanti": "3 yıl"
    }
  },
  {
    name: "Outdoor Kamp Duş Seti",
    slug: "outdoor-kamp-dus-seti",
    shortDesc: "Güneş enerjisiyle ısınan 12L taşınabilir duş sistemi.",
    category: "outdoor-kamp",
    price: 649,
    oldPrice: 899,
    stock: 83,
    sku: "CT-OK-001",
    badge: "Yeni",
    badgeColor: "green",
    featured: true,
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"],
    description: "Cosmo Outdoor Duş Seti...",
    features: ["Güneş enerjili ısıtma", "12L kapasite"],
    specs: {
      "Kapasite": "12 Litre",
      "Garanti": "2 yıl"

    }
  },
  {
    name: "Premium Ağız Bakım Seti",
    slug: "premium-agiz-bakim-seti",
    shortDesc: "IPX7 sonic diş fırçası + beyazlatma serumu + UV sterilizasyon.",
    category: "agiz-bakim",
    price: 479,
    oldPrice: 649,
    stock: 156,
    sku: "CT-AGB-001",
    badge: "Bestseller",
    badgeColor: "purple",
    featured: true,
    images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80"],
    description: "Cosmo Premium Ağız Bakım Seti...",
    features: ["40.000 titreşim/dk", "IPX7 su geçirmez"],
     specs: {
      "Pil Ömrü": "30 gün",
      "Garanti": "2 yıl"
    }
  }
]
