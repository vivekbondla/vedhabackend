const express = require("express");
const {getAllClients, createClient} = require("../controllers/client-controller")

const router = express.Router();

router.get("/getAllClients", getAllClients);
router.post("/createClient", createClient);

module.exports = router;