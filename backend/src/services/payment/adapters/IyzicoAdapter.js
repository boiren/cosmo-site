// ============================================================
// services/payment/adapters/IyzicoAdapter.js
// iyzico entegrasyon şablonu
// Belgeler: https://dev.iyzipay.com/tr
// npm install iyzipay  →  paketi backend'e ekleyin
// ============================================================

// const Iyzipay = require('iyzipay');

class IyzicoAdapter {
  constructor() {
    // this.iyzipay = new Iyzipay({
    //   apiKey: process.env.IYZICO_API_KEY,
    //   secretKey: process.env.IYZICO_SECRET_KEY,
    //   uri: process.env.IYZICO_BASE_URL,
    // });
    console.warn('[IyzicoAdapter] iyzico henüz yapılandırılmamış. npm install iyzipay yapın.');
  }

  async initPayment({ order, user, callbackUrl, failUrl }) {
    /*
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order._id.toString(),
      price: order.total.toFixed(2),
      paidPrice: order.total.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: order.orderNumber,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: user._id.toString(),
        name: user.name.split(' ')[0],
        surname: user.name.split(' ').slice(1).join(' ') || '-',
        email: user.email,
        identityNumber: '11111111111', // TC / form'dan alın
        registrationAddress: order.shippingAddress.address,
        ip: '85.34.78.112', // req.ip
        city: order.shippingAddress.city,
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: order.shippingAddress.fullName,
        city: order.shippingAddress.city,
        country: 'Turkey',
        address: order.shippingAddress.address,
      },
      billingAddress: {
        contactName: order.invoiceInfo?.fullName || order.shippingAddress.fullName,
        city: order.invoiceInfo?.city || order.shippingAddress.city,
        country: 'Turkey',
        address: order.invoiceInfo?.address || order.shippingAddress.address,
      },
      basketItems: order.items.map(item => ({
        id: item.product.toString(),
        name: item.name,
        category1: 'Teknoloji',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: (item.price * item.qty).toFixed(2),
      })),
    };

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) return reject(err);
        if (result.status === 'success') {
          resolve({
            success: true,
            provider: 'iyzico',
            checkoutFormContent: result.checkoutFormContent,
            token: result.token,
            paymentPageUrl: result.paymentPageUrl,
          });
        } else {
          resolve({ success: false, errorMessage: result.errorMessage });
        }
      });
    });
    */

    throw new Error('iyzico adaptörü henüz aktif değil. PAYMENT_PROVIDER=mock kullanın.');
  }

  async handleCallback(data) {
    /*
    const { token } = data;
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve({ token }, (err, result) => {
        if (err) return reject(err);
        resolve({
          success: result.paymentStatus === 'SUCCESS',
          orderId: result.basketId, // veya conversationId
          status: result.paymentStatus === 'SUCCESS' ? 'odendi' : 'basarisiz',
          reference: result.paymentId,
        });
      });
    });
    */
    throw new Error('iyzico callback henüz aktif değil.');
  }

  async getPaymentStatus(reference) {
    throw new Error('iyzico status sorgusu henüz aktif değil.');
  }

  async refund(reference, amount) {
    throw new Error('iyzico iade henüz aktif değil.');
  }
}

module.exports = IyzicoAdapter;
