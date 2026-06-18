// ============================================================
// COSMO TECHNOLOGY — Modüler Ödeme Servisi
// ============================================================
// Kullanım:
//   PAYMENT_PROVIDER env değişkenini ayarlayın: "iyzico" | "paytr" | "param" | "sipay"
//   İlgili sağlayıcı adapter'ını aşağıdan seçin ve ortam değişkenlerini .env'e ekleyin.
// ============================================================

const Order = require("../models/Order")

// Aktif sağlayıcıyı seç
const getProvider = () => {
  const provider = process.env.PAYMENT_PROVIDER || "placeholder"
  switch (provider) {
    case "iyzico":  return require("./providers/iyzicoAdapter")
    case "paytr":   return require("./providers/paytrAdapter")
    case "param":   return require("./providers/paramAdapter")
    case "sipay":   return require("./providers/sipayAdapter")
    default:        return require("./providers/placeholderAdapter")
  }
}

// ─── ÖDEME BAŞLAT ─────────────────────────────────────────────
exports.init = async (data) => {
  const provider = getProvider()
  return await provider.init(data)
}

// ─── 3D SECURE CALLBACK ───────────────────────────────────────
exports.handleCallback = async (body) => {
  const provider = getProvider()
  const result = await provider.handleCallback(body)

  // Sipariş durumunu güncelle
  if (result.orderId) {
    const paymentStatus = result.success ? "success" : "failed"
    const orderStatus   = result.success ? "processing" : "pending"
    await Order.findByIdAndUpdate(result.orderId, {
      paymentStatus,
      status: orderStatus,
      paymentReference: result.reference,
    })
  }

  return result
}

// ─── WEBHOOK ──────────────────────────────────────────────────
exports.handleWebhook = async (body, headers) => {
  const provider = getProvider()
  return await provider.handleWebhook(body, headers)
}

// ─── ÖDEME DURUMU ─────────────────────────────────────────────
exports.getStatus = async (orderId) => {
  const order = await Order.findById(orderId).select("paymentStatus paymentReference total")
  if (!order) throw new Error("Sipariş bulunamadı")
  return { paymentStatus: order.paymentStatus, reference: order.paymentReference, total: order.total }
}