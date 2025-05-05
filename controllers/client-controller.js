const Client = require("../models/ClientModel");
const getAllClients =async (req, res)=>{
    
    try {
      const clients = await Client.find();
      res.status(200).json(clients);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ message: "Server error" });
    }

}

exports.getAllClients = getAllClients;