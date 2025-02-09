// hashingUtils.js
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const hashPassword = async (plainTextPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};

module.exports = { hashPassword };
