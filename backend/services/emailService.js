const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const sendOTPEmail = async (email, otpCode) => {
    try {
        const mailOptions = {
            from: '"CryptoEagle" <no-reply@cryptoeagle.com>',
            to: email,
            subject: 'Your OTP Code for CryptoEagle',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>CryptoEagle Authentication</h2>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #2196F3; margin: 0;">${otpCode}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr>
                    <p style="color: #666; font-size: 12px;">
                        CryptoEagle Team<br>
                        This is an automated message, please do not reply.
                    </p>
                </div>
            `
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