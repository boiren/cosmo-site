import { useState } from "react"

const FAQS = [
  { q: "Kargo ne kadar sürer?", a: "Siparişleriniz 1-3 iş günü içinde kargoya verilir. Kargo süresi 1-2 iş günüdür." },
  { q: "Ücretsiz kargo var mı?", a: "500 TL ve üzeri siparişlerde kargo ücretsizdir." },
  { q: "İade nasıl yapılır?", a: "Ürünü teslim aldıktan sonra 30 gün içinde iade talebinde bulunabilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır." },
  { q: "Garanti kapsamı nedir?", a: "Tüm ürünlerimiz 2 yıl (dalış seti 3 yıl) üretici garantisi kapsamındadır." },
  { q: "Sanal POS entegrasyonu ne zaman aktif olacak?", a: "Yakında iyzico, PayTR, Param veya banka sanal POS entegrasyonu aktif olacaktır." },
  { q: "Fatura kesiyor musunuz?", a: "Evet, bireysel ve kurumsal fatura kesilmektedir. Kurumsal faturalar için şirket ve vergi bilgilerinizi girmeniz gerekmektedir." },
]

export default function FAQPage() {
  const [open, setOpen] = useState(null)
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Sık Sorulan Sorular</h1>
          <p className="text-gray-500">Aklınızdaki soruların cevapları burada</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {faq.q}
                <svg className={"w-5 h-5 transition-transform " + (open === i ? "rotate-180 text-blue-600" : "text-gray-400")}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {open === i && <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}