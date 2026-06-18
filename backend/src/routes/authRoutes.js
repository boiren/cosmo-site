// ============================================================
// routes/authRoutes.js
// ============================================================
const router = require("express").Router()
const ctrl   = require("../controllers/authController")
const { protect } = require("../middlewares/auth")

router.post("/register",         ctrl.register)
router.post("/login",            ctrl.login)
router.get ("/profile",          protect, ctrl.getProfile)
router.put ("/profile",          protect, ctrl.updateProfile)
router.put ("/change-password",  protect, ctrl.changePassword)
router.post("/forgot-password",  ctrl.forgotPassword)
router.post("/reset-password",   ctrl.resetPassword)

module.exports = router
