const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:    String,
  image:   String,
  qty:     { type: Number, required: true, min: 1 },
  price:   { type: Number, required: true },
})

const addressSchema = new mongoose.Schema({
  name: String, phone: String, address: String,
  district: String, city: String, zip: String,
  type: { type: String, enum: ["individual","corporate"], default: "individual" },
  company: String, taxId: String, taxOffice: String,
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items:           [orderItemSchema],
  deliveryAddress: addressSchema,
  billingAddress:  addressSchema,
  subtotal:        { type: Number, required: true },
  discount:        { type: Number, default: 0 },
  shipping:        { type: Number, default: 0 },
  total:           { type: Number, required: true },
  coupon:          String,
  status: {
    type: String,
    enum: ["pending","processing","shipped","delivered","cancelled","refunded"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending","success","failed","refunded"],
    default: "pending"
  },
  paymentMethod:    String,
  paymentReference: String,
  carrier:          String,
  trackingNumber:   String,
  notes:            String,
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)