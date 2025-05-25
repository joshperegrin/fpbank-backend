const express = require('express')
const router = express.Router()
const { 
    getPortfolioController,
    getTransactionHistoryController,
    buyCryptoController,
    convertCryptoController
} = require('../controllers/crypto.controller.js')
const authenticateToken = require('../middleware/auth.middleware.js')

// All routes require authentication
router.use(authenticateToken)

// Get user's crypto portfolio
router.get('/portfolio', getPortfolioController)

// Get user's crypto transaction history
router.get('/transactions', getTransactionHistoryController)

// Buy cryptocurrency
router.post('/buy', express.json(), buyCryptoController)

// Convert between cryptocurrencies
router.post('/convert', express.json(), convertCryptoController)

module.exports = router
