export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gray-950 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 w-12 bg-blue-500 mb-8" />
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6 leading-none">
            Cosmo<br />Technology
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl leading-relaxed">
            2021'den bu yana elektronik ürün ithalatı, ar-ge ve modern teknoloji çözümleri alanında
            faaliyet gösteren yenilikçi bir teknoloji markası.
          </p>
        </div>
      </section>

      {/* Hikaye */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="h-0.5 w-10 bg-gray-900 mb-6" />
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Hikayemiz</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Cosmo Technology, 2021 yılından bu yana elektronik ürün ithalatı, ürün araştırma-geliştirme
                  süreçleri ve modern teknoloji çözümleri üzerine faaliyet gösteren yenilikçi bir teknoloji markasıdır.
                </p>
                <p>
                  Kurulduğumuz günden itibaren hedefimiz; günlük yaşamı kolaylaştıran, yüksek kalite
                  standartlarına sahip, modern tasarım anlayışıyla geliştirilmiş güvenilir ürünler sunmaktır.
                  Ürün seçiminden tasarım sürecine, kalite kontrol aşamalarından kullanıcı deneyimine kadar
                  her detay titizlikle değerlendirilmektedir.
                </p>
                <p>
                  Araç bakım teknolojileri, ağız bakım ürünleri, outdoor yaşam çözümleri ve dalış
                  ekipmanları başta olmak üzere farklı kategorilerde; estetik, işlevsellik ve dayanıklılığı
                  bir araya getiren ürünler geliştirmeye odaklanıyoruz.
                </p>
                <p>
                  Cosmo Technology olarak temel vizyonumuz; kullanıcılarımızı erişilebilir premium
                  teknolojiyle buluşturmak ve global standartlarda ürün deneyimi sunmaktır.
                </p>
                <p>
                  Bugün, yenilikçi yaklaşımımız ve kalite odaklı bakış açımızla büyümeye devam ederken,
                  teknolojiye olan tutkumuzu her ürünümüze yansıtmaktan gurur duyuyoruz.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { num: "2021",   label: "Kuruluş Yılı",     sub: "4 yıllık sektör deneyimi" },
                { num: "4",      label: "Ürün Serisi",       sub: "Kits · Care · Camping · Dive" },
                { num: "2 Yıl", label: "Resmi Garanti",     sub: "Tüm ürünlerde" },
                { num: "IPX8",   label: "Su Koruma Std.",    sub: "En yüksek sertifika" },
              ].map(({ num, label, sub }) => (
                <div key={label} className="border border-gray-100 p-6 flex items-center gap-6 hover:border-gray-300 transition-colors">
                  <div className="text-4xl font-black text-gray-900 w-28 flex-shrink-0">{num}</div>
                  <div>
                    <div className="font-bold text-gray-900">{label}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Değerler */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 w-10 bg-gray-900 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-12">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔬", title: "Ar-Ge Odaklılık",     desc: "Her ürün, kapsamlı araştırma ve geliştirme sürecinden geçer." },
              { icon: "🛡️", title: "Kalite Güvencesi",    desc: "Uluslararası sertifikalar ve sıkı kalite kontrol standartları." },
              { icon: "💡", title: "Yenilikçi Tasarım",   desc: "Estetik ve işlevselliği bir araya getiren ürün tasarım anlayışı." },
              { icon: "🌍", title: "Global Standart",     desc: "Dünya markalarıyla aynı kalitede, Türkiye'ye özel hizmet." },
              { icon: "🤝", title: "Müşteri Odaklılık",  desc: "Kullanıcı deneyimini her kararın merkezine koyan yaklaşım." },
              { icon: "♻️", title: "Sürdürülebilirlik",  desc: "Uzun ömürlü, dayanıklı ürünlerle çevreye duyarlı teknoloji." },
            ].map((v) => (
              <div key={v.title} className="bg-white p-6 border border-gray-100 hover:border-gray-300 transition-colors">
                <div className="text-3xl mb-4">{v.icon}</div>
                <div className="font-bold text-gray-900 mb-2">{v.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ürün serileri */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-0.5 w-10 bg-gray-900 mb-6" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-12">Ürün Serilerimiz</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { name: "Cosmo Kits",    icon: "🚗", color: "#ef4444", desc: "4'ü 1 arada modüler araç bakım seti. Jump starter, lastik şişirici, vakum temizleyici ve araç yıkama — tek power bank ile." },
              { name: "Cosmo Care",    icon: "🦷", color: "#3b82f6", desc: "3-in-1 sonic ağız bakım teknolojisi. Diş fırçalama, su jeti ve diş temizleme — tek cihazda profesyonel bakım." },
              { name: "Cosmo Camping", icon: "⛺", color: "#f97316", desc: "IPX8 taşınabilir duş sistemi. Kamp, plaj, karavan ve outdoor için 8.000 mAh, 180 dk kullanım süresi." },
              { name: "Cosmo Dive",    icon: "🤿", color: "#06b6d4", desc: "Çift motorlu sualtı scooter seti. IPX8 dalış maskesi ve sualtı feneri dahil — derinlikleri keşfetmek için." },
            ].map((s) => (
              <div key={s.name} className="border border-gray-100 p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <div className="font-black text-gray-900">{s.name}</div>
                    <div className="h-0.5 w-6 mt-1" style={{ background: s.color }} />
                  </div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kurucu */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
              R
            </div>
            <div>
              <div className="text-gray-500 text-xs tracking-widest uppercase mb-2">Kurucu & CEO</div>
              <div className="text-white font-black text-2xl mb-1">Rojhat Yalçınkaya</div>
              <div className="text-gray-400 text-sm mb-4">Cosmo Technology · Mi Home Sanal Mağazacılık</div>
              <p className="text-gray-400 leading-relaxed max-w-xl text-sm">
                Teknoloji tutkusuyla kurulan Cosmo Technology'nin vizyonu; kullanıcıları erişilebilir
                premium teknolojiyle buluşturmak ve her ürünle yaşam kalitesini yükseltmektir.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
