const Auditor = require("../models/AuditorModel");
const User = require("../models/UserModel");

const createAuditor = async (req, res) => {
  const {
    auditorCity,
    auditorCode,
    auditorEmail,
    auditorName,
    auditorPhone,
    auditorPincode,
    auditorStateLoc,
  } = req.body;

  try {
    const newAuditor = new Auditor({
      auditorCity,
      auditorCode,
      auditorEmail,
      auditorName,
      auditorPhone,
      auditorPincode,
      auditorStateLoc,
    });
    const savedAuditor = await newAuditor.save();
    const user = User.create({
      email: req.body.auditorEmail,
      password: req.body.password,
      role: "auditor",
      refId: savedAuditor._id,
      refModel: "Auditor",
    });
    res
      .status(201)
      .json({
        message: "Auditor and user created successfully!",
        savedAuditor,
        user,
      });
  } catch (error) {
    console.error("Error creating Auditor:", error);
    res.status(500).json({ message: "Server error while creating auditor" });
  }
};
const getAllAuditors = async (req, res) => {
  try {
    const auditors = await Auditor.find();
    res.status(200).json(auditors);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllAuditors = getAllAuditors;
exports.createAuditor = createAuditor;
