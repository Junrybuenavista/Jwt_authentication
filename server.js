require('dotenv').config()
const express =  require('express')
const morgan = require('morgan')
const httpError = require('http-errors')
require('./helper/mongodb')
const {verifyAccessToken} = require('./helper/jwt_helper')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(morgan('dev'))
app.listen(process.env.PORT)
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/',verifyAccessToken,async(req, res) => {
    console.log(req.headers['authorization'])
    res.send('welcome ')
 })

app.use(function(req,res,next){setTimeout(next,1000)});

const usersRouter = require('./router/userAuth')
app.use('/auth',usersRouter)

const StudentRouter = require('./router/StudentRouter')
//app.use('/product',verifyAccessToken,CategoryRouter)
app.use('/student',StudentRouter)

const courseAndGradeRouter = require('./router/courseAndGradeRouter')
//app.use('/product',verifyAccessToken,CategoryRouter)
app.use('/course_and_grade',verifyAccessToken, courseAndGradeRouter)

//-----------------------error handler-----------------------------


app.use(async(req, res,next) => {
    next(httpError.NotFound('This link does not exist'))
})

app.use(async(err, req, res, next) => {
    res.status(err.status||500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    })
})