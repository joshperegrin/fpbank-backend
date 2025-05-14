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

module.exports = {
  getTransactionsByUserID,
  getListOfBillers,
  getListOfEWallets
}
