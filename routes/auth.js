const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // Find user by the username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'User not found.' });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password Match:', validPassword);

    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid password.' });
}

    //User is valid, generate a JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Send the token back to the client
    res.json({ seccess: true, token: token });
});

module.exports = router;