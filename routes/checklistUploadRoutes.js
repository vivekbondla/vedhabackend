const express = require("express");
const upload = require("../middleware/upload");
const {verifyToken} = require("../controllers/auth-controller")
const {uploadDocuments,getSubmissions,reviewChecklist} = require("../controllers/checklist-controller");

const router = express.Router();

router.post("/submit-checklist", upload.any(), uploadDocuments);
router.get("/submissions",verifyToken, getSubmissions);
router.post("/review-checklist",reviewChecklist)

module.exports = router;