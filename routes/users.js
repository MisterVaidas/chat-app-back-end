const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
    console.log("Incoming registration request:", req.body);
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Save the user to the database
    const newUser = new User({ username, password });
    try {
        const savedUser = await newUser.save();
        res.json({ id: savedUser._id, username: savedUser.username });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user.' });
    }
});

module.exports = router;