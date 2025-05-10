const express = require("express");
const multer = require("multer")
const path = require("path")
const { openAccountController, getBalanceController } = require("../controllers/account.controller.js");
const openAccountMiddleware = require("../middleware/openaccount.middleware.js");
const authMiddleware = require("../middleware/auth.middleware.js")

const router = express.Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
    cb(null, uniqueSuffix)
  }
})

const upload = multer({storage: storage});

router.post("/", upload.single('validid'), openAccountMiddleware, openAccountController);
router.get("/balance", authMiddleware, getBalanceController)

module.exports = router;

