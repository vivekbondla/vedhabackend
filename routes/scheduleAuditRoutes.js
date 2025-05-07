const express = require("express");
const {createScheduleAudit,getAllScheduledAudits} = require("../controllers/scheduleaudit-controller")

const router = express.Router();

router.post("/createAudit", createScheduleAudit);
router.get("/getAllScheduledAudits",getAllScheduledAudits );

module.exports = router;