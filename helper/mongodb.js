const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open',() => console.log('Connected to database'))

mongoose.connection.on('connected',()=>{
    console.log('Monggose no problem')
})

mongoose.connection.on('error',()=>{
    console.log('Problem with mongoose')
})

mongoose.connection.on('disconnected',()=>{
    console.log('Monggose disconnecteds')
})

process.on('SIGINT',async ()=>{
    await mongoose.connection.close()
    process.exit(0)
})