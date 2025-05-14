const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const { getListOfBillersController, getListOfEWalletsController } = require("../controllers/transfer.controller.js");
const router = express.Router();

router.get("/billers", authMiddleware, getListOfBillersController)
router.get("/ewallets", authMiddleware, getListOfEWalletsController)

module.exports = router;
