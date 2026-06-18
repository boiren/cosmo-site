const router = require("express").Router()
const { protect } = require("../middlewares/auth")
const ctrl = require("../controllers/orderController")

router.post  ("/",           protect, ctrl.createOrder)
router.get   ("/my-orders",  protect, ctrl.getMyOrders)
router.get   ("/:id",        protect, ctrl.getOrderById)

module.exports = router