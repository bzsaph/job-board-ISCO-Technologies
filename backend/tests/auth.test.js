const request = require('supertest');
const app = require('../src/app');
const { open } = require('../src/db');

// Async helpers (same as in controller)
const runAsync = (db, sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  const db = open();

  // Clean users table before tests
  await runAsync(db, 'DELETE FROM users');
  db.close();
});

describe('Auth API', () => {
  const testUser = {
    email: 'user1@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  };

  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('prevents registering with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email already exists');
  });

  it('fails registration with invalid input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bademail', password: '123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('fails login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('fails login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noone@example.com', password: 'password' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
