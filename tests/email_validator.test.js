const request = require('supertest');
const express = require('express');
const validateEmail = require('../src/validator/email.validator.js'); // Make sure to import your middleware function

// Create an Express app and use the middleware for testing
const app = express();
app.use(express.json()); // for parsing application/json
app.post('/test-email', validateEmail, (req, res) => {
  res.status(200).json({ message: 'Email is valid' });
});

describe('Email Validation Middleware', () => {

  it('should return 400 if email is not provided', async () => {
    const response = await request(app)
      .post('/test-email')
      .send({}); // No email provided

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is required');
  });

  it('should return 400 if email is not a string', async () => {
    const response = await request(app)
      .post('/test-email')
      .send({ email: 12345 }); // Email is a number, not a string

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email must be a string');
  });

  it('should return 400 if email is too long', async () => {
    const longEmail = 'a'.repeat(321) + '@example.com'; // 321 characters
    const response = await request(app)
      .post('/test-email')
      .send({ email: longEmail });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is too long');
  });

  it('should return 400 if email format is invalid', async () => {
    const response = await request(app)
      .post('/test-email')
      .send({ email: 'invalid-email.com' }); // Invalid email format

    expect(response.status).toBe(400);
    expect(response.body.valid).toBe(false);
    expect(response.body.message).toBe('Invalid email format');
  });

  it('should pass validation if email is valid', async () => {
    const response = await request(app)
      .post('/test-email')
      .send({ email: 'valid.email@example.com' }); // Valid email format

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email is valid');
  });
});
