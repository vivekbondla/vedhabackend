const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ChecklistSubmission = require("../models/CheckListSubmissionModel");

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
    // console.log(parsedNotApplicableList)

    const client = Array.isArray(clientName) ? clientName[0] : clientName;

    const existingSubmission = await ChecklistSubmission.findOne({
      siteName,
      vendorName,
      siteLocation,
      auditMonth,
      auditYear,
      clientName: client,
    });

    if (existingSubmission) {
      let updated = false;
      let blockedFiles = [];

      parsedChecklist.forEach((label, index) => {
        const file = parsedUploads.find((f) => f.fieldname === label);
        if (!file) return;

        const existingFile = existingSubmission.checklistFiles.find(
          (item) => item.label === label
        );
        const isNotApplicable = parsedNotApplicableList?.[label] === true;
        console.log("label:", label, "isNotApplicable:", isNotApplicable);

        if (existingFile) {
          if (existingFile.status === "Approved") {
            blockedFiles.push(label);
          } else {
            // Overwrite file info for Rejected or Pending
            existingFile.fileName = file.originalname;
            existingFile.filePath = file.path;
            existingFile.status = isNotApplicable
              ? "Not Applicable"
              : "Pending"; // reset status to pending
            existingFile.remarks = isNotApplicable
              ? "Marked as Not Applicable by Vendor"
              : "";
            updated = true;
          }
        } else {
          // New label being uploaded
          existingSubmission.checklistFiles.push({
            label,
            fileName: file.originalname,
            filePath: file.path,
            status: isNotApplicable ? "Not Applicable" : "Pending",
            remarks: isNotApplicable
              ? "Marked as Not Applicable by Vendor"
              : "",
          });
          updated = true;
        }
      });

      if (updated) {
        await existingSubmission.save();
      }

      const response = {
        message: updated
          ? "Checklist updated for existing site"
          : "No new or replaceable files uploaded",
        submission: existingSubmission,
      };

      if (blockedFiles.length > 0) {
        response.blocked = `Files for the following labels are already approved and cannot be replaced: ${blockedFiles.join(
          ", "
        )}`;
      }

      return res.status(updated ? 200 : 400).json(response);
    }

    // Create new submission if not existing
    // const checklistFiles = parsedChecklist.map((label, index) => {
    //   const file = parsedUploads.find(f => f.fieldname === label);
    //   return {
    //     label,
    //     fileName: file?.originalname || "",
    //     filePath: file?.path || "",
    //     status: "Pending",
    //     remarks: "",
    //   };
    // });
    const checklistFiles = parsedChecklist.map((label) => {
      const file = parsedUploads.find((f) => f.fieldname === label);
      const isNotApplicable = parsedNotApplicableList?.[label] === true;
      console.log("label:", label, "isNotApplicable:", isNotApplicable);

      return {
        label,
        fileName: file?.originalname || "",
        filePath: file?.path || "",
        status: isNotApplicable ? "Not Applicable" : "Pending",
        remarks: isNotApplicable ? "Marked as Not Applicable by Vendor" : "",
      };
    });

    // const now = new Date();
    // const auditMonth = now.getMonth() + 1;
    // const auditYear = now.getFullYear();

    const newSubmission = new ChecklistSubmission({
      siteName,
      vendorName,
      siteLocation,
      clientName: client,
      auditorName,
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
  // expect auditorName from frontend to get only those files
  console.log(req.user)
  const userRole = req.user.role;
  const userEmail = req.user.email;
  const query = userRole === "admin"?{}:{userEmail}
  if (userRole !== "auditor" && userRole !== "admin") {
    return res.status(403).json({ message: "Access denied for this role." });
  }
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
