const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html })
    console.log(`E-posta gönderildi: ${to}`)
  } catch (err) {
    console.error("E-posta gönderilemedi:", err.message)
  }
}

exports.sendOrderConfirmation = async (order) => {
  const items = order.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price * i.qty} TL</td></tr>`).join("")
  await sendEmail({
    to: order.deliveryAddress?.email || process.env.ADMIN_EMAIL,
    subject: `Siparişiniz Alındı - #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <h2>Siparişiniz Başarıyla Alındı!</h2>
      <p>Sipariş No: <strong>${order._id.toString().slice(-8).toUpperCase()}</strong></p>
      <table border="1" cellpadding="8">
        <tr><th>Ürün</th><th>Adet</th><th>Fiyat</th></tr>
        ${items}
        <tr><td colspan="2"><strong>Toplam</strong></td><td><strong>${order.total} TL</strong></td></tr>
      </table>
      <p>Teşekkür ederiz! - Cosmo Technology</p>
    `,
  })
}

exports.sendAdminNotification = async (order) => {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `Yeni Sipariş: #${order._id.toString().slice(-8).toUpperCase()} - ${order.total} TL`,
    html: `<p>Yeni sipariş alındı. Sipariş No: ${order._id}</p><p>Toplam: ${order.total} TL</p>`,
  })
}

exports.sendShippingNotification = async (order) => {
  await sendEmail({
    to: order.deliveryAddress?.email || "",
    subject: "Siparişiniz Kargoya Verildi",
    html: `
      <h2>Siparişiniz Yola Çıktı!</h2>
      <p>Kargo Firması: ${order.carrier || "—"}</p>
      <p>Takip No: <strong>${order.trackingNumber || "—"}</strong></p>
    `,
  })
}

module.exports = { sendEmail, ...exports }