const validateEmail = require("../validator/email.validator.js")
const validatePassword = require("../validator/password.validator.js")

function loginMiddleware(req, res, next){
  const email = req.body.email
  const password = req.body.password

  const emailValidationResults = validateEmail(email);
  if(emailValidationResults !== null){
    return res.status(400).json({ message: emailValidationResults })
  }
    
  const passwordValidationResults = validatePassword(password)
  if(emailValidationResults !== null){
    return res.status(400).json({ message: emailValidationResults })
  }

  next()

}

module.exports = loginMiddleware
