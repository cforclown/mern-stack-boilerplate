/* eslint-disable class-methods-use-this */
const global = require("../global");
const dro = require("../dro");

class RoleController {
    constructor({ roleService }) {
        this.roleService = roleService;

        this.create = this.create.bind(this);
        this.get = this.get.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getDefaultNormalRole = this.getDefaultNormalRole.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }
    async create(req, res) {
        try {
            if (!req.user.role.masterData.create) {
                return res.sendStatus(403);
            }

            const role = await this.roleService.create(req.body);
            res.send(dro.response(role));
        } catch (err) {
            global.DumpError(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async get(req, res) {
        try {
            const role = await this.roleService.get(req.params.roleId);
            res.send(dro.response(role));
        } catch (err) {
            global.DumpError(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async getAll(req, res) {
        try {
            const roleList =
                req.query.search && req.query.search.trim() !== ""
                    ? await this.roleService.find(req.query.search)
                    : await this.roleService.getAll();
            res.send(dro.response(roleList));
        } catch (err) {
            global.DumpError(err);
            res.status(500).send(dro.errorResponse(err.message));
        }
    }
    async getDefaultNormalRole(req, res) {
        try {
            const permissions = await this.roleService.getDefaultNormalRole(req.params.userId);
            res.send(dro.response(permissions));
        } catch (err) {
            global.DumpError(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async update(req, res) {
        try {
            if (!req.user.role.masterData.update) {
                return res.sendStatus(403);
            }

            const role = await this.roleService.update(req.body);
            res.send(dro.response(role));
        } catch (err) {
            global.DumpError(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }

    async delete(req, res) {
        try {
            if (!req.user.role.masterData.delete) {
                return res.sendStatus(403);
            }

            const result = await this.roleService.delete(req.params.roleId);
            res.send(dro.response(result));
        } catch (err) {
            global.DumpError(err);
            res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
        }
    }
}

const roleService = require("../service/role");
module.exports = new RoleController({ roleService });
