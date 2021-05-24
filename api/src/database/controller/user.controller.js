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
    const role = await roleController.getDefaultNormalRole();

    const userDoc = new userModel({
        ...userData,
        password: await global.Hash(userData.password),
        role: role._id,
    });
    await userDoc.save();
    
    return (await exports.getUser(userDoc._id))
}
exports.createUser = async function (userData) {
    if (!userData.role)
        throw global.ErrorBadRequest("Role id not found");
    const role = await roleController.getRole(userData.role);
    if (!role)
        throw global.ErrorBadRequest("Role id is invalid");

    const userDoc = new userModel({
        ...userData,
        password: await global.Hash(userData.password),
        role: role._id,
    });
    await userDoc.save();

    return {
        ...userData,
        _id: userDoc._id,
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
    user.email=userData.email;
    user.fullname=userData.fullname;
    //#endregion

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

exports.deleteUser = async function (userId) {
    const res = await userModel.deleteOne({ _id: userId }).exec();
    if (res.n === 0)
        throw global.ErrorDataNotFound("User not found");

    return userId;
};