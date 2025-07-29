const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "user does not exist..." });

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch)
      return res.status(401).json({ message: "Invalid credentials..." });

    const modelMap = {
      Auditor: require("../models/AuditorModel"),
      Vendor: require("../models/VendorModel"),
      Client: require("../models/ClientModel"),
    };

    const RefModel = modelMap[user.refModel];
    let fullProfile = null;
    let username = null;

    if (RefModel && user.refId) {
      fullProfile = await RefModel.findById(user.refId);
      username =
        fullProfile?.auditorName ||
        fullProfile?.vendorsName ||
        fullProfile?.clientName ||
        null;
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        username: username || user.email,
        role: user.role,
        email: user.email,
        refId: user.refId, // This is the Vendor/Auditor ID
        refModel: user.refModel,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error for login" });
  }
};
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

exports.verifyToken = verifyToken;

exports.login = login;
