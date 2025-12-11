const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otpCode) => {
    try {
        const mailOptions = {
            from: '"CryptoEagle" <no-reply@cryptoeagle.com>',
            to: email,
            subject: 'Your OTP Code for CryptoEagle',
            text: `This is your OTP code: ${otpCode} and it will expire in 10 minutes`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = { sendOTPEmail };