const Site = require("../models/SiteModel");

const getVendorEmailsBySiteName = async (siteName) => {
  try {
    const site = await Site.findOne({ siteName }).populate("vendors");

    if (!site) {
      throw new Error("Site not found");
    }

    const vendorEmails = site.vendors.map(vendor => vendor.vendorEmail);
    return vendorEmails;
  } catch (error) {
    console.error("Error fetching vendor emails:", error.message);
    throw error;
  }
};

exports.getVendorEmailsBySiteName = getVendorEmailsBySiteName;