const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ChecklistSubmission = require("../models/CheckListSubmissionModel");
const Auditor = require("../models/AuditorModel");
const Vendor = require("../models/VendorModel");

const uploadDocuments = async (req, res) => {
  try {
    const {
      siteName,
      vendorName,
      siteLocation,
      clientName,
      auditorName,
      checklist,
      auditMonth,
      auditYear,
      notApplicableList,
    } = req.body;

    const parsedChecklist = JSON.parse(checklist);
    const parsedUploads = req.files || [];
    const parsedNotApplicableList = JSON.parse(notApplicableList);

    const client = Array.isArray(clientName) ? clientName[0] : clientName;

    const existingSubmission = await ChecklistSubmission.findOne({
      siteName,
      vendorName,
      siteLocation,
      auditMonth,
      auditYear,
      clientName: client,
    });

    const mapFile = (label) => {
      const file = parsedUploads.find((f) => f.fieldname === label);
      const isNotApplicable = parsedNotApplicableList?.[label] === true;

      return {
        label,
        fileName: file?.originalname || "",
        filePath: file?.key || "", // S3 key (e.g. checklist/123_file.pdf)
        fileUrl: file?.location || "", // full S3 URL
        status: isNotApplicable ? "Not Applicable" : "Pending",
        remarks: isNotApplicable
          ? "Marked as Not Applicable by Vendor"
          : "",
      };
    };

    if (existingSubmission) {
      let updated = false;
      let blockedFiles = [];

      parsedChecklist.forEach((label) => {
        const file = parsedUploads.find((f) => f.fieldname === label);
        if (!file) return;

        const existingFile = existingSubmission.checklistFiles.find(
          (item) => item.label === label
        );
        const isNotApplicable = parsedNotApplicableList?.[label] === true;

        if (existingFile) {
          if (existingFile.status === "Approved") {
            blockedFiles.push(label);
          } else {
            existingFile.fileName = file.originalname;
            existingFile.filePath = file.key;
            existingFile.fileUrl = file.location;
            existingFile.status = isNotApplicable ? "Not Applicable" : "Pending";
            existingFile.remarks = isNotApplicable
              ? "Marked as Not Applicable by Vendor"
              : "";
            updated = true;
          }
        } else {
          existingSubmission.checklistFiles.push(mapFile(label));
          updated = true;
        }
      });

      if (updated) await existingSubmission.save();

      return res.json({
        message: updated
          ? "Checklist updated for existing site"
          : "No new or replaceable files uploaded",
        submission: existingSubmission,
        blocked:
          blockedFiles.length > 0
            ? `Files for the following labels are already approved: ${blockedFiles.join(
                ", "
              )}`
            : undefined,
      });
    }

    // New submission
    const checklistFiles = parsedChecklist.map(mapFile);

    const auditor = await Auditor.findOne({ auditorName });
    const auditorEmail = auditor?.auditorEmail;
    const vendor = await Vendor.findOne({vendorsName: vendorName});
    const vendorEmail = vendor?.vendorEmail;

    const newSubmission = new ChecklistSubmission({
      siteName,
      vendorName,
      vendorEmail,
      siteLocation,
      clientName: client,
      auditorName,
      auditorEmail,
      checklistFiles,
      auditMonth,
      auditYear,
    });

    await newSubmission.save();

    res.status(200).json({
      message: "Checklist saved successfully",
      submission: newSubmission,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload checklist" });
  }
};

const getSubmissions = async (req, res) => {
  //Need to send the list of files of the auditor that logins need,
    const { role, email, username } = req.user; // depends on what you store in JWT
    
    let query = {};

  if (role === "auditor") {
    query = { auditorEmail: email}; // match based on JWT payload
  } else if (role === "vendor") {
    query = { vendorEmail: email};
  } else if (role === "admin") {
    query = {}; // all submissions
  } else {
    return res.status(403).json({ message: "Access denied for this role." });
  }
  console.log("Query",query);
  
  try {
    const submissions = await ChecklistSubmission.find(query);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

const reviewChecklist = async (req, res) => {
  try {
    const { submissionId, updates } = req.body;

    const submission = await ChecklistSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    updates.forEach(({ index, status, remarks }) => {
      const file = submission.checklistFiles[index];
      if (file && file.status === "Pending") {
        file.status = status;
        file.remarks = remarks;
      }
    });

    await submission.save();

    res
      .status(200)
      .json({ message: "Checklist updated successfully", submission });
  } catch (error) {
    console.error("Bulk review error:", error);
    res.status(500).json({ message: "Failed to review checklist" });
  }
};

exports.uploadDocuments = uploadDocuments;
exports.getSubmissions = getSubmissions;
exports.reviewChecklist = reviewChecklist;
