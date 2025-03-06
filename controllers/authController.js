const User = require('../models/authModel');

// signin 
async function signin(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the entered password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// signup
async function signup(req, res) {
    const { fullName, email, password } = req.body;
    console.log(req.body);
  
    // check if all fields are provided or not
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }


    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {

            return res.status(400).json({ message: 'User already exists' });
        }
        console.log("existingUser", existingUser);
        // Create a new user
        const user = new User({ fullName, email, password });
        await user.save(); // Save the user to the database

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { signin, signup };