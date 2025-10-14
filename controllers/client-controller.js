const Client = require("../models/ClientModel");
const Site = require("../models/SiteModel");
const User = require("../models/UserModel");
const ScheduleAudit = require("../models/ScheduleAuditModel");

const getAllClients = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userRefId = req.user.refId;
    const userEmail = req.user.email;
    const userName = req.user.username;

    let clients = [];

    if (userRole === "admin") {
      // Admin gets all clients
      clients = await Client.find();
    } else if (userRole === "vendor") {
      // Vendor gets only their clients (via sites)
      const sites = await Site.find({ vendors: userRefId }).populate("clients");
      const clientSet = new Set();

      sites.forEach((site) => {
        site.clients.forEach((client) => {
          clientSet.add(client._id.toString());
        });
      });

      clients = await Client.find({
        _id: { $in: Array.from(clientSet) },
      });
    } else if (userRole === "auditor") {
      // ✅ Auditor can see only clients they are assigned to in ScheduleAudit
      const audits = await ScheduleAudit.find({ auditorName: userEmail });

      // Extract unique client names from audits
      const clientNames = [...new Set(audits.flatMap(a => a.clientName))];

      // Find clients that match those names
      clients = await Client.find({ clientEmail: { $in: clientNames } });
    } else if (userRole === "client") {
      clients = await Client.find({ clientEmail: userEmail });
    } else {
      return res.status(403).json({ message: "Access denied for this role" });
    }

    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: "Server error fetching clients" });
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

    res
      .status(200)
      .json({ message: "Client updated  successfully", updatedClient });
  } catch (error) {
    console.error("Error updating Client:", error);
    res.status(500).json({ message: "Server error while updating client" });
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
