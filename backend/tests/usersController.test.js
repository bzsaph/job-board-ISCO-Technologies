const request = require('supertest');
const app = require('../src/app');  // Your Express app with routes
const sqlite3 = require('sqlite3').verbose();
const dbModule = require('../src/db');

let db;

// Utility to run sqlite commands as promises
function runAsync(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

beforeAll(async () => {
  // Create in-memory DB
  db = new sqlite3.Database(':memory:');

  // Mock your db open function to use this in-memory db
  jest.spyOn(dbModule, 'open').mockImplementation(() => db);

  try {
    await runAsync(db, 'DROP TABLE IF EXISTS users');

    await runAsync(db, `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        firstName TEXT,
        lastName TEXT,
        role TEXT,
        createdAt DATETIME DEFAULT (datetime('now')),
        updatedAt DATETIME DEFAULT (datetime('now'))
      );
    `);

    await runAsync(db, `
      CREATE TRIGGER update_users_updatedAt
      AFTER UPDATE ON users
      FOR EACH ROW
      BEGIN
        UPDATE users SET updatedAt = datetime('now') WHERE id = OLD.id;
      END;
    `);

    console.log('Table and trigger recreated!');
  } catch (err) {
    console.error('Setup DB error:', err);
    throw err; // Fail tests if setup fails
  }
});

afterAll((done) => {
  // Close DB connection and restore mocks
  db.close((err) => {
    if (err) console.error('Error closing DB:', err);
    jest.restoreAllMocks();
    done();
  });
});

test('should create a user', async () => {
  const uniqueEmail = `test${Date.now()}@example.com`;

  const res = await request(app).post('/api/users').send({
    email: uniqueEmail,
    password: '123456',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
  });

  console.log('Response:', res.body);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('id');
  expect(res.body.email).toBe(uniqueEmail);
});
