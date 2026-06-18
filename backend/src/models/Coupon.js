const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
  type:        { type: String, enum: ["percent","fixed"], required: true },
  value:       { type: Number, required: true, min: 0 },
  minOrder:    { type: Number, default: 0 },
  usageLimit:  { type: Number },
  usageCount:  { type: Number, default: 0 },
  active:      { type: Boolean, default: true },
  expiresAt:   Date,
}, { timestamps: true })

couponSchema.methods.isValid = function (orderTotal) {
  if (!this.active) return false
  if (this.expiresAt && this.expiresAt < new Date()) return false
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false
  if (orderTotal < this.minOrder) return false
  return true
}

module.exports = mongoose.model("Coupon", couponSchema)