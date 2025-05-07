const { parseISO, subYears, isAfter } = require("date-fns");
const { getUserByEmail, createUser } = require("../models/user.model.js")
const { createAccount } = require("../models/account.model.js")
const { normalizeName } = require("../validator/name.validator.js");
const { generateSessionID, createSession } = require("../lib/sessionStore.js");

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
      password: _password,
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

module.exports = {
  openAccountController
}
