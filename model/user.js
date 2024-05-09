const mongoose =require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true
        
    },
    password:{
        type: String,
        required: true
    },
    regDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    verified:{
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    try{
       const salt = await bcrypt.genSalt(10)
       const hashedPass = await bcrypt.hash(this.password,salt)
       this.password= hashedPass
       next()
    }catch(error){
        next(error)
    }

})

userSchema.methods.checkPassword = async function (password){
    try{
        return await bcrypt.compare(password, this.password)
    }catch(error){
        throw error
    }
}

module.exports = mongoose.model('User',userSchema)