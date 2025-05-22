const User = require("../models/UserModel");

const createAdminUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newAdminUser = new User({
      username,
      email,
      password,
      role: "admin",
    });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ message: "User already exists..." });
    const savedAdminUser = await newAdminUser.save();
    res.status(201).json({ savedAdminUser });
  } catch (error) {
    res.status(500).json({message:"Error creating a user..."})
  }
};

exports.createAdminUser = createAdminUser;
