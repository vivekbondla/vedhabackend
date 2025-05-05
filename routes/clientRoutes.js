const express = require("express");
const {getAllClients} = require("../controllers/client-controller")

const router = express.Router();

router.get("/getAllClients", getAllClients);

module.exports = router;