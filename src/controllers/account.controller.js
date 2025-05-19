const { parseISO, subYears, isAfter } = require("date-fns");
const { getUserByEmail, createUser } = require("../models/user.model.js")
const { createAccount, getAccountByUserID } = require("../models/account.model.js")
const { normalizeName } = require("../validator/name.validator.js");
const { generateSessionID, createSession } = require("../lib/sessionStore.js");
const { getTransactionsByUserID } = require("../models/transaction.model.js")
const { hashDJB2 } = require("../lib/hashing.js")

function openAccountController(req, res){

  const _email = req.body.email
  const _password = req.body.password
  let _firstname = req.body.firstname
  let _middlename = req.body.middlename
  let _lastname = req.body.lastname
  const _dateOfBirth_string = req.body.dateOfBirth
  const _nationality = req.body.nationality
  const _address = req.body.address
  const _idtype = req.body.idtype
  const _validid = req.file
  
  const _dateOfBirth = parseISO(_dateOfBirth_string); // Parse Date of Birth String to Date Object
  const eighteenYearsAgo = subYears(new Date(), 18); // Set Cutoff date for birth date
  
  // Date of Birth must not be in the future
  if(isAfter(_dateOfBirth, new Date())){
    return res.status(400).json({ message: "Date of Birth has wrong format" })
  }

  // Age must be above 18 years of age
  if(isAfter(_dateOfBirth, eighteenYearsAgo)){
    return res.status(400).json({ message: "User must be at least 18 years old."})
  }

  // Email should not exist in database
  try{
    if(typeof getUserByEmail(_email) !== 'undefined'){
      return res.status(400).json({ message: "Email is already registered with an account." })
    }    
  }catch(e){
    console.error(e)    
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
  // Normalize capitalization of names
  _firstname = normalizeName(_firstname)
  _middlename = normalizeName(_middlename)
  _lastname = normalizeName(_lastname)

  let user_id, account;

  // create user
  try{
    user_id = createUser({
      email: _email,
      password: hashDJB2(_password).toString(),
      firstname: _firstname,
      middlename: _middlename,
      lastname: _lastname,
      dateOfBirth: _dateOfBirth,
      nationality: _nationality,
      address: _address,
      idtype: _idtype,
      validIDPath  : _validid.path
    })
    
  }catch(e){
    return res.status(500).json({ message: "user creation failed", e})
    console.error(e)
  }
  
  // create account
  try{
    account = createAccount(user_id);
    
  }catch(e){
    return res.status(500).json({ message: "account creation failed", e})
    console.error(e)
  }

  // create new session
  const { sessionID } = createSession(generateSessionID(), user_id)
  
  return res.status(200).json({
    sessionID,
    accountInfo:{
      accountNumber: account.account_number,
      debitCardCVV: account.debit_card_cvv,
      debitCardExpiry: account.debit_card_expiry,
      debitCardNumber:account.debit_card_number
    },
    user:{
      firstname: _firstname,
      middlename: _middlename,
      lastname: _lastname,
    }
  })
}

function getBalanceController(req, res){
  const user_id = req.user_id
  console.log("USER ID:", user_id)
  let account;

  try{
    account = getAccountByUserID(user_id);
  }catch(e){
    return res.status(500).json({ e })
    console.error(e)
  }

  if(typeof account.balance === 'undefined'){
    return res.status(500).json({ message: 'Internal Server Error.' })
  }
  if(typeof account.funds_on_hold === 'undefined'){
    return res.status(500).json({ message: 'Internal Server Error.' })
  }
  if(typeof account.currency === 'undefined'){
    return res.status(500).json({ message: 'Internal Server Error.' })
  }
  
  return res.status(200).json({
    balance: account.balance,
    currency: account.currency,
    fundsonhold: account.funds_on_hold
  })
}

function getTransactionsController(req, res){
  const user_id = req.user_id;
  const limit = req.query.limit;
  const offset = (req.query.page - 1) * limit;
  let transaction_list;
  try{
    transaction_list = getTransactionsByUserID(user_id, limit, offset)
    console.log(transaction_list)
  }catch (e){
    return res.status(500).json({ e })
  }

  if (transaction_list.length === 0){
    return res.status(404).json({ message: "Transactions not Found" })
  }

  let parse_transaction_list = [];
  
  for(const _transaction of transaction_list){
    console.log(_transaction)
    const transaction = {
      transactionReferenceNumber: _transaction.transaction_reference_number,
      transactionName: _transaction.transaction_name,
      transactionDate: _transaction.transaction_date,
      transactionStatus: _transaction.transaction_status,
      transactionType: _transaction.transaction_type,
      transferAmount: _transaction.amount,
      entryType: _transaction.entry_type,
      note: _transaction.note,
      transactionDetails: JSON.parse(_transaction.transaction_details),
    }
    parse_transaction_list.push(transaction)
  }
    
  return res.status(200).json({ transactions: parse_transaction_list })
}

module.exports = {
  openAccountController,
  getBalanceController,
  getTransactionsController
}
