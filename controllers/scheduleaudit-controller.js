const Auditor = require("../models/AuditorModel");
const Vendor = require("../models/VendorModel");
const Client = require("../models/ClientModel");
const ScheduleAudit = require("../models/ScheduleAuditModel");
const {sendEmail} = require("../utils/emailService")

const createScheduleAudit = async (req, res) => {
  try {
    const { siteName, clientName, auditorName, auditType, auditScheduleType, startDate, endDate } = req.body;

    // 1. Save audit schedule
    const newAudit = new ScheduleAudit({
      siteName,
      clientName,
      auditorName,
      auditType,
      auditScheduleType,
      startDate,
      endDate
    });
    await newAudit.save();

    // 2. Fetch email addresses
    const clients = await Client.find({ clientName: { $in: clientName } });
    const vendors = await Vendor.find({ siteName }); // assuming vendors are linked via site
    const auditor = await Auditor.findOne({ name: auditorName });

    const clientEmails = clients.map(c => c.email);
    const vendorEmails = vendors.map(v => v.email);
    const auditorEmail = auditor?.email;

    const recipients = [...clientEmails, ...vendorEmails, auditorEmail].filter(Boolean);

    // 3. Send email
    const subject = `Audit Scheduled for ${siteName}`;
    const message = `
      An audit has been scheduled.
      Site: ${siteName}
      Audit Type: ${auditType}
      Schedule Type: ${auditScheduleType}
      Dates: ${startDate} to ${endDate}
    `;

    await sendEmail(recipients, subject, message);

    res.status(201).json({ message: "Audit scheduled and emails sent successfully." });
  } catch (error) {
    console.error("Error creating audit schedule:", error);
    res.status(500).json({ message: "Server error while scheduling audit." });
  }
};

exports.createScheduleAudit =createScheduleAudit
