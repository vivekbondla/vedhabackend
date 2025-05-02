const express = require("express");
const {getAllVendors} = require("../controllers/vendor-controller")
const router = express.Router();

router.get("/getAllVendors", getAllVendors);

module.exports = router
