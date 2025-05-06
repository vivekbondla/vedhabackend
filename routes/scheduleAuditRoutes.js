const express = require("express");
const {createScheduleAudit} = require("../controllers/scheduleaudit-controller")

const router = express.Router();

router.post("/createAudit", createScheduleAudit);

module.exports = router;