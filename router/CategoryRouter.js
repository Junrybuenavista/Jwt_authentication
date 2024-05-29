const express = require('express')
const router = express.Router()
const Category = require('../model/category')
const {categoryValidation} = require('../helper/validation_schema')
const httpError = require('http-errors')



router.post('/category',async(req, res, next) => {

    try{
        const result = await categoryValidation.validateAsync(req.body)
        const isCategoryExist = await Category.findOne({name: result.name})
        if(isCategoryExist) throw (httpError.Conflict(`${result.name} is already registered`))

        const category = new Category(result)
        await category.save()

        res.status(201).send({message:'Category saved!'})

    }catch(error){
        console.log(error)
        next(error)
    }
 
 })

 router.post('/category/list',async(req, res) => {
    try{ 
          console.log(req.body.userId)
         const users = await Category.find({userId: req.body.userId}).select('name description _id');
         
         res.json(users)
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })

 router.post('/delete/:id',async(req, res) => {
    try{ 
         const category = await Category.findOne({_id: req.params.id})
         if(!category) return res.status(400).send({message:'cant find category'})

         await category.deleteOne()
         res.send({message:'succeffuly deleted'})
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })



 module.exports = router