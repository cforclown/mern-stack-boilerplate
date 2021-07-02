const joi = require("joi");

module.exports = joi.object({
    _id: joi.string().allow(null).default(null),
    name: joi.string().required(),
    masterData: joi
        .object({
            view: joi.bool(),
            create: joi.bool(),
            update: joi.bool(),
            delete: joi.bool(),
        })
        .allow(null)
        .default({
            view: false,
            create: false,
            update: false,
            delete: false,
        }),
    user: joi
        .object({
            view: joi.bool(),
            create: joi.bool(),
            update: joi.bool(),
            delete: joi.bool(),
        })
        .allow(null)
        .default({
            view: false,
            create: false,
            update: false,
            delete: false,
        }),
    isDefaultNormal: joi.bool().allow(null).default(null),
    __v: joi.number().allow(null).default(null),
});
