-- Mock Data Generation for Banking/Crypto Application Schema

-- =========================================================================
-- Users Table Mock Data
-- =========================================================================
-- Note: Passwords should be securely hashed in a real application.
-- These are just placeholder strings.
INSERT INTO Users (email, password_hash, firstname, middlename, lastname, date_of_birth, nationality, address, id_type, valid_id_path) VALUES
('juan.delacruz@email.com', '$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL', 'Juan', 'Santos', 'Dela Cruz', '1990-05-15', 'Filipino', '123 Rizal St, Manila, Metro Manila', 'Passport', '/ids/juan_passport.jpg'),
('maria.garcia@email.com', '$2b$12$1234567890abcdefghijklmnopqrstuvwxyzABC', 'Maria', 'Lopez', 'Garcia', '1988-11-22', 'Filipino', '456 Bonifacio Ave, Quezon City, Metro Manila', 'DriversLicense', '/ids/maria_license.pdf'),
('peter.tan@email.com', '$2b$12$zyxwuvtsrqponmlkjihgfedcbaZYXWVUTSRQP', 'Peter', NULL, 'Tan', '1995-02-10', 'Filipino', '789 Ayala Blvd, Makati, Metro Manila', 'UMID', '/ids/peter_umid.png'),
('lisa.reyes@email.com', '$2b$12$lkjhgfdsaPOIUYTREWQmnbvcxzLKJHGFDSA', 'Lisa', 'Castro', 'Reyes', '2000-08-30', 'Filipino', '101 Escolta St, Binondo, Manila', 'NationalID', '/ids/lisa_nationalid.jpg');


-- =========================================================================
-- Accounts Table Mock Data
-- =========================================================================
-- Assuming user_id 1 = Juan, 2 = Maria, 3 = Peter, 4 = Lisa
INSERT INTO Accounts (user_id, account_number, balance, funds_on_hold, currency, debit_card_number, debit_card_expiry, debit_card_cvv) VALUES
(1, '1000000001', 50000.00, 1500.00, 'PHP', '4000111122223333', '12/26', '123'), -- Juan's PHP Account
(1, '1000000002', 1200.50, 0.00, 'USD', NULL, NULL, NULL), -- Juan's USD Account
(2, '1000000003', 125000.75, 0.00, 'PHP', '5100444455556666', '06/27', '456'), -- Maria's PHP Account
(3, '1000000004', 7500.00, 500.00, 'PHP', '4000777788889999', '03/25', '789'), -- Peter's PHP Account
(4, '1000000005', 250000.00, 10000.00, 'PHP', NULL, NULL, NULL); -- Lisa's PHP Account


-- =========================================================================
-- Billers Table Mock Data
-- =========================================================================
INSERT INTO Billers (name, is_active) VALUES
('Meralco', TRUE),
('Maynilad Water', TRUE),
('PLDT', TRUE),
('Globe Telecom', TRUE),
('SkyCable', FALSE); -- Example of an inactive biller


-- =========================================================================
-- Ewallets Table Mock Data
-- =========================================================================
INSERT INTO Ewallets (name, is_active) VALUES
('GCash', TRUE),
('PayMaya (Maya)', TRUE),
('Coins.ph', TRUE),
('GrabPay', FALSE); -- Example of an inactive e-wallet


-- =========================================================================
-- Banks Table Mock Data
-- =========================================================================
INSERT INTO Banks (name, is_active) VALUES
('BDO Unibank', TRUE),
('Bank of the Philippine Islands (BPI)', TRUE),
('Metrobank', TRUE),
('Land Bank of the Philippines', TRUE),
('Security Bank', TRUE),
('UnionBank of the Philippines', FALSE); -- Example of an inactive bank


-- =========================================================================
-- Cryptocurrencies Table Mock Data
-- =========================================================================
-- Note: Market data is illustrative and not real-time.
INSERT INTO Cryptocurrencies (coin_name, coin_code, rank, market_cap, market_dominance, circulation_supply, max_supply, total_supply, issue_date, all_time_high, all_time_low, current_value, delta_24h, icon_url, last_updated, is_active) VALUES
('Bitcoin', 'BTC', 1, '$1.3T', '52.1%', '19.7M BTC', '21M BTC', '19.7M BTC', '2009-01-03', '$73,750.07', '$67.81', 68000.50, 1.5, 'https://example.com/icons/btc.png', DATETIME('now', '-1 hour'), TRUE),
('Ethereum', 'ETH', 2, '$450B', '18.2%', '120.2M ETH', NULL, '120.2M ETH', '2015-07-30', '$4,891.70', '$0.43', 3750.25, -0.8, 'https://example.com/icons/eth.png', DATETIME('now', '-1 hour'), TRUE),
('Solana', 'SOL', 5, '$75B', '3.0%', '448.5M SOL', NULL, '575.2M SOL', '2020-03-23', '$260.06', '$0.50', 168.10, 3.2, 'https://example.com/icons/sol.png', DATETIME('now', '-1 hour'), TRUE),
('Dogecoin', 'DOGE', 8, '$22B', '0.9%', '144.1B DOGE', NULL, '144.1B DOGE', '2013-12-06', '$0.7376', '$0.000085', 0.15, -2.5, 'https://example.com/icons/doge.png', DATETIME('now', '-1 hour'), FALSE); -- Example inactive coin


-- =========================================================================
-- CryptoPortfolios Table Mock Data
-- =========================================================================
-- Assuming crypto_id 1 = BTC, 2 = ETH, 3 = SOL
-- Assuming user_id 1 = Juan, 2 = Maria, 3 = Peter
INSERT INTO CryptoPortfolios (user_id, crypto_id, coin_amount) VALUES
(1, 1, 0.0500000000), -- Juan owns 0.05 BTC
(1, 2, 1.2000000000), -- Juan owns 1.2 ETH
(2, 1, 0.0100000000), -- Maria owns 0.01 BTC
(3, 2, 5.5000000000), -- Peter owns 5.5 ETH
(3, 3, 100.0000000000); -- Peter owns 100 SOL


-- =========================================================================
-- Transactions Table Mock Data
-- =========================================================================
-- Assuming account_id 1 = Juan PHP, 2 = Juan USD, 3 = Maria PHP, 4 = Peter PHP, 5 = Lisa PHP
-- Assuming biller_id 1 = Meralco, 3 = PLDT
-- Assuming ewallet_id 1 = GCash, 2 = Maya
-- Assuming recipient_account_id 3 = Maria PHP, 4 = Peter PHP
INSERT INTO Transactions (transaction_reference_number, transaction_name, status, type, account_id, amount, notes, service_charge, recipient_account_id, recipient_bank_name, recipient_account_number, recipient_account_name, transfer_channel, biller_id, biller_reference_number, ewallet_id, ewallet_reference_number, withdrawal_location, cardless_initiation_ref) VALUES
('TXN_INT_001', 'Transfer to Maria Garcia', 'COMPLETED', 'INTERNAL_TRANSFER', 1, 5000.00, 'Dinner reimbursement', 0.00, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TXN_BILL_001', 'Meralco Payment May', 'COMPLETED', 'BILL_PAYMENT', 3, 2500.50, 'May electricity bill', 0.00, NULL, NULL, NULL, NULL, NULL, 1, '1234567890', NULL, NULL, NULL, NULL),
('TXN_EXT_001', 'Transfer to BDO Account', 'PENDING', 'EXTERNAL_TRANSFER', 1, 10000.00, 'Payment for item', 15.00, NULL, 'BDO Unibank', '001234567890', 'Supplier Inc.', 'InstaPay', NULL, NULL, NULL, NULL, NULL, NULL),
('TXN_EWL_001', 'Load GCash', 'COMPLETED', 'EWALLET_LOAD', 4, 500.00, 'GCash top-up', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, '09171234567', NULL, NULL),
('TXN_CW_001', 'Cardless Withdrawal Init', 'PENDING', 'CARDLESS_WITHDRAWAL', 1, 2000.00, 'Cash for weekend', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'CWREF123'),
('TXN_DEP_001', 'Cash Deposit via ATM', 'COMPLETED', 'DEPOSIT', 3, 10000.00, 'ATM Deposit', 0.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ATM Location XYZ', NULL),
('TXN_FAIL_001', 'Transfer Attempt', 'FAILED', 'INTERNAL_TRANSFER', 4, 1000.00, 'Insufficient funds test', 0.00, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('TXN_BILL_002', 'PLDT Payment', 'COMPLETED', 'BILL_PAYMENT', 1, 1899.00, 'Internet bill', 0.00, NULL, NULL, NULL, NULL, NULL, 3, '0288881234', NULL, NULL, NULL, NULL);


-- =========================================================================
-- CryptoTransactions Table Mock Data
-- =========================================================================
-- Assuming user_id 1 = Juan, 3 = Peter
-- Assuming crypto_id 1 = BTC, 2 = ETH
-- Assuming PHP account_id = 1 (Juan), 4 (Peter)
INSERT INTO CryptoTransactions (reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, status, exchange_rate) VALUES
('CTX_001', 1, 'PHP', 34000.00, NULL, 'BTC', 0.0005000000, 1, 'COMPLETED', 68000000.00), -- Juan buys 0.0005 BTC with PHP
('CTX_002', 1, 'BTC', 0.0001000000, 1, 'ETH', 0.0018132530, 2, 'COMPLETED', 0.01813253), -- Juan converts some BTC to ETH (rate is ETH per BTC)
('CTX_003', 3, 'ETH', 1.0000000000, 2, 'PHP', 3750.25, NULL, 'COMPLETED', 3750.25), -- Peter sells 1 ETH for PHP
('CTX_004', 1, 'PHP', 10000.00, NULL, 'ETH', 0.0026665000, 2, 'COMPLETED', 3750.25); -- Juan buys more ETH with PHP

