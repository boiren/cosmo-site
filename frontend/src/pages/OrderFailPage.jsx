import { Link } from "react-router-dom"

export default function OrderFailPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Ödeme Başarısız</h1>
        <p className="text-gray-500 mb-8">İşleminiz gerçekleştirilemedi. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/sepet" className="btn-secondary">Sepete Dön</Link>
          <Link to="/iletisim" className="btn-primary">Destek Al</Link>
        </div>
      </div>
    </div>
  )
}