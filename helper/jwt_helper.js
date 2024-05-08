const JWT = require('jsonwebtoken')
const httpError = require('http-errors')
const client = require('./redisConnect')

module.exports = {
    signAccessToken: (userId) =>{
        return new Promise((resolve,reject) =>{
            const payload = {
            }
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options={
                expiresIn:'1m',
                issuer:'jhunta.com',
                audience: userId
            }
            JWT.sign(payload, secret, options,(err, token)=>{
                if(err){
                    console.log(err)
                    reject(httpError.InternalServerError('Internal server error'))
                } 
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next)=>{
        if(!req.headers['authorization']) return next(httpError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload) =>{
            if(err){
                if(err==='JsonWebTokenError'){
                    return next(httpError.Unauthorized())
                }else{
                    return next(httpError.Unauthorized(err.message))
                }
            }    
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) =>{
        return new Promise((resolve,reject) =>{
            const payload = {
            }
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options={
                expiresIn:'1y',
                issuer:'jhunta.com',
                audience: userId
            }
            JWT.sign(payload, secret, options,(err, token)=>{
                if(err){
                    console.log(err.message)
                    reject(httpError.InternalServerError())
                }
                try{
                    client.SET(userId,token)
                    //client.setex(userId, 365*24*60*60,token)
                    client.expire(userId,1000000)
                    resolve(token)   
                }catch(err){
                    console.log(err.message)
                }      
                
            })
        })
    },
    verifyRefreshToken:(refreshToken) =>{
        return new Promise((resolve, reject)=>{
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if(err) return reject(httpError.Unauthorized())
                const userId = payload.aud          

                   

                    try{
                     
                        const redisClientToken = client.GET(userId, (err, reply) =>{
                            if(err)console.log(err.message)
                            console.log(reply);
                            return reply
                        });   
                        console.log(redisClientToken+'mytoken')
                    if(refreshToken===redisClientToken){
                            resolve(userId)
                    } else reject(httpError.Unauthorized())
                    }catch(err){
                        console.log(err.message)
                        reject(httpError.InternalServerError())
                    }
                
                
            })
        })
    }
}