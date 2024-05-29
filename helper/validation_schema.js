const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required()
})

const authSchemaLogin = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required()
})

const categoryValidation = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().min(5).required(),
    description: Joi.string().required()
})

module.exports = {
    authSchema,authSchemaLogin,categoryValidation
}