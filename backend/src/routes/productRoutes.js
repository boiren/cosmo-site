// ============================================================
// routes/productRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductsByCategory, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:slug', getProduct);

module.exports = router;

// ============================================================
// routes/categoryRoutes.js
// ============================================================
const catRouter = express.Router();
const Category = require('../models/Category');

catRouter.get('/', async (req, res, next) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: cats });
  } catch (e) { next(e); }
});

catRouter.get('/:slug', async (req, res, next) => {
  try {
    const cat = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!cat) return res.status(404).json({ success: false, message: 'Kategori bulunamadı.' });
    res.json({ success: true, data: cat });
  } catch (e) { next(e); }
});

// Cart Routes — inline
const cartRouter = express.Router();
const Cart = (() => {
  // In-memory cart (DB'de tutulacaksa ayrı model oluşturun)
  // Bu örnekte kullanıcı başına sepet Order oluşturulana kadar
  // localStorage'da tutulur, backend sadece doğrulama yapar.
  return null;
})();

cartRouter.post('/validate', protect, async (req, res, next) => {
  // Ön: Sepet içeriğini DB'den doğrula (stok, fiyat)
  try {
    const Product = require('../models/Product');
    const { items } = req.body;
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) continue;
      validated.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        stock: product.stock,
        qty: Math.min(item.qty, product.stock),
      });
    }
    res.json({ success: true, data: validated });
  } catch (e) { next(e); }
});

// Coupon validate
const couponRouter = express.Router();
const { Coupon } = require('../models/Coupon');

couponRouter.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, total } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Geçersiz kupon kodu.' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Kupon süresinin sona ermiş.' });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Kupon kullanım limiti dolmuş.' });
    }
    if (total < coupon.minOrderAmount) {
      return res.status(400).json({ success: false, message: `Bu kupon için minimum sipariş tutarı ${coupon.minOrderAmount}₺.` });
    }
    const discount = coupon.type === 'percent'
      ? Math.round(total * coupon.value / 100)
      : Math.min(coupon.value, total);
    res.json({ success: true, data: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
  } catch (e) { next(e); }
});

module.exports = { productRouter: router, catRouter, cartRouter, couponRouter };
