module.exports={
    registerData:{
        type: "object",
        properties:{
            registerData:{
                type: "object",
                properties:{
                    username: { type: "string" },
                    password: { type: "string" },
                    confirmPassword: { type: "string" },
                    fullname: { type: "string" },
                },
            }
        },
    },
    loginData:{
        type: "object",
        properties:{
            username: { type: "string" },
            password: { type: "string" },
        },
    },
    refreshToken:{
        type: "object",
        properties:{
            refreshToken: { type: "string" },
        },
    },
    userData:{
        type: "object",
        properties:{
            userData:{
                type: "object",
                properties:{
                    username: { type: "string", },
                    fullname: { type: "string", },
                    role:{ type:"string", }
                },
            }
        },
    },
    avatarData:{
        type: "object",
        properties:{
            avatarData:{
                type: "object",
                properties:{
                    filename: { type: "string", },
                    file: { type: "string", },
                },
            }
        },
    },
    roleData:{
        type: "object",
        properties:{
            roleData:{
                type: "object",
                properties:{
                    nama: { type: "string", },
                    masterData: {
                        type: "object",
                        properties:{
                            view:{ type: "boolean", default: false },
                            create:{ type: "boolean", default: false },
                            update:{ type: "boolean", default: false },
                            delete:{ type: "boolean", default: false },
                        }
                    },
                    user: {
                        type: "object",
                        properties:{
                            view:{ type: "boolean", default: true },
                            create:{ type: "boolean", default: false },
                            update:{ type: "boolean", default: false },
                            delete:{ type: "boolean", default: false },
                        }
                    },
                }
            }
        }
    },
}