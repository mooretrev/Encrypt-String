const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const {Transform} = require('stream')

const getCipherKey = require('./getCipherKey.js')

function decryptPromise(file, password) {
    return new Promise((res, rej) =>{
        // First, get the initialization vector from the file.
        const readInitVect = fs.createReadStream(file, { end: 15 })

        let initVect
        readInitVect.on('data', (chunk) => {
            initVect = chunk
        })

        // Once we’ve got the initialization vector, we can decrypt the file.
        readInitVect.on('close', () => {
            const cipherKey = getCipherKey(password)
            const readStream = fs.createReadStream(file, { start: 16 })
            const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect)
            const unzip = zlib.createUnzip()

            var result = ''

            unzip.on('data', (chunk) =>{
                result += chunk
            })

            unzip.on('end', (chunk) =>{
                res(result)
            })


            readStream
            .pipe(decipher)
            .pipe(unzip)

        })

    })
}

module.exports = decryptPromise

// decryptPromise(path.join(__dirname, '../tokens/accounts.json.enc'), "aPP1e;oG12")
// .then((data) =>{console.log(data)})
// .catch((err) =>{console.log(err)})