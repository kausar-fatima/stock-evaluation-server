const cron = require('node-cron');
const User = require('../models/user.model'); // Adjust the path as necessary

// Schedule a task to run every minute
cron.schedule('* * * * *', async () => {
    try {
        // Find and delete users with expired OTP
        const expiredUsers = await User.find({ otpExpiry: { $lt: Date.now() } });
        for (let user of expiredUsers) {
            // Perform any cleanup tasks here if needed
            await user.remove();
            console.log(`Deleted user ${user.email} due to expired OTP`);
        }
    } catch (error) {
        console.error("Error cleaning up users:", error);
    }
});

console.log('Cleanup cron job scheduled.');
