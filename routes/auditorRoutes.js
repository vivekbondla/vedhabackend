const express = require("express");
const {getAllAuditors, createAuditor} = require("../controllers/auditor-controller")

const router = express.Router();

router.get("/getAllAuditors", getAllAuditors);
router.post("/createAuditor", createAuditor);


module.exports = router;