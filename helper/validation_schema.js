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

const StudentValidation = Joi.object({
    userId: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    middle_name: Joi.string().required(),
    age: Joi.number().required(),
    address: Joi.string().required(),
    gender: Joi.string().required(),
    coursegradeId: Joi.string().required(),
})

const ClassScheduleValidation =  Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    scheduleDay: Joi.array().required(),
    scheduleTimeFrom: Joi.string().required(),
    scheduleTimeTo: Joi.string().required(),
})

module.exports = {
    authSchema,authSchemaLogin,StudentValidation, ClassScheduleValidation
}