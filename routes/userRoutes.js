const express = require("express");
const {createAdminUser} = require("../controllers/user-controller");
const {login} = require("../controllers/auth-controller")
const router = express.Router();


router.post("/createUser", createAdminUser);
router.post("/login", login);

module.exports = router
