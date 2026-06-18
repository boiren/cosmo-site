// ============================================================
// routes/paymentRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { initPayment, paymentCallback, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/init', protect, initPayment);
router.post('/callback', paymentCallback);           // Public — sağlayıcı IP whitelist
router.get('/status/:orderId', protect, getPaymentStatus);

module.exports = router;
