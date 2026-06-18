// ============================================================
// middlewares/errorHandler.js
// ============================================================
const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV !== "production"

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ success: false, message: messages.join(", ") })
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "alan"
    return res.status(400).json({ success: false, message: `Bu ${field} zaten kullanımda` })
  }

  // MongoDB cast error (geçersiz ID)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Geçersiz kayıt ID'si" })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Geçersiz token" })
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Oturum süresi doldu" })
  }

  const status  = err.statusCode || err.status || 500
  const message = isDev ? err.message : (status < 500 ? err.message : "Sunucu hatası oluştu")

  res.status(status).json({ success: false, message })
}

module.exports = errorHandler
