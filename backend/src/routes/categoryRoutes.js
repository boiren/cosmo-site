// ============================================================
// routes/categoryRoutes.js
// ============================================================
const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
});

module.exports = router;
