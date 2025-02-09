// models/saleoutProducts.model.js

const mongoose = require('mongoose');

const saleOutProductSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopsDetails',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

// Add ID field
saleOutProductSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

saleOutProductSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('SaleOutProducts', saleOutProductSchema);
