const db = require('./db.js')

// Create a new crypto transaction (buy or convert)
function createCryptoTransaction(transaction) {
    const stmt = db.prepare(`
        INSERT INTO CryptoTransactions(
            reference_number,
            user_id,
            from_currency,
            from_amount,
            from_crypto_id,
            to_currency,
            to_amount,
            to_crypto_id,
            exchange_rate,
            status
        ) VALUES (
            @_reference_number,
            @_user_id,
            @_from_currency,
            @_from_amount,
            @_from_crypto_id,
            @_to_currency,
            @_to_amount,
            @_to_crypto_id,
            @_exchange_rate,
            @_status
        )
    `)
    
    const info = stmt.run({
        _reference_number: transaction.reference_number,
        _user_id: transaction.user_id,
        _from_currency: transaction.from_currency,
        _from_amount: transaction.from_amount,
        _from_crypto_id: transaction.from_crypto_id,
        _to_currency: transaction.to_currency,
        _to_amount: transaction.to_amount,
        _to_crypto_id: transaction.to_crypto_id,
        _exchange_rate: transaction.exchange_rate,
        _status: transaction.status || 'COMPLETED'
    })

    if(info.changes === 0) {
        throw Error("Crypto Transaction Creation Failed")
    }
    return info.lastInsertRowid
}

// Get user's crypto transactions
function getCryptoTransactionsByUserID(user_id, limit = 10, offset = 0) {
    const stmt = db.prepare(`
        SELECT ct.*, 
               c1.coin_name as from_coin_name,
               c2.coin_name as to_coin_name
        FROM CryptoTransactions ct
        LEFT JOIN Cryptocurrencies c1 ON ct.from_crypto_id = c1.crypto_id
        LEFT JOIN Cryptocurrencies c2 ON ct.to_crypto_id = c2.crypto_id
        WHERE ct.user_id = @_user_id 
        ORDER BY ct.transaction_date DESC 
        LIMIT @_limit OFFSET @_offset
    `)
    
    return stmt.all({
        _user_id: user_id,
        _limit: limit,
        _offset: offset
    })
}

// Get user's crypto portfolio
function getUserCryptoPortfolio(user_id) {
    const stmt = db.prepare(`
        SELECT 
            c.coin_name,
            c.coin_code,
            c.current_value,
            cp.coin_amount,
            (cp.coin_amount * c.current_value) as total_value
        FROM CryptoPortfolios cp
        JOIN Cryptocurrencies c ON cp.crypto_id = c.crypto_id
        WHERE cp.user_id = @_user_id
    `)
    
    return stmt.all({
        _user_id: user_id
    })
}

// Update user's crypto portfolio
function updateCryptoPortfolio(user_id, crypto_id, amount_change) {
    const stmt = db.prepare(`
        INSERT INTO CryptoPortfolios (user_id, crypto_id, coin_amount)
        VALUES (@_user_id, @_crypto_id, @_amount_change)
        ON CONFLICT(user_id, crypto_id) 
        DO UPDATE SET 
            coin_amount = coin_amount + @_amount_change,
            updated_at = CURRENT_TIMESTAMP
    `)
    
    const info = stmt.run({
        _user_id: user_id,
        _crypto_id: crypto_id,
        _amount_change: amount_change
    })

    if(info.changes === 0) {
        throw Error("Portfolio Update Failed")
    }
    return info.lastInsertRowid
}

module.exports = {
    createCryptoTransaction,
    getCryptoTransactionsByUserID,
    getUserCryptoPortfolio,
    updateCryptoPortfolio
}
