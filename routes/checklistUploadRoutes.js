const express = require("express");
const upload = require("../middleware/upload");
const {uploadDocuments,getSubmissions,reviewChecklist} = require("../controllers/checklist-controller");

const router = express.Router();

router.post("/submit-checklist", upload.any(), uploadDocuments);
router.get("/submissions", getSubmissions);
router.post("/review-checklist",reviewChecklist)

module.exports = router;