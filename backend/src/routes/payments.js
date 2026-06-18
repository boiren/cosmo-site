const router = require("express").Router()
const { protect } = require("../middlewares/auth")
const paymentService = require("../services/paymentService")

// ─── ÖDEME BAŞLAT ────────────────────────────────────────────────────────────
// POST /api/payments/init
// Body: { orderId, amount, callbackUrl, cardHolder, cardNumber, expMonth, expYear, cvc }
// Bu endpoint seçilen sağlayıcıya init isteği atar ve 3D Secure yönlendirmesi döner.
router.post("/init", protect, async (req, res, next) => {
  try {
    const result = await paymentService.init(req.body)
    res.json({ success: true, ...result })
  } catch (err) { next(err) }
})

// ─── 3D SECURE CALLBACK ──────────────────────────────────────────────────────
// POST /api/payments/callback
// Sağlayıcı buraya POST atar (3D doğrulama sonrası)
router.post("/callback", async (req, res, next) => {
  try {
    const result = await paymentService.handleCallback(req.body)
    // Başarı veya hata sayfasına yönlendir
    const redirectUrl = result.success
      ? `${process.env.FRONTEND_URL}/siparis-tamamlandi/${result.orderId}`
      : `${process.env.FRONTEND_URL}/siparis-basarisiz`
    res.redirect(redirectUrl)
  } catch (err) {
    res.redirect(`${process.env.FRONTEND_URL}/siparis-basarisiz`)
  }
})

// ─── WEBHOOK ─────────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// Bazı sağlayıcılar (PayTR, Param vb.) webhook gönderir
router.post("/webhook", async (req, res, next) => {
  try {
    await paymentService.handleWebhook(req.body, req.headers)
    res.send("OK")
  } catch (err) { next(err) }
})

// ─── ÖDEME DURUMU ─────────────────────────────────────────────────────────────
// GET /api/payments/status/:orderId
router.get("/status/:orderId", protect, async (req, res, next) => {
  try {
    const status = await paymentService.getStatus(req.params.orderId)
    res.json({ success: true, ...status })
  } catch (err) { next(err) }
})

module.exports = router