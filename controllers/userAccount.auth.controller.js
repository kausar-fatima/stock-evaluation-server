const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Path to the User model
const emailService = require("../services/email-service");
const { hashPassword } = require("../services/password-hashing");

//const router = express.Router();

// Register a new user
exports.addUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await hashPassword(req.body.password);
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            shop_ids: []
        });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(400).json({
            status: "error",
            message: "Failed to add user",
            error: error.message
        });
    }
};


// Login a user
exports.login =  async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        console.log("-----"+user+"------");
        
        bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
                res.status(500).json({ message: "Internal server error", error: err });
            } else if (result) {
            res.status(200).json({ message: "Logged in successfully", userId: user._id});
            } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    });

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //     return res.status(400).json({ status: "error", message: "Incorrect password" });
        // }
         console.log("------"+password+"-------"+user.password+"-------");
        // Optional: Generate a JWT token
        //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30s' });

        //res.status(200).json({ message: "Logged in successfully", user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user's password
exports.forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        user.password = await hashPassword(newPassword);
        await user.save();
        res.status(200).json({message: "updated password successfully",user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a shop to the user's shops array
// router.post('/:userId/add-shop', async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { shopId } = req.body;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         user.shop_ids.push(shopId);
//         await user.save();
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Generate OTP
exports.generateOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = crypto.randomInt(1000, 9999).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        await user.save();
        await emailService.sendEmail(email, otp);

        // Here you would typically send the OTP via email/SMS to the user
        res.status(200).json({ message: "OTP generated" ,otp: otp});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpiry: { $gte: Date.now() } });
        if (!user) {
            throw new Error("Invalid or expired OTP");
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        res.status(200).json({ message: "OTP verified", user });
    } catch (error) {
        console.log("Error occured");
        res.status(500).json({ error: error.message });
    }
};

// module.exports = router;
