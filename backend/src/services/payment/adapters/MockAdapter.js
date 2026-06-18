// ============================================================
// services/payment/adapters/MockAdapter.js
// Geliştirme / test için sahte ödeme sağlayıcısı
// Gerçek entegrasyon OLMADAN checkout akışını test etmek için
// ============================================================

class MockAdapter {
  async initPayment({ order, user, callbackUrl, failUrl }) {
    console.log('[MockAdapter] Ödeme başlatıldı:', {
      orderNumber: order.orderNumber,
      amount: order.total,
      user: user.email,
    });

    // Gerçek bir sağlayıcı burada kullanıcıyı 3D ödeme sayfasına
    // yönlendirmek için bir URL veya HTML form döndürür.
    return {
      success: true,
      provider: 'mock',
      paymentUrl: `${process.env.FRONTEND_URL}/odeme-basarili?orderId=${order._id}&mock=true`,
      token: `MOCK_TOKEN_${Date.now()}`,
      message: '[Test Modu] Gerçek ödeme alınmıyor.',
    };
  }

  async handleCallback(data) {
    return {
      success: true,
      orderId: data.orderId,
      status: 'odendi',
      reference: `MOCK_REF_${Date.now()}`,
    };
  }

  async getPaymentStatus(reference) {
    return { status: 'odendi', reference };
  }

  async refund(reference, amount) {
    console.log('[MockAdapter] İade:', { reference, amount });
    return { success: true, message: 'Test iadesi başarılı.' };
  }
}

module.exports = MockAdapter;
