const mongoose = require("mongoose");
const ApiError = require("../error/api-error");

class RoleService {
    constructor({ roleDao }) {
        this.roleDao = roleDao;
    }

    async create({ name, masterData, user }) {
        try {
            const role = await this.roleDao.create({ name, masterData, user });
            return role;
        } catch (err) {
            throw err;
        }
    }

    async get(roleId) {
        const role = await this.roleDao.get(roleId);
        if (!role) {
            throw ApiError.notFound("Role not found");
        }
        return role;
    }
    async getAll() {
        const roleList = await this.roleDao.getAll();
        return roleList;
    }
    async find(query) {
        const roleList = await this.roleDao.find(query);
        return roleList;
    }
    async getDefaultNormalRole() {
        const role = await this.roleDao.getDefaultNormalRole();
        if (!role) {
            throw ApiError.notFound("Default normal role not found");
        }

        return role;
    }

    async update({ _id, name, masterData, user }) {
        const res = await this.roleDao.update({ _id, name, masterData, user });
        if (!res) {
            throw ApiError.notFound("Role not found");
        }
        return res;
    }

    async delete(roleId) {
        const res = await this.roleDao.delete(roleId);
        if (!res) {
            throw ApiError.notFound("DATA NOT FOUND");
        }

        return roleId;
    }
}

const roleDao = require("../dao/role");
module.exports = new RoleService({ roleDao });