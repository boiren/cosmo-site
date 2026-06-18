// ============================================================
// Placeholder Adapter — Gerçek ödeme aktif olmadan test için
// ============================================================
// Gerçek entegrasyon için bu dosyayı iyzicoAdapter.js veya
// paytrAdapter.js ile değiştirin.

exports.init = async ({ orderId, amount }) => {
  console.log(`[Placeholder] Ödeme başlatıldı: ${orderId} — ${amount} TL`)
  return {
    status: "pending",
    message: "Sanal POS entegrasyonu henüz aktif değil",
    // 3D Secure URL: gerçek entegrasyonda buradan sağlayıcı URL'i döner
    redirectUrl: null,
  }
}

exports.handleCallback = async (body) => {
  return { success: false, message: "Entegrasyon aktif değil", orderId: body.orderId }
}

exports.handleWebhook = async (body) => {
  console.log("[Placeholder] Webhook alındı:", body)
  return { received: true }
}