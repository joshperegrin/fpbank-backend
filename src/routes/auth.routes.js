const express = require("express");
const router = express.Router();

const validateEmail = require("../validator/email.validator.js")

const { authLoginController } = require("../controllers/auth.controller.js")

router.post("/login", express.json(), validateEmail, authLoginController)
router.post("/logout", (req, res) => {
})

module.exports = router;
