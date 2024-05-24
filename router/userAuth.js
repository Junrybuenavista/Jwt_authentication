require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../model/user')
const httpError = require('http-errors')
const {authSchema,authSchemaLogin} = require('../helper/validation_schema')
const {signAccessToken,signRefreshToken,verifyRefreshToken} = require('../helper/jwt_helper')
const { verify } = require('jsonwebtoken')
const  verifyEmail = require('../helper/verifyEmail')
const emailVerificationToken = require('../model/emailVerificationToken')
const crypto = require('crypto')
const client = require('../helper/redisConnect')

router.get('/',async(req, res) => {
    res.send('welcome')
 })

 router.post('/login',async(req, res,next) => {
    try{
        
        const result = await authSchemaLogin.validateAsync(req.body)

        console.log(result)

        const user = await User.findOne({email: result.email})

        if(!user) throw httpError.NotFound(`This ${result.email} not found`)
        const isMatch = await user.checkPassword(result.password)
        if(!isMatch) throw httpError.Unauthorized('Invalid password!')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken,refreshToken, name:user.name, verified:user.verified})

        
    }catch(error){
        if(error.isJoi===true)return next(httpError.BadRequest('Invalid username/password'))
        next(error)
    }
 })

router.post('/register',async(req, res, next) => {

    try{
        //const {name,email,password} = req.body
        //if(!email || !password) throw httpError.BadRequest()

        const result = await authSchema.validateAsync(req.body)
        const isEmailExist = await User.findOne({email: result.email})
        if(isEmailExist) throw httpError.Conflict(`${result.email} is already registered`)
        const user = new User(result)

        const saveUser = await user.save()
        const token = await emailVerificationToken({
            userId: user.id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()
        const url = `${process.env.EMAIL_BASEURL}auth/${user.id}/verify/${token.token}`

        await verifyEmail(user.email,'Verify email',url)
        
        res.status(201).send({message:'Verification code sent to your email'})

    }catch(error){
      console.log(error)  
      if(error.isJoi===true)error.status=422
      next(error) 
    }
    
 })

router.post('/refresh-token',async(req, res, next) => {
    try{
        const refToken = req.body.refreshToken
        if(!refToken) throw httpError.BadRequest()
        const userId = await verifyRefreshToken(refToken)

        const accessToken = await signAccessToken(userId)
        const refreshToken = await signRefreshToken(userId)
        res.send({accessToken,refreshToken})
    }catch(error){
       next(error) 
    }
 })

router.post('/logout',async(req, res,next) => {
    try{
        const {refreshToken} = req.body
        if(!refreshToken)throw httpError.createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        await client.DEL(userId,(err, val)=>{
            if(err){
                console.log(err.message)
                throw httpError.InternalServerError()
            }
            console.log(val)
        })

        res.send({message:'logout sucessfully'})
    }catch(error){
        next(error)
    }
 })


 router.get('/:id/verify/:token', async (req,res)=>{
    try{
       
        const user = await User.findOne({_id: req.params.id})
        if(!user) return res.status(400).send({message:'Invalid link1'})

        console.log(user.id)

        const token = await emailVerificationToken.findOne({
            userId: user.id,
            token: req.params.token
        })
        if(!token) return res.status(400).send({message:'Invalid link2'})

        await User.updateOne({id:user.id,verified:true})
        await token.deleteOne()

        res.status(200).send({message:'Email verified successfully'})
    }catch(error){

    }
 })

module.exports = router