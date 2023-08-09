const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'email already exists' });
    }

    // Save the user to the database
    const newUser = new User({ email, password });
    const savedUser = await newUser.save();
    res.json({ id: savedUser._id, email: savedUser.email });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});

router.get('/users/registration-data', async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, email: 1 }); // You can specify the fields you want to retrieve
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving user registration data.' });
  }
});

module.exports = router;
