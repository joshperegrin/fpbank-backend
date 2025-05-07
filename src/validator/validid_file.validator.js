
function validateValidIDFile(validid){

  if(!validid){
    return "Valid ID file must be provided."
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(validid.mimetype)) {
    return "Invalid file type. Only JPG and PNG files are allowed."
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (validid.size > MAX_FILE_SIZE) {
    return "File too large. Maximum size allowed is 5MB."
  }
  
  return null
}

module.exports = validateValidIDFile;
