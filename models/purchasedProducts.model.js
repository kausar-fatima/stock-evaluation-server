// models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true }
});

// Add ID field
// productSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// productSchema.set('toJSON', {
//   virtuals: true
// });

const Product = mongoose.model("purchasedProduct", productSchema);

module.exports = Product;
