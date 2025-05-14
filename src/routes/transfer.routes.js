const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const { getListOfBillersController, getListOfEWalletsController, getListOfBanksController } = require("../controllers/transfer.controller.js");
const router = express.Router();

router.get("/billers", authMiddleware, getListOfBillersController)
router.get("/ewallets", authMiddleware, getListOfEWalletsController)
router.get("/externals", authMiddleware, getListOfBanksController)

module.exports = router;
