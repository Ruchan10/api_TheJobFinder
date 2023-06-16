const User = require('../models/userModel');

// Get user details
async function getUserDetails(req, res) {
  try {
    // Get the authenticated user's ID from the req.user object
    const userId = req.user._id;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in usersController' });
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
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if the authenticated user is the owner of the account
    if (userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Update the user information
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user details
    res.json({ message: 'User Updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in updateUser Function' });
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
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the authenticated user is the owner of the account
    if (userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Delete the user from the database
    await user.remove();

    // Return a success message
    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error in deleteUser function' });
  }
}

module.exports = {
  getUserDetails,
  updateUser,
  deleteUser,
};
