const User = require("../models/userModel");
const multer = require("multer");
const express = require("express");

// Get user details
async function getUserDetails(req, res) {
  console.log("in userDetails");
  try {
    // Get the authenticated user's ID from the req.user object
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user details
    console.log(user.profile);
    res.json({ data: user, profile: user.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error in usersController" });
  }
  console.log("OUT userDetails");
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
  console.log("IN the editProfile Function");
  console.log(req.files);
  try {
    // const profile = req.file ? req.file.path : null;

    // console.log(profile);
    // console.log(req.file);
    // Check if the profile image and cv files were uploaded
    if (!req.files || !req.files.profile || !req.files.cv) {
      return res
        .status(400)
        .json({ message: "Both profile and cv files are required." });
    }

    // Get the updated profile information from the request body
    const { phoneNumber, fullName } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's profile information
    user.phoneNumber = phoneNumber;
    user.fullName = fullName;
    // user.email = email;
    // Save the file paths to the user's cv and profile fields
    user.cv = req.files.cv[0].path;
    user.profile = req.files.profile[0].path;
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
// Function to change the email of the logged-in user
async function changeEmail(req, res) {
  const { email, confirmEmail } = req.body;
  // Check if the email and confirmEmail match
  if (email !== confirmEmail) {
    return res.status(400).json({ error: "Emails do not match" });
  }
  // Check if the new email is already in use by another user
  const existingEmail = await User.findByEmail(email);
  if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
    return res.status(409).json({ error: "Email already in use" });
  }
  try {
    // Get the logged-in user's ID from req.user
    const userId = req.user._id;

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the email of the user
    user.email = email;
    await user.save();

    res.json({ success: true, message: "Email changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getUserDetails,
  updateUser,
  deleteUser,
  getUserByEmail,
  editProfile,
  changeEmail,
};
