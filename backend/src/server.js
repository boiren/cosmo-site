require("dotenv").config()
const app       = require("./app")
const connectDB = require("./config/db")
const seedAdmin = require("./utils/seedAdmin")

const PORT = process.env.PORT || 5000
const ENV  = process.env.NODE_ENV || "development"

const start = async () => {
  await connectDB()
  await seedAdmin()

  app.listen(PORT, () => {
    if (ENV !== "production") {
      console.log(`\n🚀 Backend başladı — port ${PORT} (${ENV})\n`)
    }
  })
}

start().catch(err => {
  console.error("Sunucu başlatılamadı:", err.message)
  process.exit(1)
})
