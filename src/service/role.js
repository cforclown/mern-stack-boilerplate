const mongoose = require("mongoose");
const ApiError = require("../api-error");

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
    search({ query, pagination }) {
        return this.roleDao.search({ query, pagination });
    }

    async update({ _id, name, masterData, user }) {
        const res = await this.roleDao.update({ _id, name, masterData, user });
        if (!res) {
            throw ApiError.notFound("Role not found");
        }
        return res;
    }

    async delete(roleId) {
        const deletedRole = await this.roleDao.delete(roleId);
        if (!deletedRole) {
            throw ApiError.notFound("DATA NOT FOUND");
        }

        return deletedRole;
    }
}

const roleDao = require("../dao/role");
module.exports = new RoleService({ roleDao });
