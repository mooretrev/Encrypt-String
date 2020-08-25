const encrypt = require('./encrypt.js')
const decryptPromise = require('./decryptPromise')

module.exports = {
    "encrypt": encrypt,
    "decrypt": decryptPromise
}