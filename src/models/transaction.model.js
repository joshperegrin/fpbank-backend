const db = require('../models/db.js')

function getTransactionsByUserID(user_id, limit, offset){
  const stmt = db.prepare("SELECT t.transaction_reference_number, t.transaction_name, t.transaction_date, t.transaction_status, t.transaction_type, t.amount, t.transaction_details, t.note, te.entry_type FROM Transactions t INNER JOIN TransactionEntries te ON t.transaction_id=te.transaction_id INNER JOIN Accounts a ON te.account_id = a.account_id WHERE a.user_id=@user_id LIMIT @limit OFFSET @offset")
  const transactions = stmt.all({
    user_id,
    limit,
    offset
  })
  return transactions;
}

function getListOfBillers(){
  const stmt = db.prepare("SELECT name FROM Billers;")
  const billers = stmt.all()
  return billers;
}

function getListOfEWallets(){
  const stmt = db.prepare("SELECT name FROM EWallets;")
  const ewallets = stmt.all()
  return ewallets;
}

function getListOfBanks(){
  const stmt = db.prepare("SELECT name FROM Banks;")
  const banks = stmt.all()
  return banks;
}

function createTransaction(transaction){
  const stmt = db.prepare("INSERT INTO Transactions(transaction_reference_number, transaction_name, transaction_status, transaction_type, amount, note, transaction_details) VALUES(@_transaction_reference_number,@_transaction_name,@_transaction_status,@_transaction_type,@_amount,@_note,@_transaction_details)")
  const info = stmt.run({
    _transaction_reference_number: transaction.transaction_reference_number,
    _transaction_name: transaction.transaction_name,
    _transaction_status: transaction.transaction_status,
    _transaction_type: transaction.transaction_type,
    _amount: transaction.amount,
    _note: transaction.note,
    _transaction_details: transaction.transaction_details
  })
  if(info.changes === 0){
    throw Error("Account Creation Failed, no changes were made to the database.")
  } else {
    return info.lastInsertRowid
  }
}

module.exports = {
  getTransactionsByUserID,
  getListOfBillers,
  getListOfEWallets,
  getListOfBanks,
  createTransaction
}
