const path = require('path')
const assert = require('chai').assert
const encrypt = require('../encrypt.js')
const decryptPromse = require('../decryptPromise.js')

const sampleData = 'sample data'
const samplePassword = '1234'
const _path = path.join(__dirname, '/data.enc')

function delay(interval) 
{
   return it('should delay', done => 
   {
      setTimeout(() => done(), interval)

   }).timeout(interval + 100) // The extra 100ms should guarantee the test will not fail due to exceeded timeout
}

describe('encryption test', ()=>{
    it('should encrypt the data', (done) =>{
        encrypt(sampleData, samplePassword, _path)
        done()   
    })

    delay(2000)

    it('should decrypt the data', function (){
        decryptPromse(_path, samplePassword)
        .then((data) =>{assert.equal(data, sampleData)})
        .catch((err) =>{console.log(err)})
    })
})