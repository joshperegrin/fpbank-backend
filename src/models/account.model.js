const db = require('./db.js');

function getAccountByUserID(user_id){
  const stmt = db.prepare('SELECT * FROM ACCOUNTS WHERE user_id=@_user_id');
  const account = stmt.get({_user_id: user_id});
  return account;
}

module.exports = {
  getAccountByUserID
}
