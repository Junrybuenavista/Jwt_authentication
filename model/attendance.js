const mongoose =require('mongoose')

const attendanceSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref: 'user',
    },
    name:{
        type: String,
    },
    description:{
        type: String,      
    }
})

module.exports = mongoose.model('Attendance',attendanceSchema)