const Product = require("../models/Product")

exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 20 } = req.query
    const query = { isActive: true }
    if (category) query.category = category
    if (search) query.$text = { $search: search }

    const sortMap = {
      "price-asc":  { price: 1 },
      "price-desc": { price: -1 },
      "newest":     { createdAt: -1 },
      "featured":   { featured: -1, createdAt: -1 },
    }
    const sortObj = sortMap[sort] || { featured: -1, createdAt: -1 }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query),
    ])
    res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
  } catch (err) { next(err) }
}

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true })
    if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" })
    res.json({ success: true, product })
  } catch (err) { next(err) }
}

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" })
    res.json({ success: true, product })
  } catch (err) { next(err) }
}

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category, isActive: true })
    res.json({ success: true, products })
  } catch (err) { next(err) }
}

// Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
  } catch (err) { next(err) }
}

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ success: false, message: "Ürün bulunamadı" })
    res.json({ success: true, product })
  } catch (err) { next(err) }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: "Ürün silindi" })
  } catch (err) { next(err) }
}