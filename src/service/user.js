const mongoose = require("mongoose");
const ApiError = require("../error/api-error");
const CryptoJS = require("crypto-js");

class UserService {
    constructor({ userDao, roleDao }) {
        this.userDao = userDao;
        this.roleDao = roleDao;

        this.create = this.create.bind(this);
        this.register = this.register.bind(this);
        this.get = this.get.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.getAll = this.getAll.bind(this);
        this.find = this.find.bind(this);
        this.getUserPermissions = this.getUserPermissions.bind(this);

        this.update = this.update.bind(this);

        this.delete = this.delete.bind(this);

        this.getProfile = this.getProfile.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
    }

    async create({ username, email, fullname, role }) {
        if (!this.validateEmail(email)) {
            throw ApiError.badRequest("Email not valid");
        }
        const roleData = await this.roleDao.get(role);
        if (!roleData) {
            throw ApiError.badRequest("Role id is invalid");
        }

        const hashedPassword = await CryptoJS.SHA512(username + "_c").toString(CryptoJS.enc.Hex);
        const user = await this.userDao.create({ username, hashedPassword, email, fullname, role });

        return user;
    }
    async register({ username, password, confirmPassword, email, fullname }) {
        if (password !== confirmPassword) {
            throw ApiError.badRequest("Password and confirmation password is not match");
        }
        if (!this.validateEmail(email)) {
            throw ApiError.badRequest("Email not valid");
        }
        if (!(await this.userDao.isUsernameAvailable(username))) {
            throw ApiError.badRequest("Username is taken");
        }

        const role = await this.roleDao.getDefaultNormalRole();
        if (!role) {
            throw new Error("Normal role not found");
        }

        const hashedPassword = await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
        const user = await this.userDao.create({ username, hashedPassword, email, fullname, role });

        return user;
    }

    async get(userId) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
    async authenticate(username, password) {
        const hashedPassword = await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
        const user = await this.userDao.authenticate(username, hashedPassword);
        if (!user) {
            return null;
        }

        return user;
    }
    async getAll() {
        const userList = await this.userDao.getAll();
        return userList;
    }
    async find(query) {
        const userList = await this.userDao.find(query);
        return userList;
    }
    async getUserPermissions(userId) {
        const permissions = await this.userDao.getUserPermissions(userId);
        if (!permissions) {
            throw ApiError.notFound("User not found");
        }
        return permissions;
    }

    async update({ _id, role }) {
        const user = await this.userDao.get(_id);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        if (role && !user.role.equals(role)) {
            const roleData = await this.roleDao.get(role);
            if (!roleData) {
                throw ApiError.badRequest("Role id is invalid");
            }
            user.role = roleData._id;
        }

        return {
            _id,
            role,
        };
    }

    async delete(userId) {
        const deletedUserId = await this.userDao.delete(userId);
        if (!deletedUserId) {
            throw ApiError.notFound("User not found");
        }
        return deletedUserId;
    }

    //#region PROFILE STUFF
    async getProfile(userId) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return user;
    }
    async updateProfile(userId, { email, fullname }) {
        const user = await this.userDao.updateProfile(userId, { email, fullname });
        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return {
            email,
            fullname,
        };
    }
    async changeUsername(userId, username) {
        const user = await this.userDao.get(userId);
        if (!user) {
            throw ApiError.notFound("User not found");
        }
        if (user.username == username) {
            return username;
        }

        const isUsernameAvailable = await this.userDao.isUsernameAvailable(username, user._id);
        if (!isUsernameAvailable) {
            throw ApiError.badRequest("Username is taken");
        }
        await this.userDao.changeUsername(userId, username);

        return username;
    }

    validateEmail(email) {
        const emailre =
            /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        if (!email) return false;
        if (email.length > 254) return false;

        const isValid = emailre.test(email);
        if (!isValid) return false;

        // Further checking of some things regex can't handle
        const parts = email.split("@");
        if (parts[0].length > 64) return false;

        const domainParts = parts[1].split(".");
        if (domainParts.some((part) => part.length > 63)) return false;

        return true;
    }
}

const userDao = require("../dao/user");
const roleDao = require("../dao/role");
module.exports = new UserService({ userDao, roleDao });
//#endregion
