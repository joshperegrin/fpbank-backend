const db = require('./db.js');

function getUserByEmail(email){
  const stmt = db.prepare('SELECT * FROM USERS WHERE email=@_email');
  const user = stmt.get({_email: email});
  return user;
}

function createUser(user){
  return
}

module.exports = {
  getUserByEmail,
  createUser
}
