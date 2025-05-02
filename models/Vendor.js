const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    vendorName:{type: String, required: true},
    vendorCode:{type: String, required: true},
    contactPerson:{type: String, required: true},
    natureOfWork:{type: String, required: true},
    vendorAddress:{type: String, required: true},
    vendorCity:{type: String, required: true},
    vendorState:{type: String, required: true},
    vendorEmail:{type: String, required: true},
    vendorPhone:{type: String, required: true},


})

module.exports = mongoose.model("Vendor",vendorSchema);