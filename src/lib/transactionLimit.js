const cron = require('node-cron');
const transactionLimit = 5

cron.schedule('0 0 * * *', () => {
  console.log('Running function at 12:00 AM');
  myMidnightFunction();
});

const transactionLimitStore = new Map();

function myMidnightFunction() {
  transactionLimitStore.clear()
}

function withinTransactionLimit(user_id){
  let transaction_Number = transactionLimitStore.get(user_id)
  if(!transaction_Number){
    return true
  }
  if(transaction_Number < transactionLimit){
    return true
  }
  return false
}

function registerTransaction(user_id){
  let transaction_Number = transactionLimitStore.get(user_id) || 0;
  transactionLimitStore.set(user_id, transaction_Number + 1);
}

module.exports = {
  withinTransactionLimit,
  registerTransaction,
}
