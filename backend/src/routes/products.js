const router = require("express").Router()
const ctrl = require("../controllers/productController")

router.get("/",                     ctrl.getProducts)
router.get("/slug/:slug",           ctrl.getProductBySlug)
router.get("/category/:category",   ctrl.getProductsByCategory)
router.get("/:id",                  ctrl.getProductById)

module.exports = router