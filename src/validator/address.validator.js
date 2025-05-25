
function validateAddress(address){
  if(typeof address === 'undefined'){
    return "Address must not be empty"
  }  
  // - must be a string
  if(typeof address !== 'string'){
    return "Address must be a string"
  }  

  return null
  
}

module.exports = validateAddress;
