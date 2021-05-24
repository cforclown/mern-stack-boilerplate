const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    avatar: {
        type:mongoose.Types.ObjectId,
        required:false,
        default: null,
    },
    role:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Role'
    }
});

exports.Schema = userSchema;
exports.Model = mongoose.model("User", userSchema, "user");
