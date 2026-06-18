// ============================================================
// COSMO TECHNOLOGY — Fatura Servisi (Placeholder)
// ============================================================
// e-Fatura / e-Arşiv entegrasyonuna hazır yapı.
// GIB GKP (Gelir İdaresi Başkanlığı) uyumlu entegratörler:
// - Logo, Mikro, QNB Finansbank, Ankara Aşaltı vb.

exports.createInvoice = async (order) => {
  console.log(`[Fatura] Fatura oluşturuluyor: ${order._id}`)
  // Gerçek entegrasyonda e-fatura servisi çağrılır
  // PDF fatura oluşturulur, müşteriye e-posta gönderilir
  return { invoiceId: null, pdfUrl: null, message: "Fatura entegrasyonu henüz aktif değil" }
}

exports.cancelInvoice = async (invoiceId) => {
  return { success: false, message: "Fatura iptali henüz aktif değil" }
}