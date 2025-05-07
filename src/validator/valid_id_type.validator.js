function validateValidIDType(idtype){
  if(typeof idtype === 'undefined'){
    return "Valid ID Type must be provided."
  }
  // - must be a string
  if(typeof idtype !== 'string'){
    return "Valid ID Type must be a string."
  }

  // - must match allowed types
  const valid_id_types = ["valid1", "valid2", "valid3", "valid4"]
  if(!valid_id_types.includes(idtype)){
    return "Valid ID Type is not an accepted type"
  }
  return null
}

module.exports = validateValidIDType
