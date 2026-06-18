// ============================================================
// Sipay Adapter
// Env: SIPAY_APP_KEY, SIPAY_APP_SECRET, SIPAY_MERCHANT_KEY
// Dokümantasyon: https://developer.sipay.com.tr
// ============================================================

exports.init = async (data) => {
  throw new Error("Sipay entegrasyonu henüz yapılandırılmadı.")
}

exports.handleCallback = async (body) => {
  return { success: false }
}

exports.handleWebhook = async (body) => {
  return { received: true }
}