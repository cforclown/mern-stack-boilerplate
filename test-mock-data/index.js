const mongoose = require("mongoose");

const roles = [
    {
        _id: mongoose.Types.ObjectId(),
        name: "Admin",
        user: { view: true, create: true, update: true, delete: true },
        masterData: { view: true, create: true, update: true, delete: true },
        isDefaultNormal: false,
    },
    {
        _id: mongoose.Types.ObjectId(),
        name: "Normal",
        user: { view: true, create: false, update: false, delete: false },
        masterData: { view: true, create: false, update: false, delete: false },
        isDefaultNormal: true,
    },
];
const avatars = [
    {
        _id: mongoose.Types.ObjectId(),
        filename: "avatar.jpeg",
        file: "data:image/jpeg;base64,haha",
        prefix: "data:image/jpeg;base64,haha".split(";base64,")[0],
        ext: "data:image/jpeg;base64,haha".match(/[^:/]\w+(?=;|,)/)[0],
    },
];
const users = [
    {
        _id: mongoose.Types.ObjectId(),
        username: "admin",
        password: "99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8", // root
        email: "admin@mail.com",
        fullname: "Admin",
        avatar: avatars[0]._id,
        role: roles[0]._id,
    },
    {
        _id: mongoose.Types.ObjectId(),
        username: "normal",
        password: "99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8", // root
        email: "normal@mail.com",
        fullname: "Normal",
        avatar: avatars[0]._id,
        role: roles[1]._id,
    },
];

module.exports = {
    roles,
    avatars,
    users,
};
