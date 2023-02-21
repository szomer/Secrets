// Modules
const bcrypt = require('bcrypt'); // encryption -> salt + hashing

const saltRounds = 10; // how many times using salt and encrypt

// Encrypt password
async function encrypt(pass) {
  console.log('Hashing password..');
  try {
    const hash = await bcrypt.hash(pass, saltRounds);
    return hash;
  } catch (err) {
    console.log(err);
  }
}

// Compare password
async function compareEncrypt(password, hash) {
  console.log('Comparing Hashed passwords..');
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { encrypt, compareEncrypt };
