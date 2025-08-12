
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

async function hashPass(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}
async function compare(plain, hash) {
  return bcrypt.compare(plain, hash);
}
module.exports = { hashPass, compare };
