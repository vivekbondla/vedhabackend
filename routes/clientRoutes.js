const express = require("express");
const {getAllClients, createClient, updateClient, deleteClient} = require("../controllers/client-controller")

const router = express.Router();

router.get("/getAllClients", getAllClients);
router.post("/createClient", createClient);
router.put("/updateClient/:id", updateClient);
router.delete("/deleteClient/:id", deleteClient);

module.exports = router;