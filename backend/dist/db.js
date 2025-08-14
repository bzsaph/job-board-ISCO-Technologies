// src/db.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'jobboard.db');

function open() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return new sqlite3.Database(DB_PATH);
}

// ---------------- Migrate ----------------
function migrate() {
  return new Promise((resolve, reject) => {
    const db = open();
    const initSql = fs.readFileSync(path.join(__dirname, 'migrations', 'init.sql'), 'utf8');

    db.serialize(() => {
      db.exec(initSql, (err) => {
        if (err) {
          console.error('Migration error', err);
          db.close(() => reject(err));
        } else {
          console.log('Migrations applied');
          db.close(() => resolve());
        }
      });
    });
  });
}

// ---------------- Rollback ----------------
function rollback() {
  return new Promise((resolve, reject) => {
    const db = open();
    db.serialize(() => {
      db.exec(`
        DROP TABLE IF EXISTS applications;
        DROP TABLE IF EXISTS jobs;
        DROP TABLE IF EXISTS users;
      `, (err) => {
        if (err) {
          console.error('Rollback error', err);
          db.close(() => reject(err));
        } else {
          console.log('Rollback complete');
          db.close(() => resolve());
        }
      });
    });
  });
}

// ---------------- CLI Support ----------------
if (require.main === module) {
  require('dotenv').config();
  const command = process.argv[2];

  if (command === 'migrate') {
    migrate().catch(() => process.exit(1));
  } else if (command === 'rollback') {
    rollback().catch(() => process.exit(1));
  } else {
    console.log('Usage: node src/db.js [migrate|rollback]');
    process.exit(1);
  }
}

module.exports = { open, migrate, rollback };
