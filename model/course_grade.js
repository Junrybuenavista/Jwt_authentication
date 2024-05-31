const mongoose =require('mongoose')

const courseAndGradeSchema = new mongoose.Schema({

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

module.exports = mongoose.model('CourseAndGrade',courseAndGradeSchema)