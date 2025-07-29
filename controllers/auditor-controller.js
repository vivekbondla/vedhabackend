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
      userName:req.body.auditorName,
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
const updateAuditor = async (req, res) => {
  const auditorId = req.params.id;
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
    const updatedAuditor = await Auditor.findByIdAndUpdate(
      auditorId,
      {
        auditorCity,
        auditorCode,
        auditorEmail,
        auditorName,
        auditorPhone,
        auditorPincode,
        auditorStateLoc,
      },
      { new: true }
    );

    // Also update corresponding user
    await User.findOneAndUpdate(
      { refId: auditorId, role: "auditor" },
      {
        email: auditorEmail,
        userName: auditorName,
      }
    );

    res.status(200).json({ message: "Auditor updated successfully", updatedAuditor });
  } catch (error) {
    console.error("Error updating Auditor:", error);
    res.status(500).json({ message: "Server error while updating auditor" });
  }
};

const deleteAuditor = async (req, res) => {
  const auditorId = req.params.id;

  try {
    await Auditor.findByIdAndDelete(auditorId);

    // Also delete corresponding user
    await User.findOneAndDelete({ refId: auditorId, role: "auditor" });

    res.status(200).json({ message: "Auditor and user deleted successfully" });
  } catch (error) {
    console.error("Error deleting Auditor:", error);
    res.status(500).json({ message: "Server error while deleting auditor" });
  }
};

exports.updateAuditor = updateAuditor;
exports.deleteAuditor = deleteAuditor;
exports.getAllAuditors = getAllAuditors;
exports.createAuditor = createAuditor;
