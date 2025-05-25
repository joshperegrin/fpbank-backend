const { randomUUID } = require('crypto');

const sessionStore = new Map();

const sessionDuration = parseInt(process.env.SESSION_DURATION) || (20 * 60 * 1000);

function createSession(sessionID, user_id){
  const createdAt = Date.now();
  const expiration = createdAt + sessionDuration;
  sessionStore.set(sessionID, {user_id, createdAt, expiration});
  return {
    sessionID,
    user_id,
    createdAt,
    expiration
  }
}

function generateSessionID(){
  let sessionID;
  do{
    sessionID = randomUUID();
  } while(sessionStore.has(sessionID))
  return sessionID;
}

function getSessionByID(sessionID){
  const session = sessionStore.get(sessionID);
  if (typeof session === "undefined" ){
    return undefined;
  }
  
  const {user_id, createdAt, expiration} = session;

  return {
    sessionID,
    user_id,
    createdAt,
    expiration
  }
}

function getSessionByUserID(user_id){
  for (const [sessionID, sessionData] of sessionStore.entries()){
    if (sessionData.user_id === user_id){
      return { sessionID, sessionData };
    }
  }
  return undefined;
}

function refreshSession(sessionID){
  const session = sessionStore.get(sessionID);
  if (typeof session === "undefined"){
    return false;
  }

  session.expiration = Date.now() + sessionDuration;
  return true;
}

function deleteSession(sessionID){
  return sessionStore.delete(sessionID);
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [sessionID, sessionData] of sessionStore.entries()) {
    if (sessionData.expiration <= now) {
      sessionStore.delete(sessionID);
      console.log(`Session ${sessionID} expired and was deleted.`);
    }
  }
}

setInterval(cleanupExpiredSessions, (60 * 1000));

module.exports = {
  createSession,
  generateSessionID,
  getSessionByID,
  getSessionByUserID,
  refreshSession,
  deleteSession
};
