import { useState } from "react"
import toast from "react-hot-toast"

export default function ContactPage() {
  const [form,    setForm]    = useState({ name:"", email:"", phone:"", subject:"", message:"" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Mesajınız iletildi! En kısa sürede dönüş yapacağız.")
    setForm({ name:"", email:"", phone:"", subject:"", message:"" })
    setLoading(false)
  }

  return (
    <div className="pt-16 min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 w-10 bg-blue-500 mb-6" />
          <h1 className="text-5xl font-black text-white tracking-tight">İletişim</h1>
          <p className="text-gray-400 mt-4 text-lg">Size en kısa sürede geri dönüş yaparız.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Form — geniş */}
            <div className="lg:col-span-3">
              <div className="h-0.5 w-10 bg-gray-900 mb-6" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Ad Soyad</label>
                    <input required value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none text-sm transition-colors"
                      placeholder="Ad Soyad" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">E-posta</label>
                    <input type="email" required value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none text-sm transition-colors"
                      placeholder="ornek@email.com" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Telefon</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none text-sm transition-colors"
                      placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Konu</label>
                    <select value={form.subject} onChange={e => setForm(p=>({...p,subject:e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none text-sm transition-colors bg-white">
                      <option value="">Seçiniz</option>
                      <option>Ürün Bilgisi</option>
                      <option>Sipariş Durumu</option>
                      <option>İade & Değişim</option>
                      <option>Teknik Destek</option>
                      <option>Diğer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">Mesajınız</label>
                  <textarea rows={5} required value={form.message} onChange={e => setForm(p=>({...p,message:e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-gray-900 outline-none text-sm transition-colors resize-none"
                    placeholder="Mesajınızı buraya yazın..." />
                </div>
                <button type="submit" disabled={loading}
                  className="bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs tracking-widest px-10 py-4 transition-all disabled:opacity-60 w-full sm:w-auto">
                  {loading ? "GÖNDERİLİYOR..." : "GÖNDER"}
                </button>
              </form>
            </div>

            {/* Bilgiler */}
            <div className="lg:col-span-2">
              <div className="h-0.5 w-10 bg-gray-900 mb-6" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">İletişim Bilgileri</h2>
              <div className="space-y-6">

                <a href="https://wa.me/905448904701" target="_blank" rel="noreferrer"
                  className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-[#25D366] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-0.5">WhatsApp Destek</div>
                    <div className="text-gray-900 font-semibold group-hover:text-green-600 transition-colors">+90 544 890 47 01</div>
                    <div className="text-gray-400 text-xs mt-0.5">Hızlı destek için</div>
                  </div>
                </a>

                <a href="mailto:Mi@mihomesanal.com"
                  className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-0.5">E-posta</div>
                    <div className="text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">Mi@mihomesanal.com</div>
                    <div className="text-gray-400 text-xs mt-0.5">24 saat içinde yanıt</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-0.5">Çalışma Saatleri</div>
                    <div className="text-gray-900 font-semibold">Pzt – Cmt: 09:00 – 18:00</div>
                    <div className="text-gray-400 text-xs mt-0.5">Pazar günleri kapalı</div>
                  </div>
                </div>

              </div>

              {/* Firma bilgisi */}
              <div className="mt-10 border border-gray-100 p-5">
                <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Firma Bilgisi</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div className="font-bold text-gray-900">Mi Home Sanal Mağazacılık</div>
                  <div className="text-gray-500">Cosmo Technology</div>
                  <div className="text-gray-500">mihomesanal.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
