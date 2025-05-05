const {
  createSession,
  generateSessionID,
  getSessionByID,
  getSessionByUserID,
  refreshSession,
  deleteSession
} = require('../src/lib/sessionStore.js'); // Adjust the path if needed

// Mock process.env for testing
process.env.SESSION_DURATION = '3600000'; // 1 hour in ms
process.env.SESSION_REFRESH = '1800000';   // 30 minutes in ms

describe('Session Management', () => {
  let sessionID;
  const userID = 'test-user-id';

  it('should generate a unique session ID', () => {
    sessionID = generateSessionID();
    expect(sessionID).toBeTruthy();
    expect(typeof sessionID).toBe('string');
  });

  it('should create a session', () => {
    createSession(sessionID, userID);
    const session = getSessionByID(sessionID);
    expect(session).toBeTruthy();
    expect(session.user_id).toBe(userID);
    expect(session.createdAt).toBeTruthy();
    expect(session.expiration).toBeTruthy();
  });

  it('should retrieve a session by ID', () => {
    const session = getSessionByID(sessionID);
    expect(session).toBeTruthy();
    expect(session.sessionID).toBe(sessionID);
    expect(session.user_id).toBe(userID);
  });

  it('should retrieve a session by User ID', () => {
    const sessionObj = getSessionByUserID(userID);
    expect(sessionObj).toBeTruthy();
    expect(sessionObj.sessionData.user_id).toBe(userID);
    expect(sessionObj.sessionID).toBe(sessionID);
  });

  it('should return undefined for non-existent session ID', () => {
    const nonExistentSession = getSessionByID('non-existent-id');
    expect(nonExistentSession).toBeUndefined();
  });

  it('should refresh a session', () => {
    const initialSession = getSessionByID(sessionID);
    const initialExpiration = initialSession.expiration;
    const refreshResult = refreshSession(sessionID);
    expect(refreshResult).toBe(true);
    const refreshedSession = getSessionByID(sessionID);
    expect(refreshedSession.expiration).toBeGreaterThan(initialExpiration);
  });

  it('should not refresh a non-existent session', () => {
    const refreshResult = refreshSession('non-existent-id');
    expect(refreshResult).toBe(false);
  });

  it('should delete a session', () => {
    const deleteResult = deleteSession(sessionID);
    expect(deleteResult).toBe(true);
    const deletedSession = getSessionByID(sessionID);
    expect(deletedSession).toBeUndefined();
  });
});
