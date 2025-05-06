const express = require("express");
const router = express.Router();

const loginMiddleware = require("../middleware/login.middleware.js")

const { authLoginController, authLogoutController } = require("../controllers/auth.controller.js")

router.post("/login", express.json(), loginMiddleware, authLoginController)
router.post("/logout", express.json(), authLogoutController)

module.exports = router;
