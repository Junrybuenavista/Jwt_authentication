const express = require('express')
const router = express.Router()
const Student = require('../model/Student')
const {StudentValidation} = require('../helper/validation_schema')
const httpError = require('http-errors')



router.post('/',async(req, res, next) => {
    try{
        const result = await StudentValidation.validateAsync(req.body)
        const isStudentExist = await Student.findOne({first_name: result.first_name, last_name: result.last_name,userId: result.userId })
        if(isStudentExist) throw httpError.Conflict(`${result.first_name} is already registered`)

        const saveStudent = new Student(result)
        await saveStudent.save()

        res.status(201).send({message:'Student saved!'})

    }catch(error){
        console.log(error)
        next(error)
    }
 
 })

 router.post('/list',async(req, res) => {
    try{ 
          console.log(req.body.userId)
          const users = await Student.find({userId: req.body.userId}).select('first_name last_name middle_name age address _id');
         
          res.json(users)
    }catch(err){
           res.status(500).json({message: err.message})
    }
 })

 router.post('/delete/:id',async(req, res) => {
    try{ 
         const student = await Student.findOne({_id: req.params.id})
         if(!Student) return res.status(400).send({message:'cant find Student'})

         await student.deleteOne()
         res.send({message:'successffuly deleted'})
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })



 module.exports = router