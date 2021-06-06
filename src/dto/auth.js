const joi = require("joi");

module.exports = {
    register: joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        fullname: joi.string().min(1).required(),
        password: joi.string().min(1).required(),
        confirmPassword: joi.string().min(1).required(),
    }),
    login: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
    }),
    refreshToken: joi.object({
        refreshToken: joi.string().required(),
    }),
};
