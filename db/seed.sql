-- Mock Data for SQLite3 Banking Application Schema

-- ###################################################################################
-- Users
-- ###################################################################################
INSERT INTO Users (user_id, email, password_hash, firstname, middlename, lastname, date_of_birth, nationality, address, id_type, valid_id_path) VALUES
(1, 'juan.delacruz@example.com', 'hashed_password_jdc', 'Juan', 'Santos', 'Dela Cruz', '1990-05-15', 'Filipino', '123 Rizal St, Manila, Philippines', 'Passport', '/ids/juan_passport.jpg'),
(2, 'maria.clara@example.com', 'hashed_password_mc', 'Maria', 'Isabella', 'Clara', '1992-08-22', 'Filipino', '456 Bonifacio Ave, Quezon City, Philippines', 'DriversLicense', '/ids/maria_license.png'),
(3, 'pedro.penduko@example.com', 'hashed_password_pp', 'Pedro', NULL, 'Penduko', '1985-11-01', 'Filipino', '789 Aguinaldo Hi-way, Cavite, Philippines', 'UMID', '/ids/pedro_umid.pdf'),
(4, 'anna.luna@example.com', 'hashed_password_al', 'Anna', 'Marie', 'Luna', '2000-01-30', 'Filipino', '101 Ayala Ave, Makati, Philippines', 'NationalID', '/ids/anna_nationalid.jpg');

-- ###################################################################################
-- Accounts
-- Note: Storing CVV is highly discouraged and often non-compliant. Included here as per schema.
-- ###################################################################################
INSERT INTO Accounts (account_id, user_id, account_number, balance, funds_on_hold, currency, debit_card_number, debit_card_expiry, debit_card_cvv) VALUES
(101, 1, '0012345678', 50000.75, 1000.00, 'PHP', '4000123456789010', '12/25', '123'),
(102, 1, '0019876543', 1200.50, 0.00, 'USD', '5100123456789011', '10/26', '456'),
(103, 2, '0021122334', 75000.00, 500.25, 'PHP', '4200123456789012', '08/27', '789'),
(104, 3, '0035566778', 15000.00, 2000.00, 'PHP', NULL, NULL, NULL),
(105, 4, '0041212121', 250000.00, 0.00, 'PHP', '4890123456789013', '03/28', '321');

-- ###################################################################################
-- Billers
-- ###################################################################################
INSERT INTO Billers (biller_id, name, is_active) VALUES
(201, 'Meralco', TRUE),
(202, 'Maynilad Water', TRUE),
(203, 'PLDT Home Fibr', TRUE),
(204, 'Globe Postpaid', TRUE),
(205, 'SkyCable', FALSE); -- Example of an inactive biller

-- ###################################################################################
-- Ewallets
-- ###################################################################################
INSERT INTO Ewallets (ewallet_id, name, is_active) VALUES
(301, 'GCash', TRUE),
(302, 'PayMaya', TRUE),
(303, 'Coins.ph', TRUE),
(304, 'GrabPay', FALSE); -- Example of an inactive ewallet

-- ###################################################################################
-- Banks
-- ###################################################################################
INSERT INTO Banks (bank_id, name, is_active) VALUES
(401, 'BDO Unibank', TRUE),
(402, 'Bank of the Philippine Islands (BPI)', TRUE),
(403, 'Metrobank', TRUE),
(404, 'Land Bank of the Philippines', TRUE),
(405, 'Security Bank', FALSE); -- Example of an inactive bank

-- ###################################################################################
-- Transactions
-- ###################################################################################
-- Transaction 1: Internal Transfer (Juan to Maria)
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(501, 'TXNREF000000001', 'Fund Transfer to Maria Clara', '2025-05-10 10:00:00+08:00', 'COMPLETED', 'INTERNAL_TRANSFER', 500.00, '{"sender_account_id": 101, "receiver_account_id": 103, "message": "For your expenses"}');

-- Transaction 2: Bill Payment (Juan - Meralco)
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(502, 'TXNREF000000002', 'Meralco Bill Payment', '2025-05-11 14:30:00+08:00', 'COMPLETED', 'BILL_PAYMENT', 1575.50, '{"account_id": 101, "biller_id": 201, "subscriber_number": "1234567890"}');

-- Transaction 3: Ewallet Load (Maria - GCash)
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(503, 'TXNREF000000003', 'GCash Load', '2025-05-12 09:15:00+08:00', 'PENDING', 'EWALLET_LOAD', 200.00, '{"account_id": 103, "ewallet_id": 301, "mobile_number": "09171234567"}');

-- Transaction 4: External Transfer (Pedro - BDO)
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(504, 'TXNREF000000004', 'Transfer to BDO Account', '2025-05-09 16:00:00+08:00', 'COMPLETED', 'EXTERNAL_TRANSFER', 3000.00, '{"source_account_id": 104, "destination_bank_id": 401, "destination_account_number": "00123456789", "destination_account_name": "John Doe"}');

-- Transaction 5: Deposit (Anna)
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(505, 'TXNREF000000005', 'Cash Deposit', '2025-05-08 11:00:00+08:00', 'COMPLETED', 'DEPOSIT', 10000.00, '{"account_id": 105, "deposit_method": "Over The Counter", "branch_code": "MAKATI001"}');

-- Transaction 6: Cardless Withdrawal (Juan) - Pending
INSERT INTO Transactions (transaction_id, transaction_reference_number, transaction_name, transaction_date, transaction_status, transaction_type, amount, transaction_details) VALUES
(506, 'TXNREF000000006', 'Cardless ATM Withdrawal', '2025-05-12 15:00:00+08:00', 'PENDING', 'CARDLESS_WITHDRAWAL', 2000.00, '{"account_id": 101, "withdrawal_pin_reference": "CWREF123XYZ"}');

-- ###################################################################################
-- TransactionEntries
-- ###################################################################################
-- Entries for Transaction 501 (Internal Transfer: Juan to Maria)
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(601, 501, 101, 'DEBIT'),
(602, 501, 103, 'CREDIT');

-- Entries for Transaction 502 (Bill Payment: Juan - Meralco)
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(603, 502, 101, 'DEBIT'); -- Money leaves Juan's account

-- Entries for Transaction 503 (Ewallet Load: Maria - GCash) - PENDING, so no entries yet or only debit hold
-- Assuming funds are put on hold for pending transactions
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(604, 503, 103, 'DEBIT'); -- Or this might be created only upon completion. Depends on system logic.

-- Entries for Transaction 504 (External Transfer: Pedro - BDO)
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(605, 504, 104, 'DEBIT');

-- Entries for Transaction 505 (Deposit: Anna)
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(606, 505, 105, 'CREDIT');

-- Entries for Transaction 506 (Cardless Withdrawal: Juan) - PENDING
-- Funds might be put on hold.
INSERT INTO TransactionEntries (entry_id, transaction_id, account_id, entry_type) VALUES
(607, 506, 101, 'DEBIT'); -- Represents funds on hold or initial debit before actual withdrawal.


-- ###################################################################################
-- Cryptocurrencies
-- ###################################################################################
INSERT INTO Cryptocurrencies (crypto_id, coin_name, coin_code, rank, market_cap, market_dominance, circulation_supply, max_supply, total_supply, issue_date, all_time_high, all_time_low, current_value, delta_24h, icon_url, last_updated, is_active) VALUES
(701, 'Bitcoin', 'BTC', 1, '$1.3T', '52.1%', '19.7M BTC', '21M BTC', '19.7M BTC', '2009-01-03', '$68,789.63', '$67.81', 67000.50, 1.25, 'https://example.com/icons/btc.png', '2025-05-12 15:30:00+08:00', TRUE),
(702, 'Ethereum', 'ETH', 2, '$450B', '18.2%', '120M ETH', NULL, '120M ETH', '2015-07-30', '$4,891.70', '$0.4209', 3800.75, -0.55, 'https://example.com/icons/eth.png', '2025-05-12 15:30:00+08:00', TRUE),
(703, 'Solana', 'SOL', 5, '$80B', '3.5%', '448M SOL', NULL, '573M SOL', '2020-03-23', '$260.06', '$0.5008', 175.20, 3.10, 'https://example.com/icons/sol.png', '2025-05-12 15:30:00+08:00', TRUE),
(704, 'Dogecoin', 'DOGE', 8, '$22B', '0.9%', '144B DOGE', NULL, '144B DOGE', '2013-12-06', '$0.7376', '$0.00008547', 0.15, -2.75, 'https://example.com/icons/doge.png', '2025-05-12 15:30:00+08:00', FALSE); -- Example inactive crypto

-- ###################################################################################
-- CryptoPortfolios
-- ###################################################################################
INSERT INTO CryptoPortfolios (portfolio_entry_id, user_id, crypto_id, coin_amount) VALUES
(801, 1, 701, 0.5000000000), -- Juan owns 0.5 BTC
(802, 1, 702, 2.7500000000), -- Juan owns 2.75 ETH
(803, 2, 701, 0.1000000000), -- Maria owns 0.1 BTC
(804, 2, 703, 15.0000000000), -- Maria owns 15 SOL
(805, 4, 701, 1.2000000000); -- Anna owns 1.2 BTC

-- ###################################################################################
-- CryptoTransactions
-- ###################################################################################
-- Crypto Transaction 1: User 1 buys BTC with PHP from Account 101
INSERT INTO CryptoTransactions (crypto_transaction_id, reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, transaction_date, status, exchange_rate) VALUES
(901, 'CTXREF000000001', 1, 'PHP', 33500.25, NULL, 'BTC', 0.0005000000, 701, '2025-05-01 10:00:00+08:00', 'COMPLETED', 67000.50); -- 33500.25 PHP / 67000.50 PHP/BTC = 0.0005 BTC

-- Crypto Transaction 2: User 2 sells SOL for PHP to Account 103
INSERT INTO CryptoTransactions (crypto_transaction_id, reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, transaction_date, status, exchange_rate) VALUES
(902, 'CTXREF000000002', 2, 'SOL', 5.0000000000, 703, 'PHP', 876.00, NULL, '2025-05-05 11:30:00+08:00', 'COMPLETED', 175.20); -- 5 SOL * 175.20 PHP/SOL = 876 PHP

-- Crypto Transaction 3: User 1 converts BTC to ETH
INSERT INTO CryptoTransactions (crypto_transaction_id, reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, transaction_date, status, exchange_rate) VALUES
(903, 'CTXREF000000003', 1, 'BTC', 0.0100000000, 701, 'ETH', 0.1763092105, 702, '2025-05-07 14:00:00+08:00', 'COMPLETED', 17.63092105); -- 1 BTC = 17.63092105 ETH (67000.50 / 3800.75)

-- Crypto Transaction 4: User 4 buys ETH with USD from Account 102 (assuming user 1 has USD account, but for user 4, let's assume they have a USD source not explicitly listed or it's an external funding)
-- For simplicity, let's assume this is a direct fiat to crypto purchase where the fiat source is not an account in *this* system for User 4, or it's from their PHP account converted to USD by the platform.
-- Let's make it a PHP to ETH for User 4 from Account 105 for clarity.
INSERT INTO CryptoTransactions (crypto_transaction_id, reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, transaction_date, status, exchange_rate) VALUES
(904, 'CTXREF000000004', 4, 'PHP', 19003.75, NULL, 'ETH', 0.0050000000, 702, '2025-05-10 09:00:00+08:00', 'COMPLETED', 3800.75); -- 19003.75 PHP / (3800.75 USD/ETH * ~50 PHP/USD) - simplified rate. Let's use direct ETH price for to_amount.
-- Re-evaluating the above: from_amount should be in PHP, to_amount in ETH.
-- Exchange rate should be PHP per ETH. If ETH is 3800.75 USD, and USDPHP is ~57, then ETHPHP is ~216642.75
-- So, 0.005 ETH would cost 0.005 * 216642.75 = 1083.21 PHP. Let's adjust:
UPDATE CryptoTransactions
SET from_amount = 1083.21, exchange_rate = 216642.75
WHERE crypto_transaction_id = 904;
-- Or, if the user bought 0.005 ETH for 19003.75 PHP, the rate was 19003.75 / 0.005 = 3800750 PHP/ETH (which is too high, implies error in example)
-- Let's assume user bought for a certain PHP amount, and got a certain ETH amount.
-- Let's say User 4 bought 0.5 ETH.
-- from_amount = 0.5 ETH * 216642.75 PHP/ETH = 108321.375 PHP
INSERT INTO CryptoTransactions (crypto_transaction_id, reference_number, user_id, from_currency, from_amount, from_crypto_id, to_currency, to_amount, to_crypto_id, transaction_date, status, exchange_rate) VALUES
(905, 'CTXREF000000005', 4, 'PHP', 108321.38, NULL, 'ETH', 0.5000000000, 702, '2025-05-10 09:00:00+08:00', 'COMPLETED', 216642.75); -- Rate is PHP per unit of TO_CURRENCY if FROM_CURRENCY is fiat.


-- Update timestamps to be more varied and realistic (older)
UPDATE Users SET created_at = '2023-01-10 09:00:00+08:00', updated_at = '2024-05-01 10:00:00+08:00' WHERE user_id = 1;
UPDATE Users SET created_at = '2023-02-15 11:00:00+08:00', updated_at = '2024-04-20 12:00:00+08:00' WHERE user_id = 2;
UPDATE Users SET created_at = '2022-11-05 14:30:00+08:00', updated_at = '2024-03-10 15:00:00+08:00' WHERE user_id = 3;
UPDATE Users SET created_at = '2024-01-20 16:00:00+08:00', updated_at = '2024-05-10 17:00:00+08:00' WHERE user_id = 4;

UPDATE Accounts SET created_at = '2023-01-10 09:05:00+08:00', updated_at = '2025-05-10 10:05:00+08:00' WHERE account_id = 101;
UPDATE Accounts SET created_at = '2023-01-10 09:10:00+08:00', updated_at = '2025-05-01 11:00:00+08:00' WHERE account_id = 102;
UPDATE Accounts SET created_at = '2023-02-15 11:05:00+08:00', updated_at = '2025-05-12 09:20:00+08:00' WHERE account_id = 103;
UPDATE Accounts SET created_at = '2022-11-05 14:35:00+08:00', updated_at = '2025-05-09 16:05:00+08:00' WHERE account_id = 104;
UPDATE Accounts SET created_at = '2024-01-20 16:05:00+08:00', updated_at = '2025-05-08 11:05:00+08:00' WHERE account_id = 105;

-- Note: For TransactionEntries related to PENDING transactions, the logic of when entries are created (e.g., on initiation for fund holding, or only on completion)
-- can vary. The mock data assumes an entry is made for debit even if pending to reflect funds potentially being on hold.
-- Also, for CryptoTransactions, the exchange_rate field interpretation:
-- If converting Fiat to Crypto: Rate is Fiat per unit of Crypto (e.g., PHP per BTC).
-- If converting Crypto to Fiat: Rate is Fiat per unit of Crypto (e.g., PHP per SOL).
-- If converting Crypto to Crypto: Rate is units of TO_CURRENCY per unit of FROM_CURRENCY (e.g., ETH per BTC).
