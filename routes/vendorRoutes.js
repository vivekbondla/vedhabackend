const express = require("express");
const {getAllVendors, createVendor} = require("../controllers/vendor-controller")
const router = express.Router();

router.get("/getAllVendors", getAllVendors);
router.post("/createVendor", createVendor);

module.exports = router
