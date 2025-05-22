const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "vendor", "client", "auditor"],
    required: true
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "refModel"
  },
  refModel: {
    type: String,
    enum: ["Vendor", "Client", "Auditor"]
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verification method
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);