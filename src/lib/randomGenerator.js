
function generateRandomReferenceNumber(){
  const number = Math.floor(Math.random() * 1e10);
  const numberString = number.toString().padStart(10, 0)
  return numberString
}


module.exports = {
  generateRandomReferenceNumber
}
