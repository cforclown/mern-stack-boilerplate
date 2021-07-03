const joi = require("joi");

module.exports = {
    create: joi.object({
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
    }),
    update: joi.object({
        _id: joi.string().allow(null).default(null),
        name: joi.string().required(),
        masterData: joi
            .object({
                view: joi.bool(),
                create: joi.bool(),
                update: joi.bool(),
                delete: joi.bool(),
            })
            .required(),
        user: joi
            .object({
                view: joi.bool(),
                create: joi.bool(),
                update: joi.bool(),
                delete: joi.bool(),
            })
            .required(),
    }),
};
