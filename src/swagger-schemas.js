module.exports = {
    registerData: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
            email: { type: "string" },
            fullname: { type: "string" },
        },
    },
    loginData: {
        type: "object",
        properties: {
            username: { type: "string" },
            password: { type: "string" },
        },
    },
    refreshToken: {
        type: "object",
        properties: {
            refreshToken: { type: "string" },
        },
    },
    userData: {
        type: "object",
        properties: {
            username: { type: "string" },
            email: { type: "string" },
            fullname: { type: "string" },
            role: { type: "string" },
        },
    },

    avatarData: {
        type: "object",
        properties: {
            _id: { type: "string" },
            filename: { type: "string" },
            file: { type: "string" },
        },
    },
    roleData: {
        type: "object",
        properties: {
            name: { type: "string" },
            masterData: {
                type: "object",
                properties: {
                    view: { type: "boolean", default: false },
                    create: { type: "boolean", default: false },
                    update: { type: "boolean", default: false },
                    delete: { type: "boolean", default: false },
                },
            },
            user: {
                type: "object",
                properties: {
                    view: { type: "boolean", default: true },
                    create: { type: "boolean", default: false },
                    update: { type: "boolean", default: false },
                    delete: { type: "boolean", default: false },
                },
            },
        },
    },
};
