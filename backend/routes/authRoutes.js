const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const { authenticate, authorize } = require('../middlewares/auth');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            password,
            name,
            role: email === 'admin@cryptoeagle.com' ? 'admin' : 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const otpCode = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = {
            code: otpCode,
            expiresAt: otpExpires
        };
        await user.save();

        const emailSent = await sendOTPEmail(email, otpCode);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.json({
            message: 'OTP sent to your email',
            userId: user._id,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.otp || !user.otp.code) {
            return res.status(400).json({ message: 'No OTP requested' });
        }

        if (user.otp.expiresAt < new Date()) {
            user.otp = undefined;
            await user.save();
            return res.status(400).json({ message: 'OTP has expired' });
        }

        if (user.otp.code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.otp = undefined;
        user.isVerified = true;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password -otp');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/logout', authenticate, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

router.get('/admin-stats', authenticate, authorize('admin'), async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({
            message: 'Admin statistics',
            userCount,
            serverTime: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;