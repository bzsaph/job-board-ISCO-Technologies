// tests/jobsController.test.js
const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jobsController = require('../src/controllers/jobsController');
const dbModule = require('../src/db');

const app = express();
app.use(express.json());

// Route
app.post('/api/jobs', jobsController.createValidations, jobsController.createJob);
app.get('/api/jobs', jobsController.list);
app.get('/api/jobs/:id', jobsController.getOne);
app.put('/api/jobs/:id', jobsController.update);
app.delete('/api/jobs/:id', jobsController.remove);

let db;

beforeAll((done) => {
  db = new sqlite3.Database(':memory:');

  // Mock db.open() globally for the controller
  jest.spyOn(dbModule, 'open').mockImplementation(() => db);

  db.serialize(() => {
    db.run(`CREATE TABLE jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      description TEXT NOT NULL,
      requirements TEXT,
      salary TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );`, (err) => {
      if (err) return done(err);
      return done();
    });
  });
});

afterAll((done) => {
  db.close(done);
  jest.restoreAllMocks();
});

describe('Jobs API', () => {
  let jobId;

  test('should create a new job', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Frontend Developer',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'Build UI components',
      requirements: 'React, JavaScript',
      salary: '$100k'
    });

    console.log('Create Job Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Frontend Developer');

    jobId = res.body.id;
  });

  test('should list all jobs', async () => {
    const res = await request(app).get('/api/jobs');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should get one job by ID', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', jobId);
  });

  test('should update a job', async () => {
    const res = await request(app).put(`/api/jobs/${jobId}`).send({
      title: 'Updated Job Title',
      company: 'New Company',
      location: 'NYC',
      description: 'Updated description',
      requirements: 'Updated requirements',
      salary: '$120k'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Job Title');
  });

  test('should delete a job', async () => {
    const res = await request(app).delete(`/api/jobs/${jobId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test('should return 404 for deleted job', async () => {
    const res = await request(app).get(`/api/jobs/${jobId}`);

    expect(res.statusCode).toBe(404);
  });
});
