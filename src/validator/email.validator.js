
function validateEmail(email) {

  // Check if email is provided in the request body
  if (!email) {
    return "Email is required"
  }

  // Ensure the email is a string
  if (typeof email !== 'string') {
    return "Email must be a string"
  }

  // Check if the email length is within the allowed limit
  if (email.length > 320) {
    return "Email is too long"
  }

  // Regular expression to validate the email format
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Test if the email matches the regular expression
  if (!regex.test(email)) {
    return "Invalid email format"
  }

  return null
}

module.exports = validateEmail;
