const router = require("express").Router()
const ctrl = require("../controllers/cartController")

router.post("/coupon", ctrl.applyCoupon)

module.exports = router