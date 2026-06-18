const mongoose = require("mongoose")

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("HATA: MONGODB_URI tanımlanmamış. .env dosyasını kontrol edin.")
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    if (process.env.NODE_ENV !== "production") {
      console.log(`   DB: ${conn.connection.host}`)
    }
  } catch (err) {
    console.error("MongoDB bağlantı hatası:", err.message)
    process.exit(1)
  }
}

module.exports = connectDB
