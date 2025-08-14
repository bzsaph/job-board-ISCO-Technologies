
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const files = require('./routes/files');
const applicationsRoutes = require('./routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);


app.use('/api/files', files);


app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
