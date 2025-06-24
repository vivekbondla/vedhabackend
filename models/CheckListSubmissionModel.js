const mongoose = require("mongoose");

const ChecklistFileSchema = new mongoose.Schema({
  index: Number,
  label: String,
  fileName: String, // Original file name
  filePath: String, // Local path on server
  status:{type:String,enum: ["Pending", "Approved", "Rejected", "Not Applicable"], default: "Pending"},
  remarks: { type: String, default: "" },
});

const ChecklistSubmissionSchema = new mongoose.Schema({
  siteName: String,
  vendorName: String,
  siteLocation: String,
  clientName: String,
  auditorName: String,
  checklistFiles: [ChecklistFileSchema],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChecklistSubmission", ChecklistSubmissionSchema);