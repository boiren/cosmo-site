// ============================================================
// COSMO TECHNOLOGY — Kargo Servisi (Placeholder)
// ============================================================
// Gelecekte entegre edilecek kargo firmalarına hazır yapı.
// Her firma için ayrı adapter oluşturun (yurticiAdapter.js, arasAdapter.js vb.)

exports.createShipment = async ({ orderId, carrier, address }) => {
  console.log(`[Kargo] ${carrier} için kargo oluşturma: ${orderId}`)
  // Gerçek entegrasyonda kargo firması API'si çağrılır
  // Takip numarası döndürülür ve sipariş güncellenir
  return { trackingNumber: null, message: "Kargo entegrasyonu henüz aktif değil" }
}

exports.getTrackingInfo = async (trackingNumber) => {
  return { trackingNumber, status: "Bilgi alınamadı", events: [] }
}