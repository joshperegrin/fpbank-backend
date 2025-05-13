const express = require("express");
const { query, validationResult } = require('express-validator');
const multer = require("multer")
const path = require("path")
const { openAccountController, getBalanceController, getTransactionsController } = require("../controllers/account.controller.js");
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

const validations = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next()
  }
]


router.post("/", upload.single('validid'), openAccountMiddleware, openAccountController);
router.get("/balance", authMiddleware, getBalanceController)
router.get("/transactions", authMiddleware, validations, getTransactionsController)

module.exports = router;

