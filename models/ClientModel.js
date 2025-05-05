const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    clientName:{type: [], require:true},
    clientId:{type: String, require:true},
    clientEmail:{type: String, require:true},
    clientPhone:{type: String, require:true},
    clientAddress:{type: String, require:true},
    clientState:{type: String, require:true},
    clientCity:{type: String, require:true},
    clientPincode:{type: String, require:true},
});

module.exports= mongoose.model("Client",clientSchema)