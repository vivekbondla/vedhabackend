const mongoose = require("mongoose");

const auditorSchema = new mongoose.Schema({
    auditorName:{type: String, required: true},
    auditorCode:{type: String, required: true},
    auditorPincode:{type: String, required: true},
    auditorCity:{type: String, required: true},
    auditorStateLoc:{type: String, required: true},
    auditorEmail:{type: String, required: true},
    auditorPhone:{type: String, required: true},


})

module.exports = mongoose.model("Auditor",auditorSchema);