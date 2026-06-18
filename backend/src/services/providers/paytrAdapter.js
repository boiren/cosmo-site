// ============================================================
// PayTR Adapter
// Env: PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT
// Dokümantasyon: https://dev.paytr.com
// ============================================================

const crypto = require("crypto")

exports.init = async ({ orderId, amount, userIp, userEmail, userBasket, successUrl, failUrl }) => {
  // const merchantId   = process.env.PAYTR_MERCHANT_ID
  // const merchantKey  = process.env.PAYTR_MERCHANT_KEY
  // const merchantSalt = process.env.PAYTR_MERCHANT_SALT
  //
  // const basketEncoded = Buffer.from(JSON.stringify(userBasket)).toString("base64")
  // const amountKurus   = Math.round(amount * 100)
  // const noInstallment = 1, maxInstallment = 0, currency = "TL", testMode = 0
  //
  // const hashStr = `${merchantId}${userIp}${orderId}${userEmail}${amountKurus}${basketEncoded}${noInstallment}${maxInstallment}${currency}${testMode}`
  // const token   = crypto.createHmac("sha256", merchantKey + merchantSalt).update(hashStr).digest("base64")
  //
  // // PayTR iframe token al ve frontend'e döndür
  // const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //   body: new URLSearchParams({ merchant_id: merchantId, user_ip: userIp, merchant_oid: orderId, email: userEmail, payment_amount: amountKurus, paytr_token: token, user_basket: basketEncoded, debug_on: 1, no_installment: noInstallment, max_installment: maxInstallment, user_name: userEmail, user_address: "", user_phone: "", merchant_ok_url: successUrl, merchant_fail_url: failUrl, currency, test_mode: testMode })
  // })
  // const data = await response.json()
  // if (data.status !== "success") throw new Error(data.reason)
  // return { token: data.token }

  throw new Error("PayTR entegrasyonu henüz yapılandırılmadı.")
}

exports.handleCallback = async (body) => {
  return { success: body.status === "success", orderId: body.merchant_oid }
}

exports.handleWebhook = async (body, headers) => {
  return { received: true }
}