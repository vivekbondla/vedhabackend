const express = require("express");
const {getAllAuditors} = require("../controllers/auditor-controller")

const router = express.Router();

router.get("/getAllAuditors", getAllAuditors);

module.exports = router;