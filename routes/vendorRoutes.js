const express = require("express");
const {getAllVendors, createVendor, updateVendor, deleteVendor} = require("../controllers/vendor-controller")
const {verifyToken} = require("../controllers/auth-controller")
const router = express.Router();

router.get("/getAllVendors",verifyToken, getAllVendors);
router.post("/createVendor", createVendor);
router.put("/updateVendor/:id", updateVendor);
router.delete("/deleteVendor/:id", deleteVendor);

module.exports = router
