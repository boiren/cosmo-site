// ============================================================
// controllers/authController.js
// ============================================================
const crypto = require("crypto")
const User   = require("../models/User")
const { generateToken } = require("../utils/jwt")

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Ad, e-posta ve şifre zorunludur" })

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists)
      return res.status(400).json({ success: false, message: "Bu e-posta zaten kayıtlı" })

    const user  = await User.create({ name, email: email.toLowerCase().trim(), phone, password })
    const token = generateToken(user._id)
    res.status(201).json({ success: true, token, user })
  } catch (err) { next(err) }
}

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: "E-posta ve şifre zorunludur" })

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password")
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı" })

    if (!user.isActive)
      return res.status(401).json({ success: false, message: "Hesabınız askıya alınmış" })

    const token = generateToken(user._id)
    res.json({ success: true, token, user })
  } catch (err) { next(err) }
}

// GET /api/auth/profile   (protect)
exports.getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user })
  } catch (err) { next(err) }
}

// PUT /api/auth/profile   (protect)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } catch (err) { next(err) }
}

// PUT /api/auth/change-password   (protect)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: "Mevcut ve yeni şifre zorunludur" })
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: "Yeni şifre en az 6 karakter olmalıdır" })

    const user = await User.findById(req.user._id).select("+password")
    if (!user)
      return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı" })

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Mevcut şifre yanlış" })

    user.password = newPassword   // User model pre-save bcrypt hashler
    await user.save()

    res.json({ success: true, message: "Şifre başarıyla değiştirildi" })
  } catch (err) { next(err) }
}

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase().trim() })
    if (!user)
      return res.json({ success: true, message: "Kayıtlı e-posta adresine sıfırlama bağlantısı gönderildi" })

    const token = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken   = crypto.createHash("sha256").update(token).digest("hex")
    user.resetPasswordExpires = Date.now() + 3600000 // 1 saat
    await user.save({ validateBeforeSave: false })
    // TODO: sendEmail(user.email, token)
    res.json({ success: true, message: "Şifre sıfırlama bağlantısı gönderildi" })
  } catch (err) { next(err) }
}

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.body.token || "").digest("hex")
    const user   = await User.findOne({
      resetPasswordToken:   hashed,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user)
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş token" })

    user.password             = req.body.password
    user.resetPasswordToken   = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    const token = generateToken(user._id)
    res.json({ success: true, token, user })
  } catch (err) { next(err) }
}
