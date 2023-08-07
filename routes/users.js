const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user to the database
    const newUser = new User({ username, password: hashedPassword });
    try {
        const savedUser = await newUser.save();
        res.json({ id: savedUser._id, username: savedUser.username });
    } catch (err) {
        res.status(500).json({ error: 'Error registering user.' });
    }
});

module.exports = router;