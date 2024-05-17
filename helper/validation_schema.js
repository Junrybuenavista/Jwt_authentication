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

module.exports = {
    authSchema,authSchemaLogin
}