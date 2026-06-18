// ============================================================
// services/payment/adapters/PayTRAdapter.js
// PayTR entegrasyon şablonu
// Belgeler: https://dev.paytr.com/
// ============================================================
const crypto = require('crypto');

class PayTRAdapter {
  constructor() {
    this.merchantId = process.env.PAYTR_MERCHANT_ID;
    this.merchantKey = process.env.PAYTR_MERCHANT_KEY;
    this.merchantSalt = process.env.PAYTR_MERCHANT_SALT;
    this.testMode = process.env.NODE_ENV !== 'production' ? 1 : 0;
  }

  async initPayment({ order, user, callbackUrl, req }) {
    /*
    const basketItems = order.items.map(item => [item.name, item.price.toFixed(2), item.qty]);
    const basketEncoded = Buffer.from(JSON.stringify(basketItems)).toString('base64');

    const merchantOid = order.orderNumber;
    const paymentAmount = Math.round(order.total * 100); // Kuruş
    const email = user.email;
    const userIp = req.ip;
    const userBasket = basketEncoded;
    const noInstallment = 0;
    const maxInstallment = 0;
    const currency = 'TL';
    const lang = 'tr';

    const hashStr = `${this.merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${this.testMode}${this.merchantSalt}`;
    const paytrToken = crypto.createHmac('sha256', this.merchantKey).update(hashStr).digest('base64');

    const params = new URLSearchParams({
      merchant_id: this.merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email,
      payment_amount: paymentAmount,
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: this.testMode,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: user.name,
      user_address: order.shippingAddress.address,
      user_phone: user.phone || '',
      merchant_ok_url: callbackUrl,
      merchant_fail_url: callbackUrl.replace('basarili', 'basarisiz'),
      timeout_limit: 30,
      currency,
      test_mode: this.testMode,
      lang,
    });

    const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      body: params,
    });
    const result = await response.json();

    if (result.status === 'success') {
      return {
        success: true,
        provider: 'paytr',
        iframeToken: result.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
      };
    }
    return { success: false, errorMessage: result.reason };
    */

    throw new Error('PayTR adaptörü henüz aktif değil. PAYMENT_PROVIDER=mock kullanın.');
  }

  async handleCallback(data) {
    /*
    const { merchant_oid, status, total_amount, hash } = data;
    const hashStr = `${this.merchantKey}${merchant_oid}${this.merchantSalt}${status}${total_amount}`;
    const expectedHash = crypto.createHmac('sha256', this.merchantKey).update(hashStr).digest('base64');
    if (hash !== expectedHash) throw new Error('Geçersiz PayTR imzası');

    return {
      success: status === 'success',
      orderId: merchant_oid,
      status: status === 'success' ? 'odendi' : 'basarisiz',
      reference: merchant_oid,
    };
    */
    throw new Error('PayTR callback henüz aktif değil.');
  }

  async getPaymentStatus(reference) {
    throw new Error('PayTR status sorgusu henüz aktif değil.');
  }

  async refund(reference, amount) {
    throw new Error('PayTR iade henüz aktif değil.');
  }
}

module.exports = PayTRAdapter;
