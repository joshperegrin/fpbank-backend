
function validateDateString(dateString){
  if(typeof dateString === 'undefined'){
    return "Date of Birth must not be empty"
  }
  if(typeof dateString !== 'string'){
    return "Date of Birth should be of type String"
  }
  // - must have valid format ISO 8601
  const dateformat_regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if(!dateformat_regex.test(dateString)){
    return "Date of Birth has wrong format (YYYY-MM-DD)"
  }
  return null
}

module.exports = validateDateString
