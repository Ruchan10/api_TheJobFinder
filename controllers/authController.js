const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Provide a secret key
const secretKey = "mySecretKey";

// Signup a new user
// Signup a new user
async function signup(req, res) {
  console.log("INSIDE SIGNUP");
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!password || !email) {
      return res.status(400).send({ message: "Fields cannot be left empty" });
    }

    // Check if the email is already taken
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(409).send({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const createdUser = await newUser.save();

    res
      .status(201)
      .send({ message: "User created successfully", user: createdUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

// Login a user
async function login(req, res) {
  console.log("INSDIE LOGIN");
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, secretKey);

    // Set the token as a cookie in the response
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  signup,
  login,
};
