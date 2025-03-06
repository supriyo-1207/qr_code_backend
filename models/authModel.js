const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'], // Full name is required
        trim: true, // Remove extra spaces
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // Email is required
        unique: true, // Ensure email is unique
        trim: true,
        lowercase: true, // Convert email to lowercase
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Validate email format
    },
    password: {
        type: String,
        required: [true, 'Password is required'], // Password is required
        minlength: [6, 'Password must be at least 6 characters long'], // Minimum length
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // Skip if password is not modified
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;