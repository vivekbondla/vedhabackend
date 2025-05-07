const Auditor = require("../models/AuditorModel");
const Vendor = require("../models/VendorModel");
const Site = require("../models/SiteModel");
const Client = require("../models/ClientModel");
const ScheduleAudit = require("../models/ScheduleAuditModel");
const {sendEmail} = require("../utils/emailService");
const { getVendorEmailsBySiteName } = require("../utils/getVendorEmailsBySiteName");

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
    // const sites = await Site.find({ siteName }); // assuming vendors are linked via site
    const auditor = await Auditor.findOne({ auditorName });
    console.log({clients,auditor})

    const clientEmails = clients.map(c => c.clientEmail);
    const vendorEmails = await getVendorEmailsBySiteName(siteName)
    const auditorEmail = auditor?.auditorEmail;
    console.log({clientEmails,vendorEmails,auditorEmail})

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

const getAllScheduledAudits = async(req,res)=>{
   try {
          const scheduledAudits = await ScheduleAudit.find();
          res.status(200).json(scheduledAudits);
        } catch (error) {
          console.log("error:", error);
          res.status(500).json({ message: "Server error while getting scheduled audits..." });
        }

}

exports.createScheduleAudit = createScheduleAudit;
exports.getAllScheduledAudits = getAllScheduledAudits;
