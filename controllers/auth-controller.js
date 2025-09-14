const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();

    // Send email
    const resetLink = `https://vedahr.netlify.app/resetPassword/${resetToken}`;
    await sendResetEmail(email, resetLink);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset link." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password." });
  }
};

// Helper function to send email
async function sendResetEmail(to, link) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or SES if using AWS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Veda HR App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset",
    html: `<p>You requested a password reset.</p>
           <p><a href="${link}">Click here to reset your password</a></p>`,
  });
}

exports.verifyToken = verifyToken;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
