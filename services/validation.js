const Joi = require('joi');

exports.validateProduct = (product) => {
    return productSchema.validate(product, { abortEarly: false });
}
exports.validateId = (id) => {
    return idSchema.validate(id);
}
exports.validateMember = (member) => {
    return memberSchema.validate(member, { abortEarly: false });
}



const productSchema = Joi.object({
    name: Joi.string().min(3).max(30).alphanum().required(),
    price: Joi.number().min(1).max(99999).required(),
    quantity: Joi.number().min(1).max(999).required()
});

const idSchema = Joi.string().length(24).hex();

const memberSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-z0-9A-Z]{8,20}$/).required(),
    r_password: Joi.ref('password')
});
