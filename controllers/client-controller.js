const Client = require("../models/ClientModel");
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createClient = async (req, res) => {
  const {
    clientName,
    clientId,
    clientEmail,
    clientPhone,
    clientAddress,
    clientCity,
    clientStateLoc,
    clientPincode,
  } = req.body;

  try {
    const newClient = new Client({
      clientName,
      clientId,
      clientEmail,
      clientPhone,
      clientAddress,
      clientCity,
      clientStateLoc,
      clientPincode,
    });
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Server error while creating client" });
  }
};

exports.getAllClients = getAllClients;
exports.createClient = createClient;
