// ============================================================
// controllers/paymentController.js
// ============================================================
const Order = require('../models/Order');
const paymentService = require('../services/payment/PaymentService');

// @desc    Ödeme başlat
// @route   POST /api/payments/init
// @access  Private
const initPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });
    if (order.paymentStatus === 'odendi') {
      return res.status(400).json({ success: false, message: 'Bu sipariş zaten ödenmiş.' });
    }

    const callbackUrl = `${process.env.FRONTEND_URL}/odeme-basarili?orderId=${order._id}`;
    const failUrl = `${process.env.FRONTEND_URL}/odeme-basarisiz?orderId=${order._id}`;

    const result = await paymentService.initPayment({
      order,
      user: req.user,
      callbackUrl,
      failUrl,
      req,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    3D Secure callback — sağlayıcı buraya POST yapar
// @route   POST /api/payments/callback
// @access  Public (sağlayıcı IP'leri whitelist edilmeli)
const paymentCallback = async (req, res, next) => {
  try {
    const result = await paymentService.handleCallback(req.body);

    if (result.success) {
      await Order.findByIdAndUpdate(result.orderId, {
        paymentStatus: 'odendi',
        status: 'onaylandi',
        paymentReference: result.reference,
        paymentProvider: process.env.PAYMENT_PROVIDER,
      });
    } else {
      await Order.findByIdAndUpdate(result.orderId, { paymentStatus: 'basarisiz' });
    }

    // PayTR ve bazı sağlayıcılar "OK" metni bekler
    res.send('OK');
  } catch (error) {
    console.error('Payment callback error:', error);
    res.send('OK'); // Sağlayıcı hata alsın diye yine OK dön
  }
};

// @desc    Ödeme durumu sorgula
// @route   GET /api/payments/status/:orderId
// @access  Private
const getPaymentStatus = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Sipariş bulunamadı.' });

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { initPayment, paymentCallback, getPaymentStatus };
