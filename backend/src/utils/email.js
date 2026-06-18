// ============================================================
// utils/email.js — Nodemailer e-posta servisi
// ============================================================
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const templates = {
  welcome: ({ name }) => ({
    subject: 'Cosmo Technology\'e Hoş Geldiniz!',
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0F172A;padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">COSMO TECHNOLOGY</h1>
      </div>
      <div style="padding:32px">
        <h2 style="color:#0F172A">Merhaba ${name}!</h2>
        <p>Cosmo Technology ailesine hoş geldiniz. Hesabınız başarıyla oluşturuldu.</p>
        <a href="${process.env.FRONTEND_URL}/urunler" style="display:inline-block;background:#0EA5E9;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px">Alışverişe Başla</a>
      </div>
      <div style="background:#F8FAFC;padding:16px;text-align:center;font-size:12px;color:#94A3B8">
        Mi Home Sanal Mağazacılık | mihomesanal.com
      </div>
    </div>`,
  }),

  orderConfirmation: ({ name, order }) => ({
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0F172A;padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0">COSMO TECHNOLOGY</h1>
      </div>
      <div style="padding:32px">
        <h2>Siparişiniz Alındı ✅</h2>
        <p>Merhaba ${name}, <strong>#${order.orderNumber}</strong> numaralı siparişinizi aldık.</p>
        <table style="width:100%;border-collapse:collapse">
          ${order.items.map(item => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${item.name} × ${item.qty}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${(item.price * item.qty).toLocaleString('tr-TR')}₺</td></tr>`).join('')}
          <tr><td style="padding:8px;font-weight:bold">TOPLAM</td><td style="padding:8px;text-align:right;font-weight:bold">${order.total.toLocaleString('tr-TR')}₺</td></tr>
        </table>
        <a href="${process.env.FRONTEND_URL}/hesabim/siparislerim/${order._id}" style="display:inline-block;background:#0EA5E9;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:24px">Sipariş Detayı</a>
      </div>
    </div>`,
  }),

  orderShipped: ({ name, order, cargoCompany, cargoTrackingNumber, cargoTrackingUrl }) => ({
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0F172A;padding:32px;text-align:center">
        <h1 style="color:#fff;margin:0">COSMO TECHNOLOGY</h1>
      </div>
      <div style="padding:32px">
        <h2>Siparişiniz Yola Çıktı 🚚</h2>
        <p>Merhaba ${name}, <strong>#${order.orderNumber}</strong> numaralı siparişiniz kargoya verildi.</p>
        <div style="background:#F0FDF4;padding:16px;border-radius:8px;margin:16px 0">
          <p><strong>Kargo Firması:</strong> ${cargoCompany}</p>
          <p><strong>Takip No:</strong> ${cargoTrackingNumber}</p>
          ${cargoTrackingUrl ? `<a href="${cargoTrackingUrl}" style="color:#0EA5E9">Kargonu Takip Et →</a>` : ''}
        </div>
      </div>
    </div>`,
  }),

  resetPassword: ({ name, resetUrl }) => ({
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="padding:32px">
        <h2>Şifre Sıfırlama</h2>
        <p>Merhaba ${name}, şifre sıfırlama talebinde bulundunuz.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#0EA5E9;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Şifremi Sıfırla</a>
        <p style="color:#94A3B8;margin-top:16px;font-size:12px">Bu bağlantı 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız e-postayı görmezden gelin.</p>
      </div>
    </div>`,
  }),

  adminNewOrder: ({ order, user }) => ({
    subject: `Yeni Sipariş: #${order.orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif">
      <h2>Yeni Sipariş Alındı</h2>
      <p><strong>Sipariş:</strong> #${order.orderNumber}</p>
      <p><strong>Müşteri:</strong> ${user.name} (${user.email})</p>
      <p><strong>Tutar:</strong> ${order.total.toLocaleString('tr-TR')}₺</p>
      <a href="${process.env.FRONTEND_URL}/admin/siparisler/${order._id}">Admin Panelde Gör →</a>
    </div>`,
  }),
};

const sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    const transporter = createTransporter();
    const tmpl = template ? templates[template]?.(data) : null;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Cosmo Technology" <info@mihomesanal.com>',
      to,
      subject: subject || tmpl?.subject || 'Cosmo Technology',
      html: html || tmpl?.html || '',
    });
  } catch (error) {
    console.error('E-posta gönderilemedi:', error.message);
    // E-posta hatası uygulamayı durdurmamalı
  }
};

module.exports = { sendEmail };
