const express = require('express')
const router = express.Router()
const User = require('../model/user')
const httpError = require('http-errors')
const {authSchema} = require('../helper/validation_schema')
const {signAccessToken,signRefreshToken,verifyRefreshToken} = require('../helper/jwt_helper')
const { verify } = require('jsonwebtoken')




router.get('/',async(req, res) => {
    res.send('welcome')
 })

 router.post('/login',async(req, res,next) => {
    try{

        const result = await authSchema.validateAsync(req.body)
        const user = await User.findOne({email: result.email})

        if(!user) throw httpError.NotFound(`This ${result.email} not found`)
        const isMatch = await user.checkPassword(result.password)
        if(!isMatch) throw httpError.Unauthorized('Invalid password!')

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken,refreshToken})

        
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
        const accessToken = await signAccessToken(saveUser.id)
        const refreshToken = await signRefreshToken(user.id)
        res.send({accessToken,refreshToken})

    }catch(error){
      if(error.isJoi===true)error.status=422
      next(error) 
    }
    
 })

router.post('/refresh-token',async(req, res, next) => {
    try{
        const {refreshToken} = req.body
        if(!refreshToken) throw httpError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)

        const accessToken = await signAccessToken(userId)
        const refreshToken2 = await signRefreshToken(userId)
        res.send({accessToken,refreshToken2})
    }catch(error){
       next(error) 
    }
 })

router.delete('/logout',async(req, res) => {
    res.send('logout')
 })


module.exports = router