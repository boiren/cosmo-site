const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null

    if (!token) return res.status(401).json({ success: false, message: "Yetkilendirme gerekli" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive)
      return res.status(401).json({ success: false, message: "Geçersiz token" })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: "Geçersiz token" })
  }
}

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ success: false, message: "Admin yetkisi gerekli" })
  next()
}