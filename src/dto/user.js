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
                        by: joi.string().valid("USERNAME", "FULLNAME").required(),
                        order: joi.string().valid("ASC", "DESC").required(),
                    })
                    .allow(null)
                    .default({
                        by: "USERNAME",
                        order: "ASC",
                    }),
            })
            .allow(null)
            .default({
                page: 1,
                limit: 10,
                sort: {
                    by: "USERNAME",
                    order: "ASC",
                },
            }),
    }),
    create: joi.object({
        _id: joi.string().allow(null).default(null),
        username: joi.string().required(),
        email: joi.string().email().required(),
        fullname: joi.string().min(1).required(),
        avatar: joi.string().allow(null).default(null),
        password: joi.string().allow(null).default(null),
        confirmPassword: joi.string().allow(null).default(null),
        role: joi.string().required(),
    }),
    update: joi.object({
        _id: joi.string().required(),
        role: joi.string().required(),
    }),
    editProfile: joi.object({
        email: joi.string().allow(null).default(null),
        fullname: joi.string().allow(null).default(null),
    }),
    changeAvatar: joi.object({
        filename: joi.string().required(),
        file: joi.string().required(),
    }),
    changeUsername: joi.object({
        username: joi.string().required(),
    }),
};
