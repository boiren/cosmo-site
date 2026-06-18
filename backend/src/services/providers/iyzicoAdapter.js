// ============================================================
// iyzico Adapter
// npm install iyzipay
// Env: IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL
// ============================================================

// const Iyzipay = require("iyzipay")
//
// const iyzipay = new Iyzipay({
//   apiKey:    process.env.IYZICO_API_KEY,
//   secretKey: process.env.IYZICO_SECRET_KEY,
//   uri:       process.env.IYZICO_BASE_URL,
// })

exports.init = async ({ orderId, amount, buyer, shippingAddress, billingAddress, basketItems, callbackUrl, cardHolder, cardNumber, expMonth, expYear, cvc }) => {
  // const request = {
  //   locale:          "tr",
  //   conversationId:  orderId.toString(),
  //   price:           amount.toFixed(2),
  //   paidPrice:       amount.toFixed(2),
  //   currency:        "TRY",
  //   installment:     "1",
  //   basketId:        orderId.toString(),
  //   paymentChannel:  "WEB",
  //   paymentGroup:    "PRODUCT",
  //   callbackUrl,
  //   buyer,
  //   shippingAddress,
  //   billingAddress,
  //   basketItems,
  //   paymentCard: { cardHolderName: cardHolder, cardNumber, expireMonth: expMonth, expireYear: expYear, cvc, registerCard: "0" },
  // }
  // return new Promise((resolve, reject) => {
  //   iyzipay.threedsInitialize.create(request, (err, result) => {
  //     if (err) return reject(err)
  //     if (result.status !== "success") return reject(new Error(result.errorMessage))
  //     resolve({ htmlContent: result.threeDSHtmlContent })
  //   })
  // })

  throw new Error("iyzico entegrasyonu henüz yapılandırılmadı. IYZICO_API_KEY env değişkenini ayarlayın.")
}

exports.handleCallback = async (body) => {
  // const { conversationId, paymentId, status } = body
  // 3DS doğrulama: iyzipay.threedsPayment.create(...)
  return { success: false, message: "iyzico callback yapılandırılmadı" }
}

exports.handleWebhook = async (body) => {
  return { received: true }
}