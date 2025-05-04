const db = require('../src/models/db.js'); // DB connection
const { getUserByEmail } = require('../src/models/user.model.js');

describe('Integration: getUserByEmail(email)', () => {
  const stmt = db.prepare('SELECT * FROM USERS');
  const validUser = stmt.get();

  it('should return user object for valid email', () => {
    const user = getUserByEmail(validUser.email);
    expect(user).toBeDefined();
    expect(user.email).toBe(validUser.email);
    expect(user.lastName).toBe(validUser.lastName);
  });

  it('should return undefined for non-existent email', () => {
    const user = getUserByEmail('noone@example.com');
    expect(user).toBeUndefined();
  });

  it('should return undefined and not fail for SQL injection attempt', () => {
    const sqliEmail = "' OR 1=1 --";
    const user = getUserByEmail(sqliEmail);
    expect(user).toBeUndefined();
  });

  it('should not execute SQL injection payloads (DROP TABLE etc)', () => {
    const sqliEmail = "'; DROP TABLE USERS; --";
    const user = getUserByEmail(sqliEmail);
    expect(user).toBeUndefined();

    // Ensure table still exists
    const usercount = db.prepare('SELECT COUNT(*) AS count FROM USERS').get();
    expect(usercount.count).toBeGreaterThanOrEqual(0);
  });

  it('should return undefined for null or undefined input', () => {
    const result1 = getUserByEmail(null);
    const result2 = getUserByEmail(undefined);

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
  });
});
