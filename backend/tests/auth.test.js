
const request = require('supertest');
const app = require('../src/app');
const { migrate } = require('../src/db');

beforeAll(() => { process.env.JWT_SECRET = 'testsecret'; migrate(); });

describe('Auth endpoints', () => {
  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({ email:'t1@example.com', password:'password', firstName:'T' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('logs in', async () => {
    const res = await request(app).post('/api/auth/login').send({ email:'t1@example.com', password:'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
