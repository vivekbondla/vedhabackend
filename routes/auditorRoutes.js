const express = require("express");
const {getAllAuditors, createAuditor, updateAuditor, deleteAuditor} = require("../controllers/auditor-controller")

const router = express.Router();

router.get("/getAllAuditors", getAllAuditors);
router.post("/createAuditor", createAuditor);
router.put("/updateAuditor/:id", updateAuditor);
router.delete("/deleteAuditor/:id", deleteAuditor);


module.exports = router;