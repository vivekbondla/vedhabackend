const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  siteCode: { type: String, required: true },
  siteStateLoc: { type: String, required: true },
  siteCity: { type: String, required: true },
  siteAddress: { type: String, required: true },
  //reference
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  checklist: { type: [], required: true },
});

module.exports = mongoose.model("Site",siteSchema)
