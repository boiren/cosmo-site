import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { CATEGORIES } from "../data/products"
import { useAdmin } from "../context/AdminContext"
import ProductCard from "../components/product/ProductCard"
import { fmt, discountPct } from "../utils/helpers"

// ─── Hero slayt verisi ─────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    tag: "CAR SMART KIT",
    tagColor: "#ef4444",
    headline: "YOLDA HER ZAMAN\nHAZIR",
    sub: "Acil durumlarda ihtiyacınız olan her şey, tek bir sette.",
    slug: "cosmo-kits-e-pro-c",
    features: [
      { icon: "🔧", title: "LASTİK ŞİŞİRİCİ",   sub: "Hızlı & Güçlü" },
      { icon: "⚡", title: "AKÜ TAKVİYE",        sub: "Güvenli Başlatma" },
      { icon: "🌀", title: "VAKUM TEMİZLEYİCİ",  sub: "Kablosuz & Taşınabilir" },
      { icon: "💧", title: "POWER BANK",          sub: "15000mAh Güç" },
    ],
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    accentColor: "#ef4444",
    image: "/images/banners/hero-car.jpg",
    price: 4999,
    oldPrice: 6499,
  },
  {
    id: 2,
    tag: "AĞIZ BAKIM SETİ",
    tagColor: "#3b82f6",
    headline: "HER GÜLÜŞTE\nGÜVEN HİSSET",
    sub: "Daha beyaz dişler, daha sağlıklı diş etleri için gelişmiş bakım teknolojisi.",
    slug: "cosmo-care-ly-q1",
    features: [
      { icon: "〰️", title: "5 FARKLI MOD",        sub: "Kişiselleştirilmiş temizlik" },
      { icon: "🦷", title: "HASSAS TEMİZLİK",     sub: "Diş eti dostu" },
      { icon: "💧", title: "IPX7 SU GEÇİRMEZ",   sub: "Duşta güvenle kullanım" },
      { icon: "🔋", title: "UZUN PİL ÖMRÜ",       sub: "Günlerce kesintisiz" },
    ],
    bg: "linear-gradient(135deg, #0a0a0a 0%, #0f1729 50%, #0a1628 100%)",
    accentColor: "#3b82f6",
    image: "/images/banners/hero-care.jpg",
    price: 1299,
    oldPrice: 1799,
  },
  {
    id: 3,
    tag: "KAMP DUŞ SETİ",
    tagColor: "#f97316",
    headline: "DOĞADA KONFOR\nHER ZAMAN YANINDA",
    sub: "Taşınabilir duş sistemi ile nerede olursanız olun konforunuz sizinle.",
    slug: "cosmo-camping-dus-seti",
    features: [
      { icon: "💧", title: "IPX8",                 sub: "Su geçirmez" },
      { icon: "🔋", title: "8000mAh",               sub: "Güçlü batarya" },
      { icon: "⏱️", title: "180 DK",                sub: "Kullanım süresi" },
      { icon: "💦", title: "2.5Bar",                sub: "Su basıncı" },
    ],
    bg: "linear-gradient(135deg, #0a0a0a 0%, #1a120a 50%, #2d1a06 100%)",
    accentColor: "#f97316",
    image: "/images/banners/hero-caming.jpg",
    price: 1899,
    oldPrice: 2499,
  },
  {
    id: 4,
    tag: "DALIŞ SETİ",
    tagColor: "#06b6d4",
    headline: "DERİNLİKLERİ\nKEŞFET",
    sub: "Profesyonel dalış deneyimi için güçlü, güvenli ve dayanıklı ekipman.",
    slug: "cosmo-dive-mini-dalis-seti",
    features: [
      { icon: "🚀", title: "YÜKSEK PERFORMANS",   sub: "Güçlü motor & stabil itiş" },
      { icon: "🔋", title: "UZUN PİL ÖMRÜ",       sub: "Tek şarjla maksimum kullanım" },
      { icon: "🛡️", title: "SU GEÇİRMEZ IPX8",   sub: "Derin sularda tam koruma" },
      { icon: "⚙️", title: "DAYANIKLI & GÜVENLİ", sub: "Profesyonel kullanım için" },
    ],
    bg: "linear-gradient(135deg, #020a10 0%, #041a2e 50%, #021525 100%)",
    accentColor: "#06b6d4",
    image: "/images/banners/hero-dive.jpg",
    price: 8499,
    oldPrice: 10999,
  },
]

// ─── Trust bar ─────────────────────────────────────────────
const TRUST = [
  { icon: "🛡️", label: "PREMİUM KALİTE",     sub: "Üstün malzeme, uzun ömürlü kullanım." },
  { icon: "✅", label: "GÜVENLİ ALIŞVERİŞ", sub: "2 Yıl Garanti & Teknik Destek" },
  { icon: "🚚", label: "HIZLI KARGO",        sub: "1-3 iş günü içinde teslimat." },
  { icon: "📦", label: "KOLAY İADE",         sub: "14 gün içinde koşulsuz iade." },
]

export default function HomePage() {
  const [slide, setSlide]   = useState(0)
  const [fading, setFading] = useState(false)
  const timerRef            = useRef(null)

  	
  const { products, loadingProducts } = useAdmin()
  const featuredProducts = products.filter(p => p.isActive !== false)

  const goTo = (idx) => {
    if (idx === slide) return
    setFading(true)
    setTimeout(() => { setSlide(idx); setFading(false) }, 350)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setSlide(p => (p + 1) % SLIDES.length)
        setFading(false)
      }, 350)
    }, 6000)
    return () => clearInterval(timerRef.current)
  }, [])

  const s   = SLIDES[slide]
  const liveProduct = products?.find(
  p => String(p.slug).trim() === String(s.slug).trim()
)
  const livePrice = liveProduct?.price ?? s.price
  const liveOldPrice = liveProduct?.oldPrice ?? s.oldPrice
  const pct = discountPct(livePrice, liveOldPrice)

  return (
    <div className="pt-16">

      {/* ══════════════════════════════════════════════════════
          HERO SECTION — Roborock/Xiaomi tarzı siyah premium
          ═══════════════════════════════════════════════════ */}
      <section
        style={{ background: s.bg, minHeight: "100vh", transition: "background 0.8s ease" }}
        className="relative flex flex-col overflow-hidden"
      >
        {/* İçerik */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center w-full py-16"
          style={{ opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" }}
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

            {/* Sol — Metin */}
            <div>
              {/* Tag */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-0.5 w-10" style={{ background: s.accentColor }} />
                <span className="text-xs font-bold tracking-[0.2em]" style={{ color: s.accentColor }}>
                  {s.tag}
                </span>
              </div>

              {/* Başlık */}
              <h1
                className="font-black text-white leading-none mb-6 whitespace-pre-line"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", letterSpacing: "-0.02em", fontFamily: "system-ui, sans-serif" }}
              >
                {s.headline}
              </h1>

              {/* Alt başlık */}
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">{s.sub}</p>

              {/* Özellik grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {s.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <div className="text-white text-xs font-bold tracking-wider">{f.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fiyat + CTA */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="text-white text-3xl font-black">{fmt(livePrice)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 line-through text-sm">{fmt(liveOldPrice)}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: s.accentColor }}>%{pct} İNDİRİM</span>
                  </div>
                </div>
                <Link
                  to={`/urunler/${s.slug}`}
                  className="inline-flex items-center gap-3 border px-8 py-3.5 text-white text-sm font-bold tracking-widest transition-all hover:text-black"
                  style={{ borderColor: s.accentColor, background: "transparent" }}
                  onMouseEnter={e => e.currentTarget.style.background = s.accentColor}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  ÜRÜNÜ İNCELE
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Sağ — Ürün görseli */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-20 scale-90"
                  style={{ background: s.accentColor }}
                />
                <img
                  src={s.image}
                  alt={s.headline}
                  className="relative w-full max-w-xl object-contain"
                  style={{ maxHeight: "60vh", filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.8))" }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slayt kontrolleri — alt */}
        <div className="pb-10">
          {/* Thumbnail navigasyon */}
          <div className="flex justify-center gap-4">
            {SLIDES.map((sl, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative group"
              >
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300"
                  style={{ borderColor: i === slide ? sl.accentColor : "rgba(255,255,255,0.1)" }}
                >
                  <img
                    src={sl.image}
                    alt=""
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ opacity: i === slide ? 1 : 0.4 }}
                    onError={e => { e.target.style.display = "none" }}
                  />
                </div>
                {i === slide && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: sl.accentColor }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex justify-center gap-2 mt-6">
            {SLIDES.map((sl, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="h-0.5 rounded-full transition-all duration-300"
                style={{
                  width: i === slide ? 40 : 20,
                  background: i === slide ? sl.accentColor : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST BAR
          ═══════════════════════════════════════════════════ */}
      <section className="bg-black border-y border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around gap-5">
            {TRUST.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="text-white font-bold text-xs tracking-wider">{t.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ÜRÜN KARTLARI — beyaz section
          ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gray-400 text-xs font-bold tracking-[0.25em] uppercase mb-3">
              Cosmo Technology Ürün Serisi
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              4 Kategori, 1 Marka
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Araç bakımından dalışa, kamp hayatından ağız bakımına — yaşamın her alanında Cosmo Technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map(p => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/urunler"
              className="inline-flex items-center gap-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 py-4 font-bold text-sm tracking-widest transition-all duration-300">
              TÜM ÜRÜNLERİ GÖR
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          KATEGORİ BLOK — koyu arka plan, büyük görseller
          ═══════════════════════════════════════════════════ */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white mb-10 tracking-tight">Ürün Kategorileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                cat: "cosmo-kits",
                title: "Cosmo Kits",
                sub: "4\'ü 1 Arada Araç Bakım",
                img: "/images/banners/hero-car.jpg",
                accent: "#ef4444",
                slug: "cosmo-kits-e-pro-c",
              },
              {
                cat: "cosmo-care",
                title: "Cosmo Care",
                sub: "Profesyonel Ağız Bakımı",
                img: "/images/banners/hero-care.jpg",
                accent: "#3b82f6",
                slug: "cosmo-care-ly-q1",
              },
              {
                cat: "cosmo-camping",
                title: "Cosmo Camping",
                sub: "Outdoor & Kamp Çözümleri",
                img: "/images/banners/hero-caming.jpg",
                accent: "#f97316",
                slug: "cosmo-camping-dus-seti",
              },
              {
                cat: "cosmo-dive",
                title: "Cosmo Dive",
                sub: "Dalış & Sualtı Ekipmanı",
                img: "/images/banners/hero-dive.jpg",
                accent: "#06b6d4",
                slug: "cosmo-dive-mini-dalis-seti",
              },
            ].map((item) => (
              <Link
                key={item.cat}
                to={`/urunler/${item.slug}`}
                className="group relative overflow-hidden rounded-2xl h-60 md:h-72 block"
                style={{ background: "#111" }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 group-hover:scale-105 transform"
                  onError={e => { e.target.style.display = "none" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6">
                  <div className="h-0.5 w-8 mb-3" style={{ background: item.accent }} />
                  <div className="text-xl font-black text-white tracking-tight">{item.title}</div>
                  <div className="text-gray-400 text-sm mt-1">{item.sub}</div>
                  <div
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: item.accent }}
                  >
                    İNCELE
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NEDEN COSMO — beyaz section
          ═══════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="h-0.5 w-10 bg-gray-900 mb-6" />
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
                Global Kalite,<br />Türkiye'de Hizmet
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                2021'den bu yana Cosmo Technology olarak, uluslararası kalite standartlarında üretilmiş
                ürünleri Türkiye pazarına sunuyoruz. Her ürün; tasarım, mühendislik ve kullanıcı
                deneyimi açısından titizlikle seçilmektedir.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Modüler Teknoloji",      desc: "Tek platform, çoklu işlev. Birden fazla cihaz yerine tek bir akıllı set." },
                  { title: "IPX7 / IPX8 Sertifika", desc: "Su geçirmezlik sertifikalı ürünler — her koşulda güvenle kullanım." },
                  { title: "2 Yıl Garanti",          desc: "Tüm ürünlerde resmi garanti ve teknik destek." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{item.title}</div>
                      <div className="text-gray-500 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-10">
                <Link to="/urunler" className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-4 font-bold text-sm tracking-widest transition-all">
                  ALIŞVERIŞE BAŞLA
                </Link>
                <Link to="/hakkimizda" className="border border-gray-200 hover:border-gray-900 text-gray-700 hover:text-gray-900 px-8 py-4 font-bold text-sm tracking-widest transition-all">
                  HAKKIMIZDA
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "2021",   label: "Kuruluş Yılı",  desc: "4 yıllık deneyim" },
                { val: "4",      label: "Ürün Serisi",   desc: "Kits · Care · Camping · Dive" },
                { val: "2 Yıl", label: "Garanti",        desc: "Tüm ürünlerde" },
                { val: "IPX8",   label: "Su Koruması",   desc: "En yüksek standart" },
              ].map(({ val, label, desc }, i) => (
                <div key={i} className="border border-gray-100 p-6 hover:border-gray-300 transition-colors">
                  <div className="text-3xl font-black text-gray-900 mb-1">{val}</div>
                  <div className="text-sm font-bold text-gray-700">{label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WhatsApp CTA BANNER
          ═══════════════════════════════════════════════════ */}
      <section className="bg-gray-950 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
            Ürün Hakkında Sorunuz mu Var?
          </h2>
          <p className="text-gray-400 mb-8">WhatsApp üzerinden hızlıca yanıt alın.</p>
          <a
            href="https://wa.me/905448904701"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-10 py-4 tracking-widest transition-all text-sm"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WHATSAPP'TAN YAZ
          </a>
        </div>
      </section>

    </div>
  )
}
