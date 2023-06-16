const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Provide a secret key
const secretKey = 'mySecretKey';

// Signup a new user
async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // Validate inputs
    if (!username || !password || !name || !email) {
      return res.status(400).json({ error: 'Fields cannot be left empty' });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      name,
      password: hashedPassword,
    });

    // Save the user to the database
    const createdUser = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: createdUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Login a user
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Validate inputs
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey);

    // Set the token as a cookie in the response
    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signup,
  login,
};
