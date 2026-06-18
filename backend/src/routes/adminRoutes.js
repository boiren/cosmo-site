// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const { getDashboard, getUsers, createCoupon, getCoupons, updateCoupon, deleteCoupon, updateBanners, updateLegalPage, updateSettings } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const Category = require('../models/Category');
const Product = require('../models/Product');

// Tüm admin route'ları protect + admin middleware gerektirir
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboard);

// Siparişler
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Ürünler
router.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (e) { next(e); }
});
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Kategoriler
router.get('/categories', async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ sortOrder: 1 });
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});
router.post('/categories', async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json({ success: true, data: cat });
  } catch (e) { next(e); }
});
router.put('/categories/:id', async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
});
router.delete('/categories/:id', async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Kategori silindi.' });
  } catch (e) { next(e); }
});

// Kullanıcılar
router.get('/users', getUsers);
router.put('/users/:id/toggle', async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

// Kuponlar
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Bannerlar
router.put('/banners', updateBanners);

// Yasal sayfalar
router.put('/legal-pages', updateLegalPage);

// Site ayarları
router.put('/settings', updateSettings);

module.exports = router;
