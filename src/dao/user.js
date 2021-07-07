const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const roleModel = mongoose.model("Role");

class UserDao {
    constructor() {
        this.create = this.create.bind(this);
        this.search = this.search.bind(this);

        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getUserPermissions = this.getUserPermissions.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);

        this.updateProfile = this.updateProfile.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.isUsernameAvailable = this.isUsernameAvailable.bind(this);
    }

    async create({ username, hashedPassword, email, fullname, role }) {
        let userDoc = new userModel({
            username,
            password: hashedPassword,
            email,
            fullname,
            role,
        });
        await userDoc.save();

        userDoc = await userModel.populate(userDoc, { path: "role", select: "name" });
        return userDoc;
    }

    get(userId) {
        return userModel.findById(userId).select("-password").populate("role").exec();
    }
    getAll() {
        return userModel
            .find({})
            .select("-password")
            .populate({
                path: "role",
                select: "_id name",
                model: "Role",
            })
            .exec();
    }
    async search({ query, pagination }) {
        const sortBy = [];
        if (pagination.sort.by === "USERNAME") {
            sortBy.push(["username", pagination.sort.order === "ASC" ? 1 : -1]);
        } else {
            sortBy.push(["fullname", pagination.sort.order === "ASC" ? 1 : -1]);
        }
        const users = await userModel
            .find({
                $and: [
                    {
                        $or: [
                            {
                                username: {
                                    $regex: query,
                                    $options: "i",
                                },
                            },
                            {
                                fullname: {
                                    $regex: query,
                                    $options: "i",
                                },
                            },
                        ],
                    },
                ],
            })
            .populate({
                path: "role",
                select: "_id name",
                model: "Role",
            })
            .select("-password")
            .skip((pagination.page - 1) * pagination.limit)
            .limit(pagination.limit)
            .sort([sortBy])
            .exec();

        return {
            query,
            pagination,
            data: users,
        };
    }
    async getUserPermissions(userId) {
        const user = await userModel.findById(userId).select("-password").populate("role").exec();
        return user ? user.role : null;
    }

    async update({ _id, role }) {
        const result = await userModel.updateOne({ _id: _id }, { $set: { role: role } });
        if (result.n === 0) {
            return null;
        }

        return {
            _id,
            role,
        };
    }

    async delete(userId) {
        const res = await userModel.deleteOne({ _id: userId }).exec();
        if (res.n === 0) {
            return null;
        }
        return userId;
    }

    //#region PROFILE STUFF
    async updateProfile(userId, { email, fullname }) {
        const result = await userModel.updateOne({ _id: userId }, { $set: { email, fullname } });
        if (result.n === 0) {
            return null;
        }

        return { email, fullname };
    }
    async changeUsername(userId, username) {
        const result = await userModel.updateOne({ _id: userId }, { $set: { username } });
        if (result.n === 0) {
            return null;
        }

        return username;
    }

    async isUsernameAvailable(username, excludeUserId) {
        const user = excludeUserId ? await userModel.findOne({ _id: { $ne: excludeUserId }, username: username }) : await userModel.findOne({ username: username });
        return user ? false : true;
    }
    async isRoleValid(roleId) {
        const role = await roleModel.findById(roleId).exec();
        return role ? true : false;
    }
    //#endregion
}

module.exports = new UserDao();
