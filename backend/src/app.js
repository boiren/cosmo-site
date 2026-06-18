// ============================================================
// app.js
// ============================================================
require("dotenv").config()
const express      = require("express")
const cors         = require("cors")
const helmet       = require("helmet")
const morgan       = require("morgan")
const rateLimit    = require("express-rate-limit")
const errorHandler = require("./middlewares/errorHandler")

const app = express()

// ─── Güvenlik ─────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // resim/asset erişimi için
}))
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}))

// ─── Rate limit (route'lardan ÖNCE gelsin) ───────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." },
  standardHeaders: true,
  legacyHeaders: false,
})
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { success: false, message: "İstek limiti aşıldı. Bir dakika bekleyin." },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use("/api/auth", authLimiter)
app.use("/api",      apiLimiter)

// ─── Body parser ──────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"))

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"))
app.use("/api/products", require("./routes/products"))
app.use("/api/orders",   require("./routes/orders"))
app.use("/api/cart",     require("./routes/cart"))
app.use("/api/payments", require("./routes/payments"))
app.use("/api/admin",    require("./routes/admin"))

// ─── Health ───────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV, ts: new Date().toISOString() })
)

// ─── SEO ──────────────────────────────────────────────────────
app.get("/robots.txt", (_req, res) => {
  const base = process.env.FRONTEND_URL || "https://mihomesanal.com"
  res.type("text/plain").send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${base}/sitemap.xml`
  )
})

app.get("/sitemap.xml", async (_req, res) => {
  try {
    const Product = require("./models/Product")
    const products = await Product.find({ isActive: true }).select("slug updatedAt").lean()
    const base = process.env.FRONTEND_URL || "https://mihomesanal.com"
    const staticUrls = ["/", "/urunler", "/hakkimizda", "/iletisim"].map(path =>
      `<url><loc>${base}${path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    )
    const productUrls = products.map(p =>
      `<url><loc>${base}/urunler/${p.slug}</loc><lastmod>${new Date(p.updatedAt).toISOString().split("T")[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    )
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...staticUrls, ...productUrls].join("\n")}\n</urlset>`
    )
  } catch {
    res.status(500).send("Sitemap oluşturulamadı")
  }
})

// ─── 404 ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: "Endpoint bulunamadı" }))

// ─── Error handler ────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
