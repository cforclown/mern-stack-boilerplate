const mongoose = require("mongoose");
const global = require('../../global/global')



const roleModel = mongoose.model('Role')

exports.getRoleList = async function () {
    const roleList = await roleModel.find({})

    return roleList.map(role=>role)
}
exports.findRole = async function (query) {
    const roleList = await roleModel.find({
        name: { 
            $regex: query, 
            $options: "i" 
        },
    });

    return roleList.map(role =>role);
};
exports.getRole = async function (roleId) {
    const role = await roleModel.findById(roleId).exec();
    if(!role)
        return global.ErrorDataNotFound("Role not found")

    return role;
}
exports.getDefaultNormalRole = async function () {
    const role = await roleModel.findOne({isDefaultNormal: true}).exec();
    if(!role)
        return global.ErrorDataNotFound("Default normal role not found")

    return role;
}

exports.createRole = async function (roleData) {
    const roleDocument = new roleModel(roleData);
    await roleDocument.save();
    
    return roleDocument;
};

exports.updateRole = async function (roleData) {
    if(!roleData._id)
        throw global.ErrorBadRequest("Role id not found");

    const res = await roleModel.updateOne({ _id: roleData._id }, roleData).exec();
    if (res.n === 0)
        throw global.ErrorDataNotFound("Data not found");

    return roleData;
};

exports.deleteRole = async function (roleId) {
    if(!roleId)
        throw global.ErrorBadRequest("Role id not found");

    const res = await roleModel.findOneAndDelete({ _id: roleId }).exec();
    if (res.n === 0)
        throw global.ErrorDataNotFound("DATA NOT FOUND")
        
    return roleId;
};



exports.insertDefaultRole=async function (){
    const roles=[
        {
            name: "Admin",
            user: {
                view:true,
                create:true,
                update:true,
                delete:true,
            },
            masterData: {
                view:true,
                create:true,
                update:true,
                delete:true,
            },
            isDefaultNormal: false,
        },
        {
            name: "Normal",
            user: {
                view:true,
                create:false,
                update:false,
                delete:false,
            },
            masterData: {
                view:true,
                create:false,
                update:false,
                delete:false,
            },
            isDefaultNormal: true,
        }
    ]
    for(const role of roles)
        await exports.createRole(role);
}