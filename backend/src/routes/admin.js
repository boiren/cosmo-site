const router = require("express").Router()
const { protect, adminOnly } = require("../middlewares/auth")
const productCtrl = require("../controllers/productController")
const adminCtrl   = require("../controllers/adminController")

// Tüm admin route'ları kimlik doğrulama + admin kontrolü gerektirir
router.use(protect, adminOnly)

// Dashboard
router.get("/dashboard", adminCtrl.getDashboard)

// Siparişler
router.get ("/orders",           adminCtrl.getOrders)
router.get ("/orders/:id",       adminCtrl.getOrder)
router.put ("/orders/:id/status",adminCtrl.updateOrderStatus)

// Ürünler
router.post  ("/products",       productCtrl.createProduct)
router.put   ("/products/:id",   productCtrl.updateProduct)
router.delete("/products/:id",   productCtrl.deleteProduct)

// Kullanıcılar
router.get("/users", adminCtrl.getUsers)

// Kuponlar
router.get   ("/coupons",      adminCtrl.getCoupons)
router.post  ("/coupons",      adminCtrl.createCoupon)
router.put   ("/coupons/:id",  adminCtrl.updateCoupon)
router.delete("/coupons/:id",  adminCtrl.deleteCoupon)

// Ayarlar
router.get("/settings",              adminCtrl.getSettings)
router.put("/settings",              adminCtrl.updateSettings)
router.put("/legal-pages/:page",     adminCtrl.updateLegalPage)

module.exports = router