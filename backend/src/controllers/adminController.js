const Order   = require("../models/Order")
const Product = require("../models/Product")
const User    = require("../models/User")
const Coupon  = require("../models/Coupon")
const Settings = require("../models/Settings")
const { sendShippingNotification } = require("../utils/sendEmail")

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, revenueData, pendingOrders, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([
        { $match: { paymentStatus: "success" } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Order.countDocuments({ status: "pending" }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
    ])
    res.json({
      success: true,
      totalOrders,
      totalUsers,
      totalRevenue: revenueData[0]?.total || 0,
      pendingOrders,
      recentOrders,
    })
  } catch (err) { next(err) }
}

exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = status && status !== "all" ? { status } : {}
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate("user", "name email"),
      Order.countDocuments(query),
    ])
    res.json({ success: true, orders, total })
  } catch (err) { next(err) }
}

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email").populate("items.product", "name images")
    if (!order) return res.status(404).json({ success: false, message: "Sipariş bulunamadı" })
    res.json({ success: true, order })
  } catch (err) { next(err) }
}

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, carrier } = req.body
    const update = { status }
    if (trackingNumber) update.trackingNumber = trackingNumber
    if (carrier) update.carrier = carrier

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!order) return res.status(404).json({ success: false, message: "Sipariş bulunamadı" })

    if (status === "shipped" && trackingNumber)
      await sendShippingNotification(order).catch(console.error)

    res.json({ success: true, order })
  } catch (err) { next(err) }
}

exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(),
    ])
    res.json({ success: true, users, total })
  } catch (err) { next(err) }
}

// Kupon CRUD
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json({ success: true, coupons })
  } catch (err) { next(err) }
}

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body)
    res.status(201).json({ success: true, coupon })
  } catch (err) { next(err) }
}

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, coupon })
  } catch (err) { next(err) }
}

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Kupon silindi" })
  } catch (err) { next(err) }
}

// Ayarlar
exports.getSettings = async (req, res, next) => {
  try {
    const docs = await Settings.find()
    const settings = {}
    docs.forEach(d => settings[d.key] = d.value)
    res.json({ success: true, settings })
  } catch (err) { next(err) }
}

exports.updateSettings = async (req, res, next) => {
  try {
    const updates = Object.entries(req.body)
    await Promise.all(updates.map(([key, value]) =>
      Settings.findOneAndUpdate({ key }, { value }, { upsert: true })
    ))
    res.json({ success: true, message: "Ayarlar kaydedildi" })
  } catch (err) { next(err) }
}

exports.updateLegalPage = async (req, res, next) => {
  try {
    await Settings.findOneAndUpdate(
      { key: `legal_${req.params.page}` },
      { value: req.body.content },
      { upsert: true }
    )
    res.json({ success: true, message: "Sayfa güncellendi" })
  } catch (err) { next(err) }
}