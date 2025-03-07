const jwt = require('jsonwebtoken');
const User = require('../models/authModel');
require('dotenv').config();

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Sign-in (Login)
async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Store token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

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

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ fullName, email, password });
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        // Store token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

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
