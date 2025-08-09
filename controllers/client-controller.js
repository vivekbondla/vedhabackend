const Client = require("../models/ClientModel");
const User = require("../models/UserModel");
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
    const user = await User.create({
      email: req.body.clientEmail,
      password: req.body.password,
      userName: req.body.clientName,
      role: "client",
      refId: savedClient._id,
      refModel: "Client",
    });
    // res.status(201).json(savedClient);
    res
      .status(201)
      .json({ message: "Client and user created", savedClient, user });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: "Server error while creating client" });
  }
};

const updateClient = async (req, res) => {
  const clientId = req.params.id;

  const {
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    clientCity,
    clientStateLoc,
    clientPincode,
  } = req.body;

  try {
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        clientCity,
        clientStateLoc,
        clientPincode,
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      {
        refId: clientId,
        role: "client",
      },
      { email: clientEmail, userName: clientName }
    );

    res.status(200).json({message: "Client updated  successfully",updatedClient });
  } catch (error) {

    console.error("Error updating Client:", error);
    res.status(500).json({message: "Server error while updating client"})
  }
};
const deleteClient = async (req, res) => {
  const clientId = req.params.id;
  try {
    await Client.findByIdAndDelete(clientId); // del client

    await User.findOneAndDelete({ refId: clientId, role: "client" }); // del user

    res
      .status(200)
      .json({ message: "Client and User deleted successfully..!" });
  } catch (error) {
    console.error("Error deleting Client:", error);
    res.status(500).json({ message: "Server error while deleting client" });
  }
};

exports.getAllClients = getAllClients;
exports.createClient = createClient;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
