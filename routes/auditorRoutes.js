const express = require("express");
const {getAllAuditors, createAuditor, updateAuditor, deleteAuditor} = require("../controllers/auditor-controller");
const { verifyToken } = require("../controllers/auth-controller");

const router = express.Router();

router.get("/getAllAuditors",verifyToken, getAllAuditors);
router.post("/createAuditor", createAuditor);
router.put("/updateAuditor/:id", updateAuditor);
router.delete("/deleteAuditor/:id", deleteAuditor);


module.exports = router;