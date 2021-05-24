const mongoose = require("mongoose");
const global = require('../../global/global');

const avatarModel = mongoose.model('Avatar');

exports.getAvatar = async function (avatarId) {
    if (!avatarId)
        throw global.ErrorBadRequest("Avatar id not found");

    const avatar = await avatarModel.findById(avatarId).exec();
    if (!avatar)
        throw global.ErrorDataNotFound("Avatar not found");
        
    return avatar;
}
exports.isExist = async function (avatarId) {
    if (!avatarId)
        throw global.ErrorBadRequest("Avatar id not found");

    const avatar = await avatarModel.findById(avatarId).select("filename").exec();
    if (!avatar)
        return false;
    return true;
}
exports.insertAvatar = async function (avatarData) {
    if(!avatarData)
        throw global.ErrorBadRequest("Avatar data not found");
    if(!avatarData.filename)
        throw global.ErrorBadRequest("Avatar filename not found");
    if(!avatarData.file)
        throw global.ErrorBadRequest("Avatar file not found");

    const prefix = avatarData.file.split(";base64,").length > 0 ? 
                    avatarData.file.split(";base64,")[0]
                    : null;
    const ext = avatarData.file.match(/[^:/]\w+(?=;|,)/);
    const avatarDoc = new avatarModel({
        filename: avatarData.filename,
        file: avatarData.file,
        prefix,
        ext: ext && ext.length>0 ? ext[0] : null,
    });
    await avatarDoc.save();

    return avatarDoc._id;
};
exports.updateAvatar = async function (avatarData) {
    if(!avatarData)
        throw global.ErrorBadRequest("Avatar data not found");
    if(!avatarData._id)
        throw global.ErrorBadRequest("Avatar id not found");
    if(!avatarData.filename)
        throw global.ErrorBadRequest("Avatar filename not found");
    if(!avatarData.file)
        throw global.ErrorBadRequest("Avatar file not found");

    await exports.deleteAvatar(avatarData._id);
    const avatarId=await exports.insertAvatar(avatarData);
    return avatarId;

    // const avatar=await avatarModel.findById(avatarData._id);
    // if(!avatar)
    //     throw global.ErrorDataNotFound("Avatar not found");

    // //#region UPDATE USER INFO
    // const prefix = avatarData.file.split(";base64,").length > 0 ? 
    //                 avatarData.file.split(";base64,")[0]
    //                 : null;
    // const ext = avatarData.file.match(/[^:/]\w+(?=;|,)/)[0];

    // avatar.filename=avatarData.filename;
    // avatar.file=avatarData.file;
    // avatar.prefix=prefix;
    // avatar.ext=ext;
    // //#endregion

    // await avatar.save();

    // return avatar._id;
};
exports.deleteAvatar = async function (avatarId) {
    const res = await avatarModel.deleteOne({ _id: avatarId }).exec();
    if (res.n === 0)
        throw global.ErrorDataNotFound("Avatar not found");

    return avatarId;
};