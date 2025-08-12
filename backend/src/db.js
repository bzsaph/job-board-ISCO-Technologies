
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'jobboard.db');

function open() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return new sqlite3.Database(DB_PATH);
}

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


if (require.main === module) {
  require('dotenv').config();
  migrate();
}

module.exports = { open, migrate };
