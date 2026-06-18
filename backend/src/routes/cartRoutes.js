// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middlewares/authMiddleware');

router.post('/validate', protect, async (req, res, next) => {
  try {
    const { items } = req.body;
    const validated = [];
    for (const item of items) {
      const product = await Product.findById(item.product).populate('category', 'name');
      if (!product || !product.isActive) continue;
      validated.push({ product: product._id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: product.images[0], stock: product.stock, qty: Math.min(item.qty, product.stock) });
    }
    res.json({ success: true, data: validated });
  } catch (e) { next(e); }
});

module.exports = router;
