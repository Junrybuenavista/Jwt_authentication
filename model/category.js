const mongoose =require('mongoose')

const categorySchema = new mongoose.Schema({

    userId:{
        type: String,
        required: true,
        ref: 'user',
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String      
    }
})

module.exports = mongoose.model('Category',categorySchema)