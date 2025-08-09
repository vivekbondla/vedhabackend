const express = require("express");
const {createSite,getAllSites, updateSite, deleteSite} = require("../controllers/site-controller")
const router = express.Router();

router.post("/createSite",createSite);
router.get("/getAllSites",getAllSites );
router.put("/updateSite/:id", updateSite);
router.delete("/deleteSite/:id", deleteSite);

module.exports = router;