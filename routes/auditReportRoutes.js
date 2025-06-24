const express = require("express");
const router = express.Router();
const { getReportSummary } = require("../controllers/auditreport-controller");

router.get("/summary", getReportSummary);

module.exports = router;
