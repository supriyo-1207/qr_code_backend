const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
const sendMail = require('../services/sendMail');
require('dotenv').config();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Common function to set HTTP-only cookie
const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true', // Use ENV variable for security settings
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// Sign-in (Login)
async function signin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = generateToken(user._id);
        setCookie(res, token);

        res.status(200).json({
            message: 'Login successful',
            user: { id: user._id, fullName: user.fullName, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Sign-up (Register)
async function signup(req, res) {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters long' });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ fullName, email: email.toLowerCase(), password });
        await user.save();

        try {
            await sendMail(
    email,
    "Welcome to QR Code Generator!",
    `Hello ${fullName}, Welcome to QR Code Generator.`,
    `<p>Hi <b>${fullName}</b>,</p>
    <p>Welcome to <b>QR Code Generator</b>! 🚀 You now have unlimited access to generate QR codes for your business, personal use, and more.</p>
    <p>Here’s what you can do:</p>
    <ul>
      <li>✔️ Generate unlimited QR codes</li>
      <li>✔️ Customize your QR designs</li>
    </ul>
    <p>Start generating now: <a href="https://qr-code-generator-eight-henna.vercel.app" target="_blank">Generate QR Code</a></p>
    <p>Happy scanning!<br>
    <b>Best regards,</b><br>
    <b>Supriyo Maity</b></p>`
);

        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        const token = generateToken(user._id);
        setCookie(res, token);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, fullName: user.fullName, email: user.email },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Logout (Clears Cookie)
async function logout(req, res) {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logout successful' });
}

module.exports = { signin, signup, logout };
