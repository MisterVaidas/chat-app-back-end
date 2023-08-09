const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Change 'email' to 'username'

    // Input validation
    if (!username || !password) {
        console.log('Username and password are required.');
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find user by the username
    const user = await User.findOne({ username }); // Change 'email' to 'username'
    if (!user) {
        console.log("User not found.")
        return res.status(400).json({ error: 'User not found.' });
    }

    // Check if password is correct
    console.log("Password Match:");
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        console.log("Invalid Password")
        return res.status(400).json({ error: 'Invalid password.' });
    }

    // User is valid, generate a JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username }, // Change 'email' to 'username'
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Send the token back to the client
    res.json({ success: true, token: token });
});

module.exports = router;
