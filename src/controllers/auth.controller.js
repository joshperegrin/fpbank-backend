const { getUserByEmail } = require("../models/user.model.js")
const { getAccountByUserID } = require("../models/account.model.js")
const { createSession, getSessionByUserID, deleteSession, generateSessionID } = require("../lib/sessionStore.js");

function authLoginController(req, res){

  let user;
  let account;
  try{
    user = getUserByEmail(req.body.email);
    console.log(user)
  }catch(e){
    console.error(e)    
    return res.status(500).json({ message: "Internal Server Error" });
  }

  // check if user with specified email exist
  if(typeof user === "undefined"){
    return res.status(400).json({ message: "Email is not a registered account" });
  }
  
  // check password against stored hashed password
  if(req.body.password !== user.password_hash) {
    return res.status(401).json({ message: "Incorrect Password"});
  }

  try {
    account = getAccountByUserID(user.user_id);
    console.log(account)
  }catch(e){
    console.error(e)
    return res.status(500).json({ message: "Internal Server Error" });
  }

  let session;
  let sessionID;
  const existingSession = getSessionByUserID(user.user_id);

  // check if there is an existing session
  if(typeof existingSession !== "undefined"){
    deleteSession(existingSession.sessionID); // invalidate existing session
  }

  // create new session
  sessionID = generateSessionID();
  session = createSession(sessionID, user.user_id)

  return res.status(201).json({
    sessionID,
    accountInfo: {
      accountNumber: account.account_number,
      debitCardNumber: account.debit_card_number,
      debitCardExpiry: account.debit_card_expiry,
      debitCardCvv: account.debit_card_cvv
    },
    user: {
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
    }
  });
  // check if user has existing session
  // create new session
}

module.exports = {
  authLoginController
}
