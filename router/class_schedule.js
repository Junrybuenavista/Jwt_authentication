const express = require('express')
const router = express.Router()
const ClassSchedule = require('../model/class_schedule')
const {ClassScheduleValidation} = require('../helper/validation_schema')
const httpError = require('http-errors')



router.post('/',async(req, res, next) => {

    try{
        const result = await ClassScheduleValidation.validateAsync(req.body)
        console.log(result)
        const isClassScheduleExist = await ClassSchedule.findOne({className: result.className, userId: result.userId })
        if(isClassScheduleExist) throw httpError.Conflict(`${result.className} is already registered`)

        await new ClassSchedule(result).save()
        res.status(201).send({message:'ClassSchedule saved!'})

    }catch(error){
        console.log(error)
        next(error)
    }
 
 })

 router.post('/list',async(req, res) => {
    try{ 
          console.log(req.body.userId)
          const ClassSched = await ClassSchedule.find({userId: req.body.userId}).select('className description _id scheduleDay scheduleTimeFrom scheduleTimeTo')
         
          res.status(201).send(ClassSched)
    }catch(err){
           res.status(500).json({message: err.message})
    }
 })

 router.post('/delete/:id',async(req, res) => {
    try{ 
         const deleteClassSchedule = await ClassSchedule.findOne({_id: req.params.id})
         if(!ClassSchedule) return res.status(400).send({message:'cant find ClassSchedule'})

         await deleteClassSchedule.deleteOne()
         res.send({message:'successffuly deleted'})
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })



 module.exports = router