const Site = require("../models/SiteModel");
const Vendor = require("../models/VendorModel");
const Client = require("../models/ClientModel");
const ScheduleAudit = require("../models/ScheduleAuditModel");

const createSite = async (req, res) => {
  try {
    const {
      siteName,
      siteCode,
      siteAddress,
      siteCity,
      siteStateLoc,
      vendors, // array of vendorName strings
      clients, // array of clientName strings
      checklist,
    } = req.body;

    // 1. Get Vendor ObjectIds based on vendorName
    const vendorDocs = await Vendor.find({ vendorsName: { $in: vendors } });
    const vendorIds = vendorDocs.map((v) => v._id);

    // 2. Get Client ObjectIds based on clientName
    const clientDocs = await Client.find({ clientName: { $in: clients } });
    const clientIds = clientDocs.map((c) => c._id);

    // 3. Create and save the site
    const newSite = new Site({
      siteName,
      siteCode,
      siteAddress,
      siteCity,
      siteStateLoc,
      vendors: vendorIds,
      clients: clientIds,
      checklist,
    });

    const savedSite = await newSite.save();
    res.status(201).json(savedSite);
  } catch (error) {
    console.error("Error creating site:", error);
    res.status(500).json({ message: "Server error while creating site" });
  }
};

const getAllSites = async (req, res) => {
  const { role, email, username } = req.user;
  let query = {};
  let sites = [];
  try {
    if (role === "auditor") {
      // query.auditor = req.user.refId;; // match based on JWT payload
       const audits = await ScheduleAudit.find({ auditorName: req.user.email }); 
      // OR use auditorName if it’s stored as name instead of email

      const siteNames = audits.map(audit => audit.siteName);
      sites = await Site.find({ siteName: { $in: siteNames } })
        .populate("vendors clients");
    } else if (role === "vendor") {
      query.vendors = req.user.refId;
      sites = await Site.find(query)
      .populate("vendors")
      .populate("clients");
    } else if(role === "client"){
      query.clients = req.user.refId;
      sites = await Site.find(query)
      .populate("vendors")
      .populate("clients");
    }else if (role === "admin") {
      query = {}; // all submissions
      sites = await Site.find(query)
      .populate("vendors")
      .populate("clients");
    } else {
      return res.status(403).json({ message: "Access denied for this role." });
    }
    // const sites = await Site.find()
    //   .populate("vendors", "vendorsName")
    //   .populate("clients", "clientName");

    // Transform vendors and clients to return only names
    const transformedSites = sites.map((site) => ({
      ...site.toObject(),
      vendors: site.vendors.map((v) => v.vendorsName),
      clients: site.clients.map((c) => c.clientName),
    }));

    res.status(200).json(transformedSites);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateSite = async (req, res) => {
  try {
    const siteId = req.params.id;
    const {
      siteName,
      siteCode,
      siteAddress,
      siteCity,
      siteStateLoc,
      vendors,
      clients,
      checklist,
    } = req.body;

    // Get ObjectIds from names
    const vendorDocs = await Vendor.find({ vendorsName: { $in: vendors } });
    const vendorIds = vendorDocs.map((v) => v._id);

    const clientDocs = await Client.find({ clientName: { $in: clients } });
    const clientIds = clientDocs.map((c) => c._id);

    const updatedSite = await Site.findByIdAndUpdate(
      siteId,
      {
        siteName,
        siteCode,
        siteAddress,
        siteCity,
        siteStateLoc,
        vendors: vendorIds,
        clients: clientIds,
        checklist,
      },
      { new: true }
    );

    res.status(200).json(updatedSite);
  } catch (error) {
    console.error("Error updating site:", error);
    res.status(500).json({ message: "Server error while updating site" });
  }
};

const deleteSite = async (req, res) => {
  const siteId = req.params.id;
  try {
    await Site.findByIdAndDelete(siteId);
    res.status(200).json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Error deleting site:", error);
    res.status(500).json({ message: "Server error while deleting site" });
  }
};

exports.createSite = createSite;
exports.getAllSites = getAllSites;
exports.updateSite = updateSite;
exports.deleteSite = deleteSite;
