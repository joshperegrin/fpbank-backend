const { deleteSession, getSessionByID } = require("../lib/sessionStore.js")
function authMiddleware(req, res, next){
	const sessionID = req.get('X-Session-ID');

  // VALIDATION CHECKS
  if (!sessionID) {
    return res.status(400).json({ message: 'Missing session ID'})
  }
  
  if (typeof sessionID !== 'string') {
    return res.status(400).json({ message: 'Invalid session ID type'})
  }

  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4Regex.test(sessionID)) {
    return res.status(400).json({ message:'Malformed session ID'});
  }

  const session = getSessionByID(sessionID)

  if(typeof session === 'undefined'){
    return res.status(401).json({ message: 'Session is non existent or expired'})
  }
  
  if(session.expiration < Date.now()){
    deleteSession(sessionID)
    return res.status(401).json({ message: 'Session expired' })
  }
  
  req.user_id = session.user_id
  
  next()
}

module.exports = authMiddleware;
