const express = require("express");
const validate = require("../../../middleware/validate");
const roleController = require("../../../controller/role");
const roleDto = require("../../../dto/role");

const Router = express.Router();

Router.post("/", validate(roleDto), roleController.create);
Router.get("/", roleController.getAll);
Router.get("/:roleId", roleController.get);
Router.put("/", validate(roleDto), roleController.update);
Router.delete("/:roleId", roleController.delete);

module.exports = Router;

/**
 * @swagger
 * /api/role:
 *      get:
 *          tags:
 *              - Role
 *          description: Get Role List
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *      post:
 *          tags:
 *              - Role
 *          description: Create Role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Role data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/roleData'
 *      put:
 *          tags:
 *              - Role
 *          description: Update Role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Role data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/roleData'
 * /api/role/{roleId}:
 *      get:
 *          tags:
 *              - Role
 *          description: Get Role Data
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: roleId
 *              in: path
 *              required: true
 *      delete:
 *          tags:
 *              - Role
 *          description: Delete Role
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: roleId
 *              in: path
 *              required: true
 */
