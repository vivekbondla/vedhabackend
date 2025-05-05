const express = require("express");
const {createSite} = require("../controllers/site-controller")
const router = express.Router();

router.post("/createSite",createSite)

module.exports = router;