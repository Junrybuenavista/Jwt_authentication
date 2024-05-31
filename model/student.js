const mongoose =require('mongoose')

const studentSchema = new mongoose.Schema({

    userId:{
        type: String,
        ref: 'user',
    },
    first_name:{
        type: String,
    },
    last_name:{
        type: String,      
    },
    middle_name:{
        type: String,    
    },
    age:{
        type: Number,     
    },
    gender:{
        type: String,     
    },
    address:{
        type: String,   
    },
    coursegradeId:{
        type: String,
    }
})

module.exports = mongoose.model('Student',studentSchema)