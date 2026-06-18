const Order = require("../models/Order")
const Product = require("../models/Product")
const Coupon = require("../models/Coupon")
const { sendOrderConfirmation, sendAdminNotification } = require("../utils/sendEmail")

exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, billingAddress, coupon, subtotal, shipping, discount, total } = req.body

    // Stok kontrolü
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product || product.stock < item.qty)
        return res.status(400).json({ success: false, message: `${product?.name || "Ürün"} için yeterli stok yok` })
    }

    // Sipariş oluştur
    const order = await Order.create({
      user: req.user?._id,
      items,
      deliveryAddress,
      billingAddress: billingAddress || deliveryAddress,
      coupon,
      subtotal,
      shipping,
      discount: discount || 0,
      total,
    })

    // Stok güncelle
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } })
    }

    // Kupon kullanım sayısı artır
    if (coupon) await Coupon.findOneAndUpdate({ code: coupon }, { $inc: { usageCount: 1 } })

    // E-posta bildirim
    await Promise.all([
      sendOrderConfirmation(order).catch(console.error),
      sendAdminNotification(order).catch(console.error),
    ])

    res.status(201).json({ success: true, order })
  } catch (err) { next(err) }
}

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ success: true, orders })
  } catch (err) { next(err) }
}

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name images price")
    if (!order) return res.status(404).json({ success: false, message: "Sipariş bulunamadı" })
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Yetkisiz erişim" })
    res.json({ success: true, order })
  } catch (err) { next(err) }
}