const db = require('./db.js');

const bank_identification_number = "585729"

function generateDebitCardNumber(){
  let number, numberString, queryResult;
  let stmt = db.prepare('SELECT * FROM ACCOUNTS WHERE account_number=?')
  do{
    number = Math.floor(Math.random() * 1e10)
    numberString = number.toString().padStart(10, 0)
    queryResult = stmt.get(bank_identification_number.concat(numberString))
    debugger;
    
  }while(typeof queryResult !== 'undefined')

  return numberString
}

function getAccountByUserID(user_id){
  const stmt = db.prepare('SELECT * FROM ACCOUNTS WHERE user_id=@_user_id');
  const account = stmt.get({_user_id: user_id});
  return account;
}

function createAccount(user_id){
  const generated_Account_Number = generateDebitCardNumber()
  const currentDate = new Date()

  const account_number = generated_Account_Number
  const balance = 0
  const funds_on_hold = 0
  const currency = "PHP"
  const debit_card_number = bank_identification_number.concat(generated_Account_Number)
  const debit_card_expiry = (currentDate.getMonth() + 1).toString().padStart(2, '0') + "/" + (currentDate.getFullYear() + 8).toString().slice(-2)
  const debit_card_cvv = (Math.floor(100 + Math.random() * 900)).toString()
  console.log("lmao")  
  const stmt = db.prepare(`INSERT INTO ACCOUNTS(user_id, account_number, balance, funds_on_hold, currency, debit_card_number, debit_card_expiry, debit_card_cvv) VALUES(@_user_id, @_account_number, @_balance, @_funds_on_hold, @_currency, @_debit_card_number, @_debit_card_expiry, @_debit_card_cvv)`)
  console.log("lmao2")  

  const info = stmt.run({
    _user_id: user_id,
    _account_number: account_number,
    _balance: balance,
    _funds_on_hold: funds_on_hold,
    _currency: currency,
    _debit_card_number: debit_card_number,
    _debit_card_expiry: debit_card_expiry,
    _debit_card_cvv: debit_card_cvv
  })
  console.log("lmao3")  

  if(info.changes === 0){
    throw Error("Account Creation Failed, no changes were made to the database.")
  } else {
    return {
      user_id,
      account_number,
      balance,
      funds_on_hold,
      currency,
      debit_card_number,
      debit_card_expiry,
      debit_card_cvv,
    }
  }
  
}

module.exports = {
  getAccountByUserID,
  createAccount
}
