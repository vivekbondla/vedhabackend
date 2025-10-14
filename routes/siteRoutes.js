const express = require("express");
const {createSite,getAllSites, updateSite, deleteSite} = require("../controllers/site-controller")
const {verifyToken} = require("../controllers/auth-controller")
const router = express.Router();

router.post("/createSite",createSite);
router.get("/getAllSites", verifyToken, getAllSites );
router.put("/updateSite/:id", updateSite);
router.delete("/deleteSite/:id", deleteSite);

module.exports = router;