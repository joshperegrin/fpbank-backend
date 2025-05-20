const express = require("express");
const authMiddleware = require("../middleware/auth.middleware.js");
const { getListOfBillersController, getListOfEWalletsController, getListOfBanksController, internalTransferController, externalTransferController, billerTransferController, ewalletTransferController } = require("../controllers/transfer.controller.js");
const router = express.Router();

const { body, validationResult } = require('express-validator');

const internalTransferValidationRules = [
  // Validate amount
  body('amount')
    .exists().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0.')
    .custom((value) => {
      if (value > 100000) {
        throw new Error('Amount exceeds transaction limit.');
      }
      return true;
    }),

  // Validate notes (optional, but if present must meet constraints)
  body('note')
    .optional()
    .isString().withMessage('Notes must be a string.')
    .isLength({ max: 250 }).withMessage('Notes must not exceed 250 characters.'),

  // Validate destination account number
  body('destination_AccountNumber')
    .exists().withMessage('Destination account number is required.')
    .isString().withMessage('Account number must be a string.')
    .matches(/^\d{10}$/).withMessage('Account number must be exactly 10 digits.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next()
  }

];
const externalTransferValidationRules = [
  // Validate amount
  body('amount')
    .exists().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0.')
    .custom((value) => {
      if (value > 100000) {
        throw new Error('Amount exceeds transaction limit.');
      }
      return true;
    }),
  // Validate notes (optional, but if present must meet constraints)
  body('note')
    .optional()
    .isString().withMessage('Notes must be a string.')
    .isLength({ max: 250 }).withMessage('Notes must not exceed 250 characters.'),
  // Validate destination account number
  body('recipient_AccountNumber')
    .exists().withMessage('Destination account number is required.')
    .isString().withMessage('Account number must be a string.')
    .matches(/^\d{10}$/).withMessage('Account number must be exactly 10 digits.'),
  body('recipient_Bank')
    .isString().withMessage('Bank Name must be a string.')
    .isLength({ max: 250 }).withMessage('Bank Name must not exceed 250 characters.'),
  body('recipient_AccountName')
    .isString().withMessage('Account Name must be a string.')
    .isLength({ max: 250 }).withMessage('Account Name must not exceed 250 characters.'),
  body('transferChannel')
    .isString().withMessage('Transfer Channel must be a string.')
    .isIn(['INSTAPAY', 'PESONET']).withMessage('Transfer Channel must be either INSTAPAY or PESONET.'),
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

const billerTransferValidationRules = [
  // Validate amount
  body('amount')
    .exists().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0.')
    .custom((value) => {
      if (value > 100000) {
        throw new Error('Amount exceeds transaction limit.');
      }
      return true;
    }),
  body('billerName')
    .isString().withMessage('Biller must be a string.')
    .isLength({ max: 250 }).withMessage('Biller name must not exceed 250 characters.'),
  body('referenceNumber')
    .isString().withMessage('Reference Number must be a string.')
    .isLength({ max: 250 }).withMessage('Reference Number must not exceed 250 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next()
  }

];

const ewalletTransferValidationRules = [
  // Validate amount
  body('amount')
    .exists().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0.')
    .custom((value) => {
      if (value > 100000) {
        throw new Error('Amount exceeds transaction limit.');
      }
      return true;
    }),
  body('ewalletName')
    .isString().withMessage('Ewallet Name must be a string.')
    .isLength({ max: 250 }).withMessage('Ewallet Name must not exceed 250 characters.'),
  body('referenceNumber')
    .isString().withMessage('Reference Number must be a string.')
    .isLength({ max: 250 }).withMessage('Reference Number must not exceed 250 characters.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next()
  }

];

router.get("/billers", authMiddleware, getListOfBillersController)
router.get("/ewallets", authMiddleware, getListOfEWalletsController)
router.get("/externals", authMiddleware, getListOfBanksController)

router.post("/internal", express.json(), authMiddleware, internalTransferValidationRules, internalTransferController)
router.post("/external", express.json(), authMiddleware, externalTransferValidationRules, externalTransferController)
router.post("/biller", express.json(), authMiddleware, billerTransferValidationRules, billerTransferController)
router.post("/ewallet", express.json(), authMiddleware, ewalletTransferValidationRules, ewalletTransferController)


module.exports = router;
