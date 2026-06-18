import { useLocation } from "react-router-dom"

const PAGES = {
  "/kvkk": {
    title: "Kişisel Verilerin Korunması (KVKK)",
    content: `VERİ SORUMLUSU
Mi Home Sanal Mağazacılık, 6698 sayılı KVKK kapsamında veri sorumlusudur.

İŞLENEN KİŞİSEL VERİLER
• Ad, soyad, TC kimlik numarası
• İletişim bilgileri (e-posta, telefon, adres)
• Sipariş ve alışveriş bilgileri
• IP adresi ve çerez bilgileri

KİŞİSEL VERİLERİN İŞLENME AMAÇLARI
• Sipariş ve teslimat işlemlerinin gerçekleştirilmesi
• Müşteri hizmetleri sunumu
• Yasal yükümlülüklerin yerine getirilmesi

HAKLARINIZ
KVKK madde 11 kapsamında; kişisel verilerinize erişim, düzeltme, silme ve itiraz haklarına sahipsiniz.

İletişim: destek@mihomesanal.com
Mi Home Sanal Mağazacılık — mihomesanal.com`
  },
  "/gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    content: `Bu Gizlilik Politikası, mihomesanal.com web sitesini ziyaret ettiğinizde ve Cosmo Technology ürünlerini satın aldığınızda kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.

Toplanan Bilgiler
Siteyi ziyaret ettiğinizde çerezler ve benzeri teknolojiler aracılığıyla bazı bilgiler toplanabilir.

Bilgilerin Kullanımı
Toplanan bilgiler yalnızca hizmet sunumu, sipariş yönetimi ve yasal yükümlülükler kapsamında kullanılır.

Güvenlik
SSL/TLS şifreleme ile verileriniz güvence altındadır.

Son güncelleme: 2024`
  },
  "/cerez-politikasi": {
    title: "Çerez Politikası",
    content: `Çerez Nedir?
Çerezler, web sitelerinin tarayıcınıza yerleştirdiği küçük metin dosyalarıdır.

Kullandığımız Çerezler
• Zorunlu çerezler: Site işlevselliği için gereklidir, kapatılamaz
• Analitik çerezler: Kullanım istatistikleri için (Google Analytics)
• Pazarlama çerezleri: Kişiselleştirilmiş içerik için

Çerezleri Nasıl Kontrol Ederim?
Tarayıcı ayarlarından çerezleri yönetebilirsiniz.`
  },
  "/mesafeli-satis-sozlesmesi": {
    title: "Mesafeli Satış Sözleşmesi",
    content: `MADDE 1 – TARAFLAR
SATICI: Mi Home Sanal Mağazacılık / Cosmo Technology
WEB SİTESİ: mihomesanal.com
E-POSTA: destek@mihomesanal.com

ALICI: Sipariş formunda belirtilen kişi/kurum

MADDE 2 – KONU
Bu sözleşme, Alıcının web sitesi üzerinden elektronik ortamda siparişini verdiği ürünlerin satışı ve teslimatına ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenlemektedir.

MADDE 3 – ÜRÜN BİLGİLERİ
Ürün adı, fiyatı, özellikleri ve toplam tutarı sipariş özeti sayfasında yer almaktadır.

MADDE 4 – ÖDEME
Ödeme, sipariş aşamasında seçilen yöntemle gerçekleştirilir.

MADDE 5 – TESLİMAT
Sipariş onayından itibaren en geç 3 iş günü içinde kargoya verilir. Kargo süresi 1-2 iş günüdür.

MADDE 6 – CAYMA HAKKI
Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi bir gerekçe göstermeksizin cayma hakkını kullanabilir.

MADDE 7 – GİZLİLİK
Alıcıya ait kişisel bilgiler KVKK kapsamında korunmaktadır.`
  },
  "/on-bilgilendirme-formu": {
    title: "Ön Bilgilendirme Formu",
    content: `6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanan bu form, satın alma işleminizden önce bilgilendirilmeniz amacıyla sunulmaktadır.

SATICI BİLGİLERİ
Ünvan: Mi Home Sanal Mağazacılık
Web: mihomesanal.com
E-posta: destek@mihomesanal.com

ÜRÜN BİLGİLERİ
Ürün adı, fiyatı ve özellikleri sipariş sayfasında yer almaktadır.

TESLİMAT
Sipariş onayından itibaren 1-3 iş günü içinde kargoya teslim edilir.

CAYMA HAKKI
Ürünü teslim aldığınız tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz. İade kargo ücreti alıcıya aittir.

GARANTİ
Tüm ürünlerimiz 2 yıl (dalış seti 3 yıl) garanti kapsamındadır.

UYUŞMAZLIK
Tüketici mahkemelerine veya tüketici hakem heyetine başvurma hakkınız saklıdır.`
  },
  "/iade-degisim-politikasi": {
    title: "İade ve Değişim Politikası",
    content: `İADE KOŞULLARI
• Ürünü teslim aldıktan sonra 30 gün içinde iade talebinde bulunabilirsiniz
• Ürün kullanılmamış ve orijinal ambalajında olmalıdır
• Tüm aksesuarları eksiksiz olmalıdır
• Fatura veya sipariş numarası gereklidir

YASAL CAYMA HAKKI
6502 sayılı Kanun kapsamında teslimden itibaren 14 gün içinde gerekçesiz cayma hakkınız bulunmaktadır.

İADE SÜRECİ
1. destek@mihomesanal.com veya WhatsApp ile iade talebinde bulunun
2. Ürünü belirtilen kargo firmasıyla gönderin
3. Ürün kontrolünden sonra 3 iş günü içinde iade işleminiz tamamlanır

DEĞİŞİM
Teslimden itibaren 14 gün içinde değişim talebinde bulunabilirsiniz. Değişim kargo ücreti firmamıza aittir.

PARA İADESİ
Kredi kartı ile yapılan ödemelerde iade, bankanıza göre 3-10 iş günü içinde yansır.

İSTİSNALAR
• Hijyenik ürünler (kullanılmış/ambalajı açılmış)
• Kişiye özel üretilmiş ürünler
• Yazılım ürünleri

İLETİŞİM
destek@mihomesanal.com | WhatsApp: 0500 000 0000`
  },
}

export default function LegalPage() {
  const location = useLocation()
  const content = PAGES[location.pathname]

  if (!content) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📄</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sayfa bulunamadı</h2>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-100">
            {content.title}
          </h1>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
            {content.content}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Mi Home Sanal Mağazacılık</span>
            <span>mihomesanal.com</span>
          </div>
        </div>
      </div>
    </div>
  )
}