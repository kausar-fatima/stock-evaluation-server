// models/product.model.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  shopId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true }
});

// Add ID field
// productSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// productSchema.set('toJSON', {
//   virtuals: true
// });

const Expense = mongoose.model("expenses", expenseSchema);

module.exports = Expense;
