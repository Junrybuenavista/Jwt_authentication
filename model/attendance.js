const mongoose =require('mongoose')

const attendanceSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref: 'user',
    },
    studentId:{
        type: String,
    },
    date:{
        type: date,      
    }
})

module.exports = mongoose.model('Attendance',attendanceSchema)