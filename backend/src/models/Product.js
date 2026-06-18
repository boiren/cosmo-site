const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  shortDesc:   { type: String, required: true },
  description: { type: String, default: "" },
  category: {
    type: String,
    required: true,
    // Hem eski hem yeni kategori formatını destekle
    enum: [
      "cosmo-kits", "cosmo-care", "cosmo-camping", "cosmo-dive",
      "arac-bakim",  "dalis",      "outdoor-kamp",  "agiz-bakim",
    ],
  },
  price:     { type: Number, required: true, min: 0 },
  oldPrice:  { type: Number, min: 0 },
  stock:     { type: Number, required: true, min: 0, default: 0 },
  sku:       { type: String, sparse: true },   // sparse: boş değerlerde unique çakışması olmaz
  images:    [{ type: String }],
  features:  [{ type: String }],
  specs:     { type: Map, of: String },
  badge:     { type: String, default: "" },
  badgeColor:{ type: String, default: "blue" },
  featured:  { type: Boolean, default: false },
  isActive:  { type: Boolean, default: true },
  seo: {
    title:       { type: String, default: "" },
    description: { type: String, default: "" },
  },
}, { timestamps: true })

productSchema.index({ name: "text", shortDesc: "text" })
productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ featured: -1, createdAt: -1 })

module.exports = mongoose.model("Product", productSchema)
