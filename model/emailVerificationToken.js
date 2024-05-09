const mongoose =require('mongoose')

const mailVerificationTokenSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
        unique: true
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expire: 3600
    }
})


module.exports = mongoose.model('mailVerificationTokenSchema',mailVerificationTokenSchema)