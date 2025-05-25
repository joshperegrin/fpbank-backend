
function validateName(name){
  if(typeof name === 'undefined'){
    return "Name must be provided."
  }

  // - must be a string
  if(typeof name !== 'string'){
    return "Name must be a string."
  }

  // - must contain only letters, hyphens, apostrophes
  // - max 100 characters
  if(name.length > 100){
    return "Name must be less than 100 characters"
  }
  return null
}


function normalizeName(name) {
  return name.replace(/([A-Za-z]+)(?=[-' ]?|$)/g, (match) => {
    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
  });
}

module.exports = {validateName,normalizeName}
