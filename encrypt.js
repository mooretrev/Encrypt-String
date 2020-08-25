const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const {Readable} = require('stream')

var data = Readable.from(["some data"])

const AppendInitVect = require('./appendInitVect.js');
const getCipherKey = require('./getCipherKey.js');

function encrypt(data, password, filePath) {
  // Generate a secure, pseudo random initialization vector.
  const initVect = crypto.randomBytes(16);
  
  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);
  const readStream = Readable.from([data])
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  // Create a write stream with a different file extension.
  const writeStream = fs.createWriteStream(filePath);
  
  readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writeStream);
}

module.exports = encrypt

// encrypt("some data", "aPP1e;oG12", path.join(__dirname, "../tokens/accounts.json.enc"))