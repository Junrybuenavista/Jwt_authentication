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

 router.get('/category/list',async(req, res) => {
    try{ 
         const users = await Category.find({}).select('name description -_id');
         
         res.json(users)
    }catch(err){
         res.status(500).json({message: err.message})
    }
 })



 module.exports = router