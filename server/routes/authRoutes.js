const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Register
router.post('/register', async (req, res) => {
  try {
    let { username, password, firstName, lastName, email } = req.body;
    email = email.trim();
  username = username.trim();
  password = password.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();

//To check if email, username, and password are provided
if (!email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Email, username, and password are required" });
  }
  //checking the email entries
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

 // Check if email already exists
 let user = await User.findOne({ email });
 if (user) {
   return res.status(400).json({ error: "Email already exists" });
 }

 // Check if username already exists
 user = await User.findOne({ username });
 if (user) {
   return res.status(400).json({ error: "Username already exists" });
 }
  const hashedPassword = await bcrypt.hash(password, 10);
     user = new User({ username, firstName, lastName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    username = username.trim();
  password = password.trim();

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
