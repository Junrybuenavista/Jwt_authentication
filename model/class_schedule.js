const mongoose =require('mongoose')

const classScheduleSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref: 'user',
    },
    name:{
        type: String,
    },
    scheduleDay:{
        type: Array
    },
    scheduleTimeFrom:{
        type: Date
    },
    scheduleTimeTo:{
        type: Date
    },
    description:{
        type: String,      
    }
    
})

module.exports = mongoose.model('ClassSchedule',classScheduleSchema)