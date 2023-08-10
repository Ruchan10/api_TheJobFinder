const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// Provide a secret key
const secretKey = "mySecretKey";
const cvsFolderPath = path.join(__dirname, "uploads", "cvs");

// Signup a new user
// Signup a new user
async function signup(req, res) {
  console.log("INSIDE SIGNUP");
  const { email, password } = req.body;

  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    return res.status(409).send({ message: "Email already exists" });
  }
  if (password.length < 6) {
    console.log("in here pw short");
    return res
      .status(409)
      .send({ message: "Password must be atleast 6 character long" });
  }
  try {
    // Validate inputs
    if (!password || !email) {
      return res.status(409).send({ message: "Fields cannot be left empty" });
    }

    // Check if the email is already taken

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
      return res.status(401).json({ error: "Fields cannot be left empty" });
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

    // Create and sign a JWT token with 30 days expiration
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "30d", // 30 days expiration
    });

    // Set the token as a cookie in the response
    res.cookie("token", token, { httpOnly: true });

    res.json({ success: true, message: "Login successful", token, user });
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getUserDetails(req, res) {
  try {
    const userId = req.params.id;
    // Find the user by the provided ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
async function getImage(req, res) {
  try {
    const imageName = req.params.imageName;

    // Construct the path to the images folder inside the current working directory
    const logosFolderPath = path.join(__dirname, "uploads", "logos");
    const imagesFolderPath = path.join(__dirname, "uploads", "userData");

    const logoImagePath = path.join(logosFolderPath, imageName);
    const generalImagePath = path.join(imagesFolderPath, imageName);

    // Check if the image exists in "uploads/logos"
    if (fs.existsSync(logoImagePath)) {
      // Send the image file as a response
      res.sendFile(logoImagePath);
    }
    // Check if the image exists in "uploads"
    else if (fs.existsSync(generalImagePath)) {
      // Send the image file as a response
      res.sendFile(generalImagePath);
    } else {
      // If the image does not exist, return a 404 error
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getCv(req, res) {
  console.log("in get CV");
  try {
    const fileName = req.params.fileName;
    const filePath = path.resolve(cvsFolderPath, fileName);
    console.log(filePath);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Check if the file has the .pdf extension
      if (path.extname(filePath) === ".pdf") {
        // Send the file as a response
        res.sendFile(filePath);
      } else {
        // If the file does not have the .pdf extension, return a 400 Bad Request error
        res
          .status(400)
          .json({ error: "Invalid file format. Only .pdf files are allowed." });
      }
    } else {
      // If the file does not exist, return a 404 error
      res.status(404).json({ error: "File not found" });
    }
  } catch (e) {
    console.error(e);
  }
}
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword, reenterNewPassword } = req.body;
    const userId = req.user._id;

    // Validate input data
    if (!currentPassword || !newPassword || !reenterNewPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== reenterNewPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the one stored in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user data
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// Controller function to delete a user
async function deleteUser(req, res) {
    try {
      const userId = req.params.userId;
  
      // Delete the user from the database
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
module.exports = {
  signup,
  login,
  getUserDetails,
  getImage,
  getCv,
  changePassword,
  deleteUser
};
