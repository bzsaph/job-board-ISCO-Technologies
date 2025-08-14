// app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const filesRoutes = require('./routes/files');
const applicationsRoutes = require('./routes/applications');
const usersRoutes = require('./routes/users');  // <- import users routes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/users', usersRoutes); // <- mount users routes here

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
