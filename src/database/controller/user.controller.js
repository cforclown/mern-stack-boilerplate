const mongoose = require("mongoose");
const global = require('../../global/global');

const userModel = mongoose.model('User');
const roleController = require('./role.controller');
const avatarController = require('./avatar.controller');

exports.authenticate = async function (username, password) {
    const passwordHash = await global.Hash(password)
    const user = await userModel.findOne({
                                    username: username,
                                    password: passwordHash
                                })
                                .select("-password")
                                .populate('role')
                                .exec();

    if (!user)
        return null

    const userData = { ...user.toObject() }
    delete userData.password
    
    return userData
}

exports.getUserList = async function () {
    const userList = await userModel.find({})
                                    .select('-password')
                                    .populate({
                                        path: "role",
                                        select: "_id nama",
                                        model: "Role",
                                    }).exec();

    return userList.map(user => user);
}
exports.findUser = async function (query) {
    const userList = await userModel.find({
                                        fullname: { $regex: query, $options: "i" },
                                    })
                                    .select('-password').populate({
                                        path: "role",
                                        select: "_id nama",
                                        model: "Role",
                                    });

    return userList.map(user => user);
};
exports.getUser = async function (userId) {
    if (!userId)
        throw global.ErrorBadRequest("User id not found");

    const user = await userModel.findById(userId).select('-password').populate('role').exec();
    if (!user)
        throw global.ErrorDataNotFound("User not found");
        
    return user;
}
exports.getUserPermissions = async function (userId) {
    if (!userId)
        throw global.ErrorBadRequest("User id not found");

    const user = await userModel.findById(userId).select('-password').populate('role').exec();
    if (!user)
        throw global.ErrorDataNotFound("User not found");

    return user.role;
}

exports.registerUser=async function (userData){
    if(!userData.username)
        return res.status(400).send(global.ErrorResponse("Username not found"));
    if(!userData.password)
        return res.status(400).send(global.ErrorResponse("Password not found"));
    if(!userData.confirmPassword)
        return res.status(400).send(global.ErrorResponse("Confirmation password not found"));
    if(userData.password!==userData.confirmPassword)
        return res.status(400).send(global.ErrorResponse("Confirmation password is incorrect"));
    if(!userData.email)
        return res.status(400).send(global.ErrorResponse("Email not found"));
    if(!validateEmail(userData.email))
        return res.status(400).send(global.ErrorResponse("Email not valid"));
    if(!userData.fullname)
        return res.status(400).send(global.ErrorResponse("Fullname not found"));

    if(!isUsernameAvailable(userData.username))
        return res.status(400).send(global.ErrorResponse("Username is taken"));

    const role = await roleController.getDefaultNormalRole();

    const userDoc = new userModel({
        ...userData,
        password: await global.Hash(userData.password),
        role: role._id,
    });
    await userDoc.save();
    
    return {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
    }
}
exports.createUser = async function (userData) {
    if(!userData.username)
        return res.status(400).send(global.ErrorResponse("Username not found"));
    if(!userData.email)
        return res.status(400).send(global.ErrorResponse("Email not found"));
    if(!validateEmail(userData.email))
        return res.status(400).send(global.ErrorResponse("Email not valid"));
    if(!userData.fullname)
        return res.status(400).send(global.ErrorResponse("Fullname not found"));

    if (!userData.role)
        throw global.ErrorBadRequest("Role id not found");
    const role = await roleController.getRole(userData.role);
    if (!role)
        throw global.ErrorBadRequest("Role id is invalid");

    const userDoc = new userModel({
        ...userData,
        password: await global.Hash(userData.username+"123"),
        role: role._id,
    });
    await userDoc.save();
    
    return {
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
        fullname: userDoc.fullname,
        role: userDoc.role,
    }
};

exports.updateUser = async function (userData) {
    if(!userData._id)
        throw global.ErrorBadRequest("User id not found");
    const user=await userModel.findById(userData._id);
    if(!user)
        throw global.ErrorDataNotFound("User not found");
    
    if(userData.role && !user.role.equals(userData.role)){
        const role = await roleController.getRole(userData.role);
        if (!role)
            throw global.ErrorBadRequest("Role id is invalid");
        user.role=userData.role;
    }

    //#region UPDATE USER INFO
    user.email=userData.email?userData.email:user.email;
    user.fullname=userData.fullname?userData.fullname:user.fullname;
    //#endregion

    await user.save();

    return userData;
};

exports.deleteUser = async function (userId) {
    const res = await userModel.deleteOne({ _id: userId }).exec();
    if (res.n === 0)
        throw global.ErrorDataNotFound("User not found");

    return userId;
};



//#region PROFILE STUFF
exports.getUserProfile = async function (userId) {
    if (!userId)
        throw global.ErrorBadRequest("User id not found");

    const user = await userModel.findById(userId).select('-password').populate('role').exec();
    if (!user)
        throw global.ErrorDataNotFound("User not found");
        
    return user;
}
exports.updateProfile = async function (userData) {
    if(!userData._id)
        throw global.ErrorBadRequest("User id not found");
    const user=await userModel.findById(userData._id);
    if(!user)
        throw global.ErrorDataNotFound("User not found");

    //#region UPDATE USER INFO
    user.email=userData.email?userData.email:user.email;
    user.fullname=userData.fullname?userData.fullname:user.fullname;
    //#endregion

    await user.save();

    return userData;
};
exports.isUsernameAvailable = async function (username, excludeUserId){
    const user = excludeUserId ? 
                await userModel.findOne({ "_id": {$ne: excludeUserId}, "username": username }) : 
                await userModel.findOne({ "username": username })
    if(user)
        return false;
    return true;
}
exports.changeUserUsername = async function (userData) {
    if(!userData._id)
        throw global.ErrorBadRequest("User id not found");
    if(!userData.username)
        throw global.ErrorBadRequest("New username not found");
    
    const user=await userModel.findById(userData._id);
    if(!user)
        throw global.ErrorDataNotFound("User not found");

    if(user.username===userData.username)
        return userData;
    const isUsernameAvailable=await exports.isUsernameAvailable(userData.username, user._id);
    if(!isUsernameAvailable)
        throw global.ErrorBadRequest("Username is taken");

    user.username=userData.username;

    await user.save();

    return userData;
};
exports.changeUserAvatar = async function (userId, avatarData) {
    if(!userId)
        throw global.ErrorBadRequest("User id not found");
    const user=await userModel.findById(userId);
    if(!user)
        throw global.ErrorDataNotFound("User not found");
        
    if(user.avatar && (await avatarController.isExist(user.avatar))){
        const avatarId=await avatarController.updateAvatar({
            ...avatarData,
            _id: user.avatar,
        })
        user.avatar=avatarId;
    }
    else{
        const avatarId=await avatarController.insertAvatar(avatarData);
        user.avatar=avatarId;
    }
    await user.save();

    return user.avatar.toString();
};
//#endregion



function validateEmail(email){
    const emailre = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    
    if (!email)         return false;
    if(email.length>254)return false;

    const isValid = emailre.test(email);
    if(!isValid)
        return false;

    // Further checking of some things regex can't handle
    const parts = email.split("@");
    if(parts[0].length>64)
        return false;

    const domainParts = parts[1].split(".");
    if(domainParts.some((part) => part.length>63))
        return false;

    return true;
}