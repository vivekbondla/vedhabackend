const express = require("express");
const {createSite,getAllSites} = require("../controllers/site-controller")
const router = express.Router();

router.post("/createSite",createSite);
router.get("/getAllSites",getAllSites );

module.exports = router;