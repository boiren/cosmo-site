// ============================================================
// services/payment/PaymentService.js
// Adapter Pattern — Yeni sağlayıcı eklemek için yeni bir adapter
// dosyası oluşturun ve PROVIDERS objesine kaydedin.
// ============================================================

const MockAdapter = require('./adapters/MockAdapter');
const IyzicoAdapter = require('./adapters/IyzicoAdapter');
const PayTRAdapter = require('./adapters/PayTRAdapter');

// Kayıtlı ödeme sağlayıcıları
const PROVIDERS = {
  mock: MockAdapter,
  iyzico: IyzicoAdapter,
  paytr: PayTRAdapter,
  // param:  ParamAdapter,   -- eklenmeli
  // sipay:  SipayAdapter,   -- eklenmeli
};

class PaymentService {
  constructor() {
    const providerName = (process.env.PAYMENT_PROVIDER || 'mock').toLowerCase();
    const AdapterClass = PROVIDERS[providerName];

    if (!AdapterClass) {
      throw new Error(`Bilinmeyen ödeme sağlayıcısı: ${providerName}. Geçerli seçenekler: ${Object.keys(PROVIDERS).join(', ')}`);
    }

    this.provider = new AdapterClass();
    this.providerName = providerName;
    console.log(`💳 Ödeme sağlayıcısı: ${providerName.toUpperCase()}`);
  }

  /**
   * Ödeme başlat (3D Secure form/link döner)
   * @param {Object} orderData - { order, user, callbackUrl, failUrl }
   * @returns {Object} - { success, paymentUrl, token, ... }
   */
  async initPayment(orderData) {
    return this.provider.initPayment(orderData);
  }

  /**
   * 3D Secure callback işle
   * @param {Object} callbackData - Sağlayıcıdan gelen POST verisi
   * @returns {Object} - { success, orderId, status }
   */
  async handleCallback(callbackData) {
    return this.provider.handleCallback(callbackData);
  }

  /**
   * Ödeme durumu sorgula
   * @param {string} paymentReference - Sağlayıcı işlem ID
   */
  async getPaymentStatus(paymentReference) {
    return this.provider.getPaymentStatus(paymentReference);
  }

  /**
   * İptal / İade
   */
  async refund(paymentReference, amount) {
    return this.provider.refund(paymentReference, amount);
  }
}

// Singleton
module.exports = new PaymentService();
