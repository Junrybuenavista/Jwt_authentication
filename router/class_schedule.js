const express = require('express')
const router = express.Router()
const CourseAndGrade = require('../model/class_schedule')
const {ClassScheduleValidation} = require('../helper/validation_schema')
const httpError = require('http-errors')



router.post('/',async(req, res, next) => {

    try{
        const result = await ClassScheduleValidation.validateAsync(req.body)
        console.log(result)
        const isCourseAndGradeExist = await CourseAndGrade.findOne({name: result.name, userId: result.userId })
        if(isCourseAndGradeExist) throw httpError.Conflict(`${result.name} is already registered`)

        await new CourseAndGrade(result).save()
        res.status(201).send({message:'CourseAndGrade saved!'})

    }catch(error){
        console.log(error)
        next(error)
    }
 
 })

 router.post('/list',async(req, res) => {
    try{ 
          console.log(req.body.userId)
          const users = await CourseAndGrade.find({userId: req.body.userId}).select('name description _id');
         
          res.json(users)
    }catch(err){
           res.status(500).json({message: err.message})
    }
 })

 router.post('/delete/:id',async(req, res) => {
    try{ 
         const deleteCourseAndGrade = await CourseAndGrade.findOne({_id: req.params.id})
         if(!CourseAndGrade) return res.status(400).send({message:'cant find CourseAndGrade'})

         await deleteCourseAndGrade.deleteOne()
         res.send({message:'successffuly deleted'})
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })



 module.exports = router