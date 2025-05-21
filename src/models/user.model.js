const db = require('./db.js');
const { format } = require('date-fns');

function getUserByEmail(email){
  const stmt = db.prepare('SELECT * FROM USERS WHERE email=@_email');
  const user = stmt.get({_email: email});
  return user;
}

function createUser(userDetails){
  const user_email = userDetails.email
  const user_password_hash = userDetails.password
  const user_firstname = userDetails.firstname
  const user_middlename = userDetails.middlename
  const user_lastname = userDetails.lastname
  const user_date_of_birth = format(userDetails.dateOfBirth, 'yyyy-MM-dd')
  const user_nationality = userDetails.nationality
  const user_address = userDetails.address
  const user_id_type = userDetails.idtype
  const user_valid_id = userDetails.validID

  const stmt = db.prepare(`INSERT INTO USERS(email, password_hash, firstname, middlename, lastname, date_of_birth, nationality, address, id_type, valid_id) VALUES(@_email, @_password_hash, @_firstname, @_middlename, @_lastname, @_date_of_birth, @_nationality, @_address, @_id_type, @_valid_id) `)
    
  const info = stmt.run({
    _email: user_email,
    _password_hash: user_password_hash,
    _firstname: user_firstname,
    _middlename: user_middlename,
    _lastname: user_lastname,
    _date_of_birth: user_date_of_birth,
    _nationality: user_nationality,
    _address: user_address,
    _id_type: user_id_type,
    _valid_id: user_valid_id,
  })
  
  if (info.changes === 0){
    throw Error("User Creation Failed, no changes were made to the database.")
  } else {
    return info.lastInsertRowid
  }
}

function getName(user_id){
  const stmt = db.prepare(`SELECT firstname, middlename, lastname FROM USERS WHERE user_id=@_user_id;`)
  const name = stmt.get({
    _user_id: user_id,
  })
  return name;
}

module.exports = {
  getUserByEmail,
  createUser,
  getName
}
