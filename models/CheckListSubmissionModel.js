// models/ChecklistSubmission.js

const mongoose = require("mongoose");

const ChecklistFileSchema = new mongoose.Schema({
  index: Number,
  label: String,
  fileName: String, // Original file name
  filePath: String, // Local path on server
  // reviewed: { type: Boolean, default: false },
  status:{type:String, default: "Pending"},
  remarks: { type: String, default: "" },
});

const ChecklistSubmissionSchema = new mongoose.Schema({
  siteName: String,
  siteLocation: String,
  clientName: String,
  checklistFiles: [ChecklistFileSchema],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChecklistSubmission", ChecklistSubmissionSchema);
