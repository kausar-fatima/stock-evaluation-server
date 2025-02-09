const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    otpExpiry: Date,
    shop_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopsDetails'
    }]
});

userSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id; // Rename _id to id
        delete ret._id;
        //delete ret.__v; // Optionally remove versioning
    }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
