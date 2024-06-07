const mongoose =require('mongoose')

const classScheduleSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref: 'user',
    },
    className:{
        type: String,
    },
    scheduleDay:[{
        type: String
    }],
    scheduleTimeFrom:{
        type: String
    },
    scheduleTimeTo:{
        type: String
    },
    description:{
        type: String,      
    }
    
})

module.exports = mongoose.model('ClassSchedule',classScheduleSchema)