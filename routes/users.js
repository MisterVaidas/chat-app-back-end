const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    const newUser = new User({ username, password });
    newUser.save()
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        res.status(500).json({ error: 'Error registering user.' });
    });
});

module.exports = router;