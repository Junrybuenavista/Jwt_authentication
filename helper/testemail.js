require('dotenv').config()
const  verifyEmail = require('./verifyEmail')

async function ee(){
    await verifyEmail('junrybuenavista@yahoo.com','Verify email','Test message')
}
ee()    
//console.log('ff')