const router = require("express").Router()
const { protect } = require("../middlewares/auth")
const ctrl = require("../controllers/authController")

router.post("/register",        ctrl.register)
router.post("/login",           ctrl.login)
router.get ("/profile",         protect, ctrl.getProfile)
router.put ("/profile",         protect, ctrl.updateProfile)
router.post("/forgot-password", ctrl.forgotPassword)
router.post("/reset-password",  ctrl.resetPassword)

module.exports = router