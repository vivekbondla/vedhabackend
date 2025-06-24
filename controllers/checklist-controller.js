const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const ChecklistSubmission = require("../models/CheckListSubmissionModel");

// const uploadDocuments = async (req, res) => {
//   try {
//     const { siteName, siteLocation, clientName, checklist, checklistUploads } =
//       req.body;

//     const parsedChecklist = JSON.parse(checklist); // array
//     const parsedUploads = req.files || [];

//     const checklistFiles = parsedChecklist.map((label, index) => {
//       const file = parsedUploads.find((f) => f.fieldname === `file${index}`);
//       return {
//         index,
//         label,
//         fileName: file?.originalname || "",
//         filePath: file?.path || "",
//       };
//     });

//     const submission = new ChecklistSubmission({
//       siteName,
//       siteLocation,
//       clientName: Array.isArray(clientName) ? clientName[0] : clientName,
//       checklistFiles,
//     });

//     await submission.save();
//     res.status(200).json({ message: "Checklist saved", submission });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to save checklist" });
//   }
// };
const uploadDocuments = async (req, res) => {
  try {
    const { siteName, vendorName, siteLocation, clientName, auditorName, checklist } = req.body;
    const parsedChecklist = JSON.parse(checklist);
    const parsedUploads = req.files || [];

    const client = Array.isArray(clientName) ? clientName[0] : clientName;

    const existingSubmission = await ChecklistSubmission.findOne({
      siteName,
      vendorName,
      siteLocation,
      clientName: client,
    });

    if (existingSubmission) {
      let updated = false;
      let blockedFiles = [];

      parsedChecklist.forEach((label, index) => {
        const file = parsedUploads.find(f => f.fieldname === label);
        if (!file) return;

        const existingFile = existingSubmission.checklistFiles.find(
          item => item.label === label
        );

        if (existingFile) {
          if (existingFile.status === "Approved") {
            blockedFiles.push(label);
          } else {
            // Overwrite file info for Rejected or Pending
            existingFile.fileName = file.originalname;
            existingFile.filePath = file.path;
            existingFile.status = "Pending"; // reset status to pending
            existingFile.remarks = "";
            updated = true;
          }
        } else {
          // New label being uploaded
          existingSubmission.checklistFiles.push({
            label,
            fileName: file.originalname,
            filePath: file.path,
            status: "Pending",
            remarks: "",
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
    const checklistFiles = parsedChecklist.map((label, index) => {
      const file = parsedUploads.find(f => f.fieldname === label);
      return {
        label,
        fileName: file?.originalname || "",
        filePath: file?.path || "",
        status: "Pending",
        remarks: "",
      };
    });

    const newSubmission = new ChecklistSubmission({
      siteName,
      vendorName,
      siteLocation,
      clientName: client,
      auditorName,
      checklistFiles,
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
  try {
    const submissions = await ChecklistSubmission.find({});
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

// const reviewChecklist = async (req, res) => {
//   console.log(req.body);
//   const { submissionId, fileIndex, status, remarks } = req.body;
//   const checklistSubmission = await ChecklistSubmission.findById(submissionId);
//   if (!checklistSubmission)
//     return res.status(404).json({ message: "Not found" });

//   checklistSubmission.checklistFiles[fileIndex].status = status;
//   checklistSubmission.checklistFiles[fileIndex].remarks = remarks;
//   await checklistSubmission.save();

//   res.status(200).json({ message: "Reviewed successfully" });
// };
// POST /api/upload/review-checklist
// Accepts: { submissionId, updates: [ { index, status, remarks } ] }

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

    res.status(200).json({ message: "Checklist updated successfully", submission });
  } catch (error) {
    console.error("Bulk review error:", error);
    res.status(500).json({ message: "Failed to review checklist" });
  }
};


exports.uploadDocuments = uploadDocuments;
exports.getSubmissions = getSubmissions;
exports.reviewChecklist = reviewChecklist;
