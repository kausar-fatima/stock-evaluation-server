const mongoose = require("mongoose");

const shopDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
    },
    location: {
        type: String,
    },
    purchasedProducts: {
        type: Number,
        default: 0.0
    },
    saleOutProducts: {
        type: Number,
        default: 0.0
    },
    revenue: {
        type: Number,
        default: 0.0
    },
    profit: {
        type: Number,
        default: 0.0
    },
    loss: {
        type: Number,
        default: 0.0
    },
    expenses: {
        type: Number,
        default: 0.0
    }
});

// Add ID field
  shopDetailsSchema.virtual('id').get(function () {
    return this._id.toHexString();
  });
  
  shopDetailsSchema.set('toJSON', {
    virtuals: true
  });
  

const ShopDetails = mongoose.model("ShopsDetails", shopDetailsSchema);

module.exports = ShopDetails;
