const db = require('../models/db.js')

function getTransactionsByUserID(user_id, limit, offset){
  const stmt = db.prepare("SELECT t.transaction_reference_number, t.transaction_name, t.transaction_date, t.transaction_status, t.transaction_type, t.amount, t.transaction_details, te.entry_type FROM Transactions t INNER JOIN TransactionEntries te ON t.transaction_id=te.transaction_id INNER JOIN Accounts a ON te.account_id = a.account_id WHERE a.user_id=@user_id LIMIT @limit OFFSET @offset")
  const transactions = stmt.all({
    user_id,
    limit,
    offset
  })
  return transactions;
}

module.exports = {
  getTransactionsByUserID
}
