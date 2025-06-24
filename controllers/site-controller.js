const Site = require("../models/SiteModel");
const Vendor = require("../models/VendorModel");
const Client = require("../models/ClientModel");

const createSite = async (req, res) => {
  try {
    const {
      siteName,
      siteCode,
      siteAddress,
      siteCity,
      siteStateLoc,
      vendors,  // array of vendorName strings
      clients,  // array of clientName strings
      checklist
    } = req.body;

    // 1. Get Vendor ObjectIds based on vendorName
    const vendorDocs = await Vendor.find({ vendorsName: { $in: vendors } });
    const vendorIds = vendorDocs.map(v => v._id);

    // 2. Get Client ObjectIds based on clientName
    const clientDocs = await Client.find({ clientName: { $in: clients } });
    const clientIds = clientDocs.map(c => c._id);

    // 3. Create and save the site
    const newSite = new Site({
      siteName,
      siteCode,
      siteAddress,
      siteCity,
      siteStateLoc,
      vendors: vendorIds,
      clients: clientIds,
      checklist
    });

    const savedSite = await newSite.save();
    res.status(201).json(savedSite);

  } catch (error) {
    console.error("Error creating site:", error);
    res.status(500).json({ message: "Server error while creating site" });
  }
};

const getAllSites = async(req,res) =>{
try {
  const sites = await Site.find()
  .populate("vendors", "vendorsName")
      .populate("clients", "clientName");

    // Transform vendors and clients to return only names
    const transformedSites = sites.map(site => ({
      ...site.toObject(),
      vendors: site.vendors.map(v => v.vendorsName),
      clients: site.clients.map(c => c.clientName)
    }));

    res.status(200).json(transformedSites);
  
} catch (error) {
  console.log("error:", error);
  res.status(500).json({ message: "Server error" });
  
}

}

exports.createSite = createSite;
exports.getAllSites = getAllSites;