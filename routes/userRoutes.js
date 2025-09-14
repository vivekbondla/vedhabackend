const express = require("express");
const {createAdminUser} = require("../controllers/user-controller");
const {login, forgotPassword, resetPassword} = require("../controllers/auth-controller")
const router = express.Router();


router.post("/createUser", createAdminUser);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

module.exports = router
