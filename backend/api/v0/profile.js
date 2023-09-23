const User = require("../../models/user");
const bcrypt = require("bcrypt");

// get details of the profile
const getProfile = async (req, res) => {
  // The authenticated user's information is available in req.user
  const user = req.user;

  // Send the user's profile information in the response
  res.json({ user });
};
//update details of profie
const updateProfile = async (req, res) => {
  const userId = req.user._id; // Get the user's ID from the JWT token
  const { name, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile details
    if (name) {
      user.name = name;
    }

    if (newPassword) {
      // Hash and update the new password (similar to how it's done during signup)
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
