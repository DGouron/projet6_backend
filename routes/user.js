const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const email = require("../middlewares/email");
const password = require("../middlewares/password");

router.post("/signup", password, email, userController.signup);
router.post("/login", userController.login);

module.exports = router;
