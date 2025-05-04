

/**
 * Middleware function to validate the email provided in the request body.
 * 
 * This function performs the following checks on the email:
 * 1. Ensures that an email is provided in the request body.
 * 2. Validates that the email is a string.
 * 3. Checks if the email length exceeds the maximum allowed length (320 characters).
 * 4. Validates the email format using a regular expression (RFC 5322 standard).
 * 
 * If any validation fails, a 400 status code with an appropriate error message is returned.
 * If all checks pass, the function calls the `next` middleware to continue the request processing.
 *
 * @param {Object} req - The request object, which contains the body with email data.
 * @param {Object} res - The response object, used to send back error messages and status codes.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * 
 * @returns {Object|undefined} - Returns a JSON error message and status code in case of failure, or calls `next()` to continue.
 */
function validateEmail(req, res, next) {
  const { email } = req.body;

  // Check if email is provided in the request body
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Ensure the email is a string
  if (typeof email !== 'string') {
    return res.status(400).json({ message: "Email must be a string" });
  }

  // Check if the email length is within the allowed limit
  if (email.length > 320) {
    return res.status(400).json({ message: "Email is too long" });
  }

  // Regular expression to validate the email format
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Test if the email matches the regular expression
  if (!regex.test(email)) {
    return res.status(400).json({ valid: false, message: "Invalid email format" });
  }

  next();
}

module.exports = validateEmail;
