const mongoose = require("mongoose");

const scheduleAuditSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  clientName: [{ type: String, required: true }],
  auditorName: { type: String, required: true },
  auditType: { type: String, required: true },
  auditScheduleType: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true });

module.exports  = mongoose.model('ScheduleAudit', scheduleAuditSchema);

