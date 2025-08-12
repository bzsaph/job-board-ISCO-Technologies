
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT,
  lastName TEXT,
  role TEXT CHECK(role IN ('admin','user')) NOT NULL DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  description TEXT,
  requirements TEXT,
  salary TEXT,
  createdBy INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jobId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  coverLetter TEXT,
  cvLink TEXT,
  status TEXT DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
