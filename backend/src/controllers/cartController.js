const Coupon = require("../models/Coupon")

// Not: Sepet verisi frontend localStorage'da tutulur.
// Bu endpoint'ler isteğe bağlı sunucu taraflı sepet yönetimi içindir.

exports.applyCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body
    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
    if (!coupon) return res.status(404).json({ success: false, message: "Kupon bulunamadı" })
    if (!coupon.isValid(orderTotal || 0))
      return res.status(400).json({ success: false, message: "Bu kupon geçerli değil" })

    const discount = coupon.type === "percent"
      ? Math.round((orderTotal || 0) * coupon.value / 100)
      : coupon.value

    res.json({ success: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } })
  } catch (err) { next(err) }
}