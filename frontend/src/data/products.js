// =========================================================
// COSMO TECHNOLOGY — Gerçek Ürün Verisi
// 4 Ürün: COSMO KITS | COSMO CARE | COSMO CAMPING | COSMO DIVE
// =========================================================

export const CATEGORIES = [
  { id: 'cosmo-kits',    label: 'Cosmo Kits',    icon: '🚗', slug: 'cosmo-kits'    },
  { id: 'cosmo-care',    label: 'Cosmo Care',    icon: '🦷', slug: 'cosmo-care'    },
  { id: 'cosmo-camping', label: 'Cosmo Camping', icon: '⛺', slug: 'cosmo-camping' },
  { id: 'cosmo-dive',    label: 'Cosmo Dive',    icon: '🤿', slug: 'cosmo-dive'    },
]

export const PRODUCTS = [
  // ─── 1. COSMO KITS ──────────────────────────────────────
  {
    id: 1,
    slug: 'cosmo-kits-e-pro-c',
    name: 'Cosmo Kits — Car Smart Kit',
    shortDesc: 'Lastik şişirici, akü takviye, vakum temizleyici ve araç yıkama — tek sette 4 cihaz.',
    category: 'cosmo-kits',
    price: 4999,
    oldPrice: 6499,
    stock: 35,
    sku: 'CT-KITS-EPRO-C',
    badge: 'Çok Satan',
    badgeColor: 'blue',
    featured: true,
    isActive: true,
    images: [
        '/images/arac-seti/1.jpg',
        '/images/arac-seti/2.jpg',
        '/images/arac-seti/3.jpg',
        '/images/arac-seti/4.jpg',
        '/images/arac-seti/5.jpg',
        '/images/arac-seti/6.jpg',
      
    ],
    description: `Cosmo Kits E-Pro-C, aracınız için ihtiyacınız olan her şeyi tek bir sette sunan modüler araç bakım çözümüdür. Acil durumlarda, yolculuklarda ve günlük araç bakımında yanınızda olan bu set; lastik şişirici, akü takviye (jump starter), kablosuz vakum temizleyici ve araç yıkama tabancasını tek bir power bank modülüne bağlayarak çalışır.

Modüler tasarım sayesinde her cihaz, 15.000 mAh Power Bank-C modülüne manyetik bağlantıyla takılarak güç alır. Ayrı ayrı 4 cihaz almak yerine tek sette sahip olun.`,
    features: [
      'Modüler tasarım — 1 power bank, 4 farklı cihaz',
      'Lastik şişirici: 120W, 38L/min, dijital ekran, 4 mod (araç/motor/bisiklet/top)',
      'Akü takviye (Jump Starter): 1500A tepe akımı, 6.0L benzin / 3.0L dizel araçları çalıştırır',
      'Kablosuz vakum temizleyici: 19kPa güç, 105.000 rpm fırçasız motor, HEPA filtre',
      'Araç yıkama tabancası: 200PSI, 6 farklı su modu, köpük haznesi dahil',
      'Power Bank: 15.000 mAh, 22.5W hızlı şarj, 15W kablosuz şarj, IPX5',
      'Gece aydınlatma LED sistemi',
      'Premium EVA taşıma çantası dahil',
    ],
    specs: {
      'Model':                'E-Pro-C (NLB-C + BYC01 + BYX01 + BY-XCJ01)',
      'Power Bank Kapasitesi':'15.000 mAh',
      'Lastik Şişirici Motor':'550 Motor, 13.500 rpm',
      'Lastik Basıncı':       '38 L/dakika',
      'Vakum Gücü':           '19 kPa / 105.000 rpm',
      'Araç Yıkama Basıncı':  '200 PSI / 200-240 L/H',
      'Jump Starter Akımı':   '1500A Tepe Akımı',
      'Şarj Girişi':          'Type-C (5V/9V)',
      'Su Geçirmezlik':       'IPX5 (Power Bank)',
      'Çanta Boyutu':         '370 × 260 × 120 mm',
      'Garanti':              '2 Yıl',
    },
    seo: {
      title:       'Cosmo Kits Car Smart Kit E-Pro-C | 4\'ü 1 Arada Araç Seti',
      description: 'Lastik şişirici, 1500A jump starter, vakum ve araç yıkama — tek power bank ile çalışan modüler araç bakım seti.',
    },
  },

  // ─── 2. COSMO CARE ──────────────────────────────────────
  {
    id: 2,
    slug: 'cosmo-care-ly-q1',
    name: 'Cosmo Care — 3\'ü 1 Arada Ağız Bakım Seti',
    shortDesc: 'Sonic diş fırçası + su jeti + diş temizleyici — tek cihazda profesyonel ağız bakımı.',
    category: 'cosmo-care',
    price: 1299,
    oldPrice: 1799,
    stock: 89,
    sku: 'CT-CARE-LYQ1',
    badge: 'Yeni',
    badgeColor: 'green',
    featured: true,
    isActive: true,
    images: [
  '/images/agiz-bakim/1.jpg',
  '/images/agiz-bakim/2.jpg',
  '/images/agiz-bakim/3.jpg',
],
    description: `Cosmo Care LY-Q1, diş fırçalama, su jeti ve diş temizlemeyi tek bir ana gövdede birleştiren 3-in-1 profesyonel ağız bakım setidir. Modüler başlık sistemi sayesinde tek bir cihazla 3 farklı ağız bakım rutinini gerçekleştirebilirsiniz.,

IPX7 su geçirmez tasarımı ile duşta güvenle kullanabilir, USB Type-C şarjla sadece 5 saatte tam şarj edebilirsiniz. Dakikada 48.000 titreşim yapan sonic diş fırçası başlığı, 50-140 PSI su basıncıyla çalışan su jeti nozulu ve diş taşı temizleme ucu ile klinik düzeyinde temizlik sağlar.`,
    features: [
      'Model LY-Q1 — 3-in-1 Sonic Diş Fırçası / Su Jeti / Diş Temizleyici',
      '48.000 titreşim/dakika — profesyonel sonic temizlik',
      'Su jeti: 50-140 PSI, 2.500 nabız/dakika, diş arası ve aparey temizliği',
      'Diş taşı temizleme ucu — aylık derin temizlik',
      'IPX7 tam su geçirmez — duşta güvenle kullanım',
      '2 mod: Fırça (Brush) + Su Jeti (Floss) — ayrı ON/OFF butonları',
      'USB Type-C şarj — 5 saatte tam şarj, 1.200 mAh pil',
      'Premium EVA taşıma çantası dahil (210 × 120 mm)',
      '7 parça set: gövde, 2× fırça başlığı, 2× floss nozul, 1× diş temizleyici, kablo',
    ],
    specs: {
      'Model':              'LY-Q1',
      'Titreşim Frekansı':  '48.000 kez/dakika',
      'Su Basıncı':         '50-140 PSI',
      'Nabız Çıkışı':       '2.500 kez/dakika',
      'Pil Kapasitesi':     '1.200 mAh Lityum',
      'Şarj Süresi':        '≤ 5 saat',
      'Şarj Girişi':        'Type-C',
      'Su Geçirmezlik':     'IPX7',
      'Ağırlık':            '400,6 gram',
      'Boyut':              '254 × 32 mm',
      'Garanti':            '2 Yıl',
    },
    seo: {
      title:       'Cosmo Care 3\'ü 1 Arada Ağız Bakım Seti | Sonic + Su Jeti + Diş Temizleyici',
      description: 'IPX7 su geçirmez, 48.000 titreşim/dk sonic diş fırçası, su jeti ve diş temizleyici — 3\'ü 1 arada profesyonel ağız bakımı.',
    },
  },

  // ─── 3. COSMO CAMPING ───────────────────────────────────
  {
    id: 3,
    slug: 'cosmo-camping-dus-seti',
    name: 'Cosmo Camping — Akıllı Taşınabilir Duş Seti',
    shortDesc: 'IPX8 su geçirmez, 8.000 mAh, 180 dakika kullanım — kamp, plaj ve karavanda sıcak duş.',
    category: 'cosmo-camping',
    price: 1899,
    oldPrice: 2499,
    stock: 47,
    sku: 'CT-CAMP-DUS01',
    badge: 'Bestseller',
    badgeColor: 'purple',
    featured: true,
    isActive: true,
    images: [
  '/images/outdoor-dus/1.jpg',
  '/images/outdoor-dus/2.jpg',
  '/images/outdoor-dus/3.jpg',
  '/images/outdoor-dus/4.jpg',
  '/images/outdoor-dus/5.jpg',
],
    description: `Cosmo Camping Akıllı Duş Seti, kamp, trekking, plaj, karavan ve outdoor etkinlikler için tasarlanmış taşınabilir bir duş sistemidir. Dahili dijital ekranda anlık su sıcaklığını (45°C'ye kadar) ve pil durumunu görebilirsiniz.

8.000 mAh güçlü bataryası tek şarjda 180 dakika kesintisiz kullanım sağlarken, 2.5 bar su basıncıyla güçlü ve rahat bir duş deneyimi sunar. IPX8 sertifikalı su geçirmezliğiyle her ortamda güvenle kullanılır.`,
    features: [
      'IPX8 tam su geçirmez sertifika — en zorlu koşullarda güvenli kullanım',
      '8.000 mAh büyük kapasiteli batarya',
      '180 dakika kesintisiz kullanım süresi',
      'Dijital LED ekran — anlık sıcaklık ve pil göstergesi',
      '2.5 Bar su basıncı — güçlü duş deneyimi',
      "45°C'ye kadar ısı dayanımı",
      'Hafif & kompakt tasarım — kolay taşıma, az yer kaplar',
      'USB Type-C hızlı şarj',
      'Kamp, plaj, karavan, spor sonrası, evcil hayvan yıkama',
      'Premium seyahat çantası dahil',
    ],
    specs: {
      'Batarya':           '8.000 mAh',
      'Kullanım Süresi':   '180 dakika (tek şarjda)',
      'Su Basıncı':        '2_5 Bar',
      'Su Geçirmezlik':   'IPX8',
      'Ekran':             'Dijital LED (sıcaklık + pil)',
      'Şarj Girişi':       'Type-C',
      'Kullanım Alanı':   'Kamp, Plaj, Karavan, Spor',
      'Garanti':           '2 Yıl',
    },
    seo: {
      title:       'Cosmo Camping Taşınabilir Duş Seti | IPX8, 8000mAh, 180dk',
      description: 'Kamp ve outdoor için IPX8 taşınabilir duş. 8.000 mAh, 180 dk kullanım, 2.5 bar basınç, dijital sıcaklık ekranı.',
    },
  },

  // ─── 4. COSMO DIVE ──────────────────────────────────────
  {
    id: 4,
    slug: 'cosmo-dive-mini-dalis-seti',
    name: 'Cosmo Dive — Mini Dalış Seti',
    shortDesc: 'Sualtı scooter, dalış maskesi ve su altı feneri — derinlikleri keşfetmek için eksiksiz set.',
    category: 'cosmo-dive',
    price: 8499,
    oldPrice: 10999,
    stock: 18,
    sku: 'CT-DIVE-MINI01',
    badge: 'Sınırlı Stok',
    badgeColor: 'red',
    featured: true,
    isActive: true,
   images: [
             '/images/dalis-seti/1.jpg',
             '/images/dalis-seti/2.jpg',
             '/images/dalis-seti/3.jpg',
],
    description: `Cosmo Dive Mini Dalış Seti, hem snorkeling hem profesyonel dalış için tasarlanmış eksiksiz bir sualtı keşif setidir. Çift motorlu sualtı scooter'ı güçlü itiş gücü ve uzun pil ömrüyle sualtı deneyiminizi tamamen değiştirir.

IPX8 sertifikalı tam su geçirmez yapısı, yüksek performanslı çift motor ve dayanıklı malzeme kombinasyonu ile Cosmo Dive her seviyeden dalıcı için güvenli ve eğlenceli bir deneyim sunar. Set; sualtı scooter, profesyonel dalış maskesi ve güçlü sualtı feneri içerir.`,
    features: [
      'Çift motorlu sualtı scooter — güçlü ve stabil itiş',
      'Yüksek performanslı fırçasız motorlar',
      'IPX8 tam su geçirmez — derin sularda tam koruma',
      'Uzun pil ömrü — tek şarjla maksimum dalış süresi',
      'Anti-fog profesyonel dalış maskesi dahil',
      'Güçlü sualtı LED feneri dahil',
      'Dayanıklı & hafif gövde — profesyonel kullanıma uygun',
      'Hem snorkeling hem tüplü dalış için uygun',
      'Kompakt ve taşınabilir tasarım',
    ],
    specs: {
      'Motor Tipi':        'Çift Fırçasız Motor',
      'Su Geçirmezlik':   'IPX8',
      'Kullanım Derinliği': '40 metreye kadar',
      'Set İçeriği':       'Scooter + Dalış Maskesi + Sualtı Feneri',
      'Hedef Kullanıcı':  'Başlangıç & Profesyonel',
      'Kullanım Alanı':   'Snorkeling, Tüplü Dalış, Sualtı Fotoğrafçılığı',
      'Garanti':           '2 Yıl',
    },
    seo: {
      title:       'Cosmo Dive Mini Dalış Seti | Sualtı Scooter + Maske + Fener',
      description: 'Çift motorlu sualtı scooter, IPX8 dalış maskesi ve sualtı feneri — eksiksiz mini dalış seti.',
    },
  },
]

export const getProductBySlug    = (slug)     => PRODUCTS.find(p => p.slug === slug)
export const getProductsByCategory = (cat)    => PRODUCTS.filter(p => p.category === cat)
export const getFeaturedProducts = ()         => PRODUCTS.filter(p => p.featured && p.isActive !== false)
