const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "laibaejaz9797@gmail.com",
        pass: "iymk upgp jfsk omhq"
    }
});

exports.sendEmail = (email, otp) => {
    const mailOptions = {
        from: "laibaejaz9797@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for verification is: ${otp}`
    };

    return transporter.sendMail(mailOptions);
};
