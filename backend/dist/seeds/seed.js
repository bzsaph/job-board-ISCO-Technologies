
require('dotenv').config();
const { open } = require('../db');
const { hashPass } = require('../utils/hash');

async function seed() {
  const db = open();
  const adminEmail = 'admin@jobboard.com';
  const userEmail = 'user@jobboard.com';
  const adminPass = 'admin123';
  const userPass = 'user123';
  const hAdmin = await hashPass(adminPass);
  const hUser = await hashPass(userPass);

  db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err,row) => {
    if (!row) {
      db.run('INSERT INTO users (email,password,firstName,lastName,role) VALUES (?,?,?,?,?)', [adminEmail,hAdmin,'Admin','User','admin']);
      console.log('Seeded admin');
    } else console.log('Admin exists');
  });

  db.get('SELECT id FROM users WHERE email = ?', [userEmail], (err,row) => {
    if (!row) {
      db.run('INSERT INTO users (email,password,firstName,lastName,role) VALUES (?,?,?,?,?)', [userEmail,hUser,'Regular','User','user']);
      console.log('Seeded regular user');
    } else console.log('User exists');
  });

  // Optionally insert sample job
  db.run('INSERT INTO jobs (title,company,location,description,requirements,salary,createdBy) VALUES (?,?,?,?,?,?,?)',
    ['Backend Developer','Example Inc','Remote','Build APIs','Node.js,SQL','$50k-$70k', 1],
    function(err) {
      if (!err) console.log('Seeded sample job');
    });
  setTimeout(()=>db.close(), 500);
}

if (require.main === module) {
  seed();
}
module.exports = seed;
