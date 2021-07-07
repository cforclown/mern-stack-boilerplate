const mongoose = require("mongoose");
const ApiError = require("../api-error");

const roleModel = mongoose.model("Role");

class RoleDao {
    constructor() {
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create({ name, masterData, user }) {
        const roleDocument = new roleModel({
            name,
            masterData,
            user,
        });
        await roleDocument.save();

        return roleDocument;
    }

    get(roleId) {
        return roleModel.findById(roleId).exec();
    }
    getAll() {
        return roleModel.find({ isArchived: false }).exec();
    }
    async search({ query, pagination }) {
        const roles = await roleModel
            .find({
                name: {
                    $regex: query,
                    $options: "i",
                },
                isArchived: false,
            })
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .sort([["name", 1]])
            .exec();

        return {
            query,
            pagination,
            data: roles,
        };
    }

    async update({ _id, name, masterData, user }) {
        const role = await roleModel.findById(_id).exec();
        if (!role) {
            return null;
        }
        if (!role.editable) {
            return null;
        }

        const res = await roleModel
            .updateOne(
                { _id: _id },
                {
                    name,
                    masterData,
                    user,
                }
            )
            .exec();
        if (res.n === 0) {
            return null;
        }
        return { _id, name, masterData, user };
    }

    async delete(roleId) {
        const role = await roleModel.findById(roleId).exec();
        if (!role) {
            return null;
        }
        if (!role.editable) {
            return null;
        }

        role.isArchived = true;
        await role.save();

        return role;
    }
}

module.exports = new RoleDao();
