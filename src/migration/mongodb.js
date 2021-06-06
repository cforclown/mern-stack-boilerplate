module.exports = {
    role: [
        {
            name: "Admin",
            user: {
                view: true,
                create: true,
                update: true,
                delete: true,
            },
            masterData: {
                view: true,
                create: true,
                update: true,
                delete: true,
            },
            isDefaultNormal: false,
        },
        {
            name: "Normal",
            user: {
                view: true,
                create: false,
                update: false,
                delete: false,
            },
            masterData: {
                view: true,
                create: false,
                update: false,
                delete: false,
            },
            isDefaultNormal: true,
        },
    ],
};
