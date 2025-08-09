const express = require("express");
const {getAllVendors, createVendor, updateVendor, deleteVendor} = require("../controllers/vendor-controller")
const router = express.Router();

router.get("/getAllVendors", getAllVendors);
router.post("/createVendor", createVendor);
router.put("/updateVendor/:id", updateVendor);
router.delete("/deleteVendor/:id", deleteVendor);

module.exports = router
