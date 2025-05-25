const { 
    createCryptoTransaction, 
    getCryptoTransactionsByUserID, 
    getUserCryptoPortfolio,
    updateCryptoPortfolio 
} = require("../models/cryptoTransaction.model.js")
const { getAccountByUserID } = require("../models/account.model.js")
const { generateRandomReferenceNumber } = require("../lib/randomGenerator.js")

// Get user's crypto portfolio
function getPortfolioController(req, res) {
    try {
        const holdings = getUserCryptoPortfolio(req.user_id) || [];
        // Calculate total value
        const totalValue = holdings.reduce((sum, h) => sum + (h.total_value || 0), 0);
        // Placeholder for change (could be calculated based on previous value, etc.)
        const change = 0;
        return res.status(200).json({
            portfolio: {
                holdings,
                totalValue,
                change
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch portfolio", error: error.message })
    }
}

// Get user's crypto transaction history
function getTransactionHistoryController(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10
        const offset = parseInt(req.query.offset) || 0
        const transactions = getCryptoTransactionsByUserID(req.user_id, limit, offset)
        return res.status(200).json({ transactions })
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch transactions", error: error.message })
    }
}

// Buy cryptocurrency
function buyCryptoController(req, res) {
    const { crypto_code, amount, price } = req.body
    
    // Validate required fields
    if (!crypto_code || !amount || !price) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate crypto code
    const validCryptos = ['BTC', 'ETH', 'SOL']
    if (!validCryptos.includes(crypto_code)) {
        return res.status(400).json({ message: "Unsupported cryptocurrency" })
    }

    try {
        const account = getAccountByUserID(req.user_id)
        if (!account) {
            return res.status(404).json({ message: "Account not found" })
        }

        const totalCost = amount * price
        if (account.balance < totalCost) {
            return res.status(400).json({ message: "Insufficient balance" })
        }

        const currentDate = new Date()
        const referenceNumber = "CRY" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber()

        // Create crypto transaction
        const transaction = {
            reference_number: referenceNumber,
            user_id: req.user_id,
            from_currency: 'PHP',
            from_amount: totalCost,
            from_crypto_id: null,
            to_currency: crypto_code,
            to_amount: amount,
            to_crypto_id: getCryptoIdByCode(crypto_code),
            exchange_rate: price,
            status: 'COMPLETED'
        }

        createCryptoTransaction(transaction)
        updateCryptoPortfolio(req.user_id, getCryptoIdByCode(crypto_code), amount)

        return res.status(201).json({
            transactionDate: currentDate.toISOString(),
            referenceNumber,
            status: 'COMPLETED',
            amount,
            crypto_code,
            totalCost
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to process crypto purchase", error: error.message })
    }
}

// Convert between cryptocurrencies
function convertCryptoController(req, res) {
    const { from_crypto, to_crypto, amount, exchange_rate } = req.body
    
    // Validate required fields
    if (!from_crypto || !to_crypto || !amount || !exchange_rate) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    // Validate crypto codes
    const validCryptos = ['BTC', 'ETH', 'SOL']
    if (!validCryptos.includes(from_crypto) || !validCryptos.includes(to_crypto)) {
        return res.status(400).json({ message: "Unsupported cryptocurrency" })
    }

    try {
        const portfolio = getUserCryptoPortfolio(req.user_id)
        const fromCryptoHolding = portfolio.find(p => p.coin_code === from_crypto)
        
        if (!fromCryptoHolding || fromCryptoHolding.coin_amount < amount) {
            return res.status(400).json({ message: "Insufficient crypto balance" })
        }

        const currentDate = new Date()
        const referenceNumber = "CONV" + currentDate.toISOString().slice(0, 10).replace(/-/g, '') + generateRandomReferenceNumber()
        const toAmount = amount * exchange_rate

        // Create crypto transaction
        const transaction = {
            reference_number: referenceNumber,
            user_id: req.user_id,
            from_currency: from_crypto,
            from_amount: amount,
            from_crypto_id: getCryptoIdByCode(from_crypto),
            to_currency: to_crypto,
            to_amount: toAmount,
            to_crypto_id: getCryptoIdByCode(to_crypto),
            exchange_rate,
            status: 'COMPLETED'
        }

        createCryptoTransaction(transaction)
        
        // Update portfolio
        updateCryptoPortfolio(req.user_id, getCryptoIdByCode(from_crypto), -amount)
        updateCryptoPortfolio(req.user_id, getCryptoIdByCode(to_crypto), toAmount)

        return res.status(201).json({
            transactionDate: currentDate.toISOString(),
            referenceNumber,
            status: 'COMPLETED',
            fromAmount: amount,
            toAmount,
            fromCrypto: from_crypto,
            toCrypto: to_crypto
        })
    } catch (error) {
        return res.status(500).json({ message: "Failed to process crypto conversion", error: error.message })
    }
}

// Helper function to get crypto ID by code
function getCryptoIdByCode(code) {
    // This should be implemented to fetch from the Cryptocurrencies table
    // For now, returning mock IDs
    const cryptoIds = {
        'BTC': 701,
        'ETH': 702,
        'SOL': 703
    }
    return cryptoIds[code]
}

module.exports = {
    getPortfolioController,
    getTransactionHistoryController,
    buyCryptoController,
    convertCryptoController
}
