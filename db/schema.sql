
CREATE TABLE Users (
    user_id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords only
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    id_type VARCHAR(50) NOT NULL,
    valid_id_path VARCHAR(512) NOT NULL, -- Path/URL to the stored ID file
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for login and lookups
CREATE INDEX idx_users_email ON Users(email);

CREATE TABLE Accounts (
    account_id INTEGER PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    balance DECIMAL(18, 4) NOT NULL DEFAULT 0.00,
    funds_on_hold DECIMAL(18, 4) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'PHP', -- Default currency, adjust as needed
    debit_card_number VARCHAR(20) UNIQUE, -- Assumes one card per account for simplicity
    debit_card_expiry VARCHAR(5), -- e.g., MM/YY (Note: Storing CVV is highly discouraged and often non-compliant)
    debit_card_cvv VARCHAR(3), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for quick lookup by user and account number
CREATE INDEX idx_accounts_user_id ON Accounts(user_id);
CREATE INDEX idx_accounts_account_number ON Accounts(account_number);
CREATE INDEX idx_accounts_debit_card_number ON Accounts(debit_card_number);

CREATE TABLE Billers (
    biller_id INTEGER PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- To enable/disable billers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for name lookup
CREATE INDEX idx_billers_name ON Billers(name);

CREATE TABLE Ewallets (
    ewallet_id INTEGER PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- To enable/disable e-wallets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for name lookup
CREATE INDEX idx_ewallets_name ON Ewallets(name);

CREATE TABLE Banks (
    bank_id INTEGER PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- To enable/disable banks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for name lookup
CREATE INDEX idx_banks_name ON Banks(name);


CREATE TABLE Transactions (
    transaction_id INTEGER PRIMARY KEY,
    transaction_reference_number VARCHAR(100) UNIQUE NOT NULL, -- System generated unique ID
    transaction_name VARCHAR(255), -- e.g., "Transfer to John Doe", "Meralco Bill Payment"
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK( status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') ) NOT NULL DEFAULT 'PENDING',
    type TEXT CHECK( type IN ('INTERNAL_TRANSFER', 'EXTERNAL_TRANSFER', 'BILL_PAYMENT', 'EWALLET_LOAD', 'CRYPTO_CONVERSION', 'CARDLESS_WITHDRAWAL', 'DEPOSIT') ) NOT NULL,

    -- Core transaction details
    account_id INT NOT NULL REFERENCES Accounts(account_id), -- The source account initiating the transaction
    amount DECIMAL(18, 4) NOT NULL,
    notes TEXT,
    service_charge DECIMAL(18, 4) DEFAULT 0.00, -- Applicable for external transfers

    -- Recipient details (nullable based on type)
    recipient_account_id INT REFERENCES Accounts(account_id), -- FK to Accounts (for internal transfers)
    recipient_bank_name VARCHAR(255),     -- For external transfers
    recipient_account_number VARCHAR(50), -- For external transfers
    recipient_account_name VARCHAR(255),  -- For external transfers
    transfer_channel VARCHAR(100),        -- For external transfers

    -- Biller details (nullable based on type)
    biller_id INT REFERENCES Billers(biller_id),
    biller_reference_number VARCHAR(100), -- e.g., Utility account number provided by user

    -- E-wallet details (nullable based on type)
    ewallet_id INT REFERENCES Ewallets(ewallet_id),
    ewallet_reference_number VARCHAR(100), -- e.g., Phone number or account ID provided by user

    -- Withdrawal details (nullable based on type)
    withdrawal_location VARCHAR(255),      -- Location where cardless withdrawal was completed
    cardless_initiation_ref VARCHAR(100), -- Optional: If user provides a ref during initiation POST /api/withdraw/cardless

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- To track status changes
);

-- Indexes for common lookups
CREATE INDEX idx_transactions_account_id ON Transactions(account_id);
CREATE INDEX idx_transactions_type ON Transactions(type);
CREATE INDEX idx_transactions_status ON Transactions(status);
CREATE INDEX idx_transactions_date ON Transactions(transaction_date);
CREATE INDEX idx_transactions_ref_num ON Transactions(transaction_reference_number);
CREATE INDEX idx_transactions_recipient_account_id ON Transactions(recipient_account_id); -- For finding incoming internal transfers

CREATE TABLE Cryptocurrencies (
    crypto_id INTEGER PRIMARY KEY,
    coin_name VARCHAR(100) NOT NULL,
    coin_code VARCHAR(10) UNIQUE NOT NULL, -- e.g., BTC, ETH
    rank INT,
    market_cap VARCHAR(100), -- Use VARCHAR as these can be large formatted strings
    market_dominance VARCHAR(50),
    circulation_supply VARCHAR(100),
    max_supply VARCHAR(100),
    total_supply VARCHAR(100),
    issue_date DATE,
    all_time_high VARCHAR(100),
    all_time_low VARCHAR(100),
    current_value DECIMAL(24, 10), -- High precision for crypto values
    delta_24h DECIMAL(10, 4), -- Percentage change
    icon_url VARCHAR(512), -- Added: Useful for frontend
    last_updated TIMESTAMP WITH TIME ZONE, -- When the data was last refreshed
    is_active BOOLEAN DEFAULT TRUE -- To enable/disable coins for trading/viewing
);

-- Indexes
CREATE INDEX idx_cryptocurrencies_coin_code ON Cryptocurrencies(coin_code);
CREATE INDEX idx_cryptocurrencies_coin_name ON Cryptocurrencies(coin_name);

CREATE TABLE CryptoPortfolios (
    portfolio_entry_id INTEGER PRIMARY KEY,
    user_id INT NOT NULL REFERENCES Users(user_id) ON DELETE CASCADE,
    crypto_id INT NOT NULL REFERENCES Cryptocurrencies(crypto_id),
    coin_amount DECIMAL(24, 10) NOT NULL DEFAULT 0.0000000000, -- Amount of the coin held
    -- total_investment DECIMAL(18, 4) NOT NULL DEFAULT 0.00, -- Optional: Track cost basis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, crypto_id) -- Ensure only one entry per user per coin
);

-- Indexes
CREATE INDEX idx_cryptoportfolios_user_id ON CryptoPortfolios(user_id);
CREATE INDEX idx_cryptoportfolios_crypto_id ON CryptoPortfolios(crypto_id);


CREATE TABLE CryptoTransactions (
    crypto_transaction_id INTEGER PRIMARY KEY,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES Users(user_id),

    -- 'FROM' details
    from_currency VARCHAR(10) NOT NULL, -- Could be Fiat ('PHP', 'USD') or Crypto Code ('BTC')
    from_amount DECIMAL(24, 10) NOT NULL,
    from_crypto_id INT REFERENCES Cryptocurrencies(crypto_id), -- Nullable if from Fiat

    -- 'TO' details
    to_currency VARCHAR(10) NOT NULL, -- Could be Fiat ('PHP', 'USD') or Crypto Code ('BTC')
    to_amount DECIMAL(24, 10) NOT NULL,
    to_crypto_id INT REFERENCES Cryptocurrencies(crypto_id), -- Nullable if to Fiat

    -- Transaction details
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK( status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') ) NOT NULL DEFAULT 'COMPLETED', -- Assuming conversions are instant/atomic for simplicity
    exchange_rate DECIMAL(24, 10) -- Optional: Rate at time of conversion
);

-- Indexes
CREATE INDEX idx_cryptotransactions_user_id ON CryptoTransactions(user_id);
CREATE INDEX idx_cryptotransactions_ref_num ON CryptoTransactions(reference_number);
CREATE INDEX idx_cryptotransactions_date ON CryptoTransactions(transaction_date);
CREATE INDEX idx_cryptotransactions_from_currency ON CryptoTransactions(from_currency);
CREATE INDEX idx_cryptotransactions_to_currency ON CryptoTransactions(to_currency);
