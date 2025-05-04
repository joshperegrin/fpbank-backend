const { getUserByEmail } = require("../models/user.model.js")


function authLoginController(req, res){

  let user;

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

  return res.status(200).json({ message: "Login Successful"});
  // check if user has existing session
  // create new session
}

module.exports = {
  authLoginController
}
