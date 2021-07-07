const joi = require("joi");

module.exports = {
    search: joi.object({
        query: joi.string().required(),
        pagination: joi
            .object({
                page: joi.number().required(),
                limit: joi.number().required(),
                sort: joi
                    .object({
                        by: joi.string().valid("NAME"),
                        order: joi.string().valid("ASC", "DESC"),
                    })
                    .allow(null)
                    .default({
                        by: "NAME",
                        order: "ASC",
                    }),
            })
            .allow(null)
            .default({
                page: 1,
                limit: 10,
                sort: {
                    by: "NAME",
                    order: "ASC",
                },
            }),
    }),
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
