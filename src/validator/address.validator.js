
function validateAddress(address){
  if(typeof address === 'undefined'){
    return "Address must not be empty"
  }  
  // - must be a string
  if(typeof address !== 'string'){
    return "Address must be a string"
  }  
  const address_regex = /^[a-zA-Z0-9\s,'\-#\.]{10,255}$/;
  if(!address_regex.test(address)){
    return "Address contains invalid characters"
  }

  return null
  
}

module.exports = validateAddress;
