
function validatePassword(password){
  if(typeof password === 'undefined'){
    return 'Password must be provided.'
  }
  // - must be a string
  if(typeof password !== 'string'){
    return 'Password must be provided.'
  }
  // - must have proper format
  const password_regex = /^[a-zA-Z0-9!@#$%^&*()\-_=+<>?]{8,20}$/;
  if(!password_regex.test(password)){
    return "Invalid Password Format"
  }
  return null
}

module.exports = validatePassword 
