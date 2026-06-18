import { AdminProvider } from "./context/AdminContext" 
import { Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import { Toaster } from "react-hot-toast"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

// Pages
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderSuccessPage from "./pages/OrderSuccessPage"
import OrderFailPage from "./pages/OrderFailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AccountPage from "./pages/AccountPage"
import OrdersPage from "./pages/OrdersPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import FAQPage from "./pages/FAQPage"
import LegalPage from "./pages/LegalPage"

// Admin pages
import AdminLayout from "./admin/AdminLayout"
import AdminDashboard from "./admin/pages/AdminDashboard"
import AdminProducts from "./admin/pages/AdminProducts"
import AdminProductForm from "./admin/pages/AdminProductForm"
import AdminOrders from "./admin/pages/AdminOrders"
import AdminOrderDetail from "./admin/pages/AdminOrderDetail"
import AdminUsers from "./admin/pages/AdminUsers"
import AdminCoupons from "./admin/pages/AdminCoupons"
import AdminSettings from "./admin/pages/AdminSettings"
import AdminLogin from "./admin/pages/AdminLogin"

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
   <AdminProvider>
 <AuthProvider>
      <CartProvider>
        <Toaster position="top-center" toastOptions={{
          style: { borderRadius: "12px", fontFamily: "Inter, sans-serif", fontSize: "14px" },
          success: { style: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534" } },
          error:   { style: { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" } },
        }} />
        <ScrollToTop />
        <Routes>
          {/* Admin routes — no main layout */}
          <Route path="/admin/giris" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="urunler" element={<AdminProducts />} />
            <Route path="urunler/ekle" element={<AdminProductForm />} />
a            <Route path="urunler/:id/duzenle" element={<AdminProductForm />} />
            <Route path="siparisler" element={<AdminOrders />} />
            <Route path="siparisler/:id" element={<AdminOrderDetail />} />
            <Route path="kullanicilar" element={<AdminUsers />} />
            <Route path="kuponlar" element={<AdminCoupons />} />
            <Route path="ayarlar" element={<AdminSettings />} />
          </Route>

          {/* Public routes — with main layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/urunler" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/kategori/:category" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/urunler/:slug" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/sepet" element={<Layout><CartPage /></Layout>} />
          <Route path="/odeme" element={<Layout><CheckoutPage /></Layout>} />
          <Route path="/siparis-tamamlandi/:id" element={<Layout><OrderSuccessPage /></Layout>} />
          <Route path="/siparis-basarisiz" element={<Layout><OrderFailPage /></Layout>} />
          <Route path="/giris" element={<Layout><LoginPage /></Layout>} />
          <Route path="/uye-ol" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/hesabim" element={<Layout><AccountPage /></Layout>} />
          <Route path="/siparislerim" element={<Layout><OrdersPage /></Layout>} />
          <Route path="/hakkimizda" element={<Layout><AboutPage /></Layout>} />
          <Route path="/iletisim" element={<Layout><ContactPage /></Layout>} />
          <Route path="/sss" element={<Layout><FAQPage /></Layout>} />
          <Route path="/kvkk" element={<Layout><LegalPage /></Layout>} />
          <Route path="/gizlilik-politikasi" element={<Layout><LegalPage /></Layout>} />
          <Route path="/cerez-politikasi" element={<Layout><LegalPage /></Layout>} />
          <Route path="/mesafeli-satis-sozlesmesi" element={<Layout><LegalPage /></Layout>} />
          <Route path="/on-bilgilendirme-formu" element={<Layout><LegalPage /></Layout>} />
          <Route path="/iade-degisim-politikasi" element={<Layout><LegalPage /></Layout>} />
        </Routes>
      </CartProvider>
    </AuthProvider>
</AdminProvider>
  )
}