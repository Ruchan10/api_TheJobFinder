const User = require("../models/userModel");
const multer = require("multer");
const express = require("express");

// Get user details
async function getUserDetails(req, res) {
  try {
    // Get the authenticated user's ID from the req.user object
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error in usersController" });
  }
}

// Update user information
async function updateUser(req, res) {
  try {
    // Get the authenticated user's ID from the req.user object
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Check if the authenticated user is the owner of the account
    if (userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Update the user information
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.fullName = req.body.fullName;
    user.phoneNumber = req.body.phoneNumber;
    user.cv = req.body.cv;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user details
    res.json({ message: "User Updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error in updateUser Function" });
  }
}

// Delete user account
async function deleteUser(req, res) {
  try {
    // Get the authenticated user's ID from the req.user object
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the authenticated user is the owner of the account
    if (userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Delete the user from the database
    await user.remove();

    // Return a success message
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error in deleteUser function" });
  }
}

async function getUserByEmail(req, res) {
  try {
    const email = req.params.email;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}





async function editProfile(req, res) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }
    // Get the updated profile information from the request body
    const { phoneNumber, fullName, email } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile information
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    user.email = email;
    // Check if a file was uploaded
    if (req.file) {
      user.cv = req.file.path; // Save the file path to the user's cv field
    }
    // Save the updated user profile
    const updatedUser = await user.save();

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error in editProfile function" });
  }
}

module.exports = {
  getUserDetails,
  updateUser,
  deleteUser,
  getUserByEmail,
  editProfile,
};
