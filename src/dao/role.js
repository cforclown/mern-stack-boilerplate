const mongoose = require("mongoose");

class RoleDao {
    constructor() {
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create({ name, masterData, user }) {
        const roleDocument = new mongoose.model("Role")({
            name,
            masterData,
            user,
        });
        await roleDocument.save();

        return roleDocument;
    }

    get(roleId) {
        return mongoose.model("Role").findById(roleId).exec();
    }
    getAll() {
        return mongoose.model("Role").find({}).exec();
    }
    find(query) {
        return mongoose.model("Role").find({
            name: {
                $regex: query,
                $options: "i",
            },
        });
    }
    getDefaultNormalRole() {
        return mongoose.model("Role").findOne({ isDefaultNormal: true }).exec();
    }

    async update({ _id, name, masterData, user }) {
        const res = await mongoose
            .model("Role")
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
        const res = await mongoose.model("Role").findOneAndDelete({ _id: roleId }).exec();
        if (res.n === 0) {
            return null;
        }

        return roleId;
    }
}

module.exports = new RoleDao();
