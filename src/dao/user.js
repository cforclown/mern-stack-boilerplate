const mongoose = require("mongoose");

class UserDao {
    constructor() {
        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getAll = this.getAll.bind(this);
        this.find = this.find.bind(this);
        this.getUserPermissions = this.getUserPermissions.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);

        this.updateProfile = this.updateProfile.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.isUsernameAvailable = this.isUsernameAvailable.bind(this);
    }

    async create({ username, hashedPassword, email, fullname, role }) {
        const userDoc = new mongoose.model("User")({
            username,
            password: hashedPassword,
            email,
            fullname,
            role,
        });
        await userDoc.save();

        return userDoc;
    }

    get(userId) {
        return mongoose.model("User").findById(userId).select("-password").populate("role").exec();
    }
    authenticate(username, hashedPass) {
        return mongoose
            .model("User")
            .findOne({
                username: username,
                password: hashedPass,
            })
            .select("-password")
            .populate("role")
            .exec();
    }
    getAll() {
        return mongoose
            .model("User")
            .find({})
            .select("-password")
            .populate({
                path: "role",
                select: "_id name",
                model: "Role",
            })
            .exec();
    }
    find(query) {
        return mongoose
            .model("User")
            .find({
                fullname: { $regex: query, $options: "i" },
            })
            .select("-password")
            .populate({
                path: "role",
                select: "_id nama",
                model: "Role",
            });
    }
    async getUserPermissions(userId) {
        const user = await mongoose.model("User").findById(userId).select("-password").populate("role").exec();
        return user ? user.role : null;
    }

    async update({ _id, role }) {
        const result = await mongoose.model("User").updateOne({ _id: _id }, { $set: { role: role } });
        if (result.n === 0) {
            return null;
        }

        return {
            _id,
            role,
        };
    }

    async delete(userId) {
        const res = await mongoose.model("User").deleteOne({ _id: userId }).exec();
        if (res.n === 0) {
            return null;
        }
        return userId;
    }

    //#region PROFILE STUFF
    async updateProfile(userId, { email, fullname }) {
        const result = await mongoose.model("User").updateOne({ _id: userId }, { $set: { email, fullname } });
        if (result.n === 0) {
            return null;
        }

        return { _id: userId, email, fullname };
    }
    async changeUsername(userId, username) {
        const result = await mongoose.model("User").updateOne({ _id: userId }, { $set: { username } });
        if (result.n === 0) {
            return null;
        }

        return username;
    }
    async isUsernameAvailable(username, excludeUserId) {
        const user = excludeUserId
            ? await mongoose.model("User").findOne({ _id: { $ne: excludeUserId }, username: username })
            : await mongoose.model("User").findOne({ username: username });
        return user ? false : true;
    }
    //#endregion
}

module.exports = new UserDao();
