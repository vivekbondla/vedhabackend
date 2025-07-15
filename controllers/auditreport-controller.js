const ChecklistSubmission = require("../models/CheckListSubmissionModel");
const {calculatePercentages} = require("../utils/calculatePercentage")

// GET /api/report/summary?clientName=...&siteName=...&startDate=...&endDate=...
const getReportSummary =  async (req, res) => {
  try {
    const { clientName, siteName, startDate, endDate } = req.query;

    const query = {};
    if (clientName) query.clientName = clientName;
    if (siteName) query.siteName = siteName;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const submissions = await ChecklistSubmission.find(query);

    if (submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found." });
    }

    const summaries = submissions.map(sub => ({
      clientName: sub.clientName,
      siteName: sub.siteName,
      vendorName: sub.vendorName,
      siteLocation: sub.siteLocation,
      percentages: calculatePercentages(sub.checklistFiles),
      checklistFiles:sub.checklistFiles
    }));

    res.status(200).json({ count: summaries.length, summaries });
  } catch (err) {
    console.error("Report generation error:", err);
    res.status(500).json({ message: "Error generating report." });
  }
};

exports.getReportSummary = getReportSummary;
