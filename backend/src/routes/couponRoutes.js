// routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const { Coupon } = require('../models/Coupon');
const { protect } = require('../middlewares/authMiddleware');

router.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, total } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Geçersiz kupon kodu.' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'Kuponun süresi dolmuş.' });
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Kupon kullanım limiti dolmuş.' });
    if (total < coupon.minOrderAmount) return res.status(400).json({ success: false, message: `Min. sipariş tutarı: ${coupon.minOrderAmount}₺` });
    const discount = coupon.type === 'percent' ? Math.round(total * coupon.value / 100) : Math.min(coupon.value, total);
    res.json({ success: true, data: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
  } catch (e) { next(e); }
});

module.exports = router;

// routes/uploadRoutes.js
const uploadRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middlewares/authMiddleware');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/image\/(jpeg|png|webp|gif)/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Sadece resim dosyaları kabul edilir.'));
  },
});

uploadRouter.post('/', protect, admin, upload.array('images', 10), (req, res) => {
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ success: true, data: urls });
});

module.exports = { couponRouter: router, uploadRouter };
