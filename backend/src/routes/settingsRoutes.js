// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const { Settings, Banner, LegalPage } = require('../models/Coupon');

router.get('/', async (req, res, next) => {
  try {
    const settings = await Settings.find();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json({ success: true, data: obj });
  } catch (e) { next(e); }
});

router.get('/banners', async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: banners });
  } catch (e) { next(e); }
});

router.get('/legal/:key', async (req, res, next) => {
  try {
    const page = await LegalPage.findOne({ key: req.params.key });
    if (!page) return res.status(404).json({ success: false, message: 'Sayfa bulunamadı.' });
    res.json({ success: true, data: page });
  } catch (e) { next(e); }
});

module.exports = router;
