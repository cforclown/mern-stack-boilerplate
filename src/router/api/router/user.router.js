const express = require('express')
const global = require('../../../global/global')
const userController = require('../../../database/controller/user.controller')



const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const userList = (req.query.search && req.query.search!=='') ? 
                            await userController.findUser(req.query.search) : 
                            await userController.getUserList();
        res.send(global.Response(userList))
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
})
router.get('/:userId', async (req, res) => {
    try {
        const user = await userController.getUser(req.params.userId)
        res.send(global.Response(user));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
})
router.get('/permissions/:userId', async (req, res) => {
    try {
        const permissions = await userController.getUserPermissions(req.params.userId?req.params.userId:req.user.userId)
        res.send(global.Response(permissions));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
})

router.post('/', async (req, res) => {
    try {
        if (!req.user.role.user.create)
            return res.sendStatus(403);
        if(!req.body.userData)
            return res.status(400).send("User data not found");

        const user = await userController.createUser(req.body.userData);
        res.send(global.Response(user));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});

router.put('/', async (req, res) => {
    try {
        if (!req.user.role.user.update)
            return res.sendStatus(403);
        if(!req.body.userData)
            return res.status(400).send("User data not found");

        const user = await userController.updateUser(req.body.userData);
        res.send(global.Response(user));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        if (!req.user.role.user.delete)
            return res.sendStatus(403)
        if(!req.params.userId)
            return res.sendStatus(400)

        const userId = await userController.deleteUser(req.params.userId);
        res.send(global.Response(userId));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message));
    }
});



//#region PROFILE STUFF
router.get('/profile/:userId', async (req, res) => {
    try {
        const profile = await userController.getUserProfile(req.params.userId)
        res.send(global.Response(profile));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});

router.put('/profile', async (req, res) => {
    try {
        if(!req.body.userData)
            return res.status(400).send("User data not found");

        const profile = await userController.updateProfile(req.body.userData);
        res.send(global.Response(profile));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});
router.put('/profile/avatar', async (req, res) => {
    try {
        if(!req.body.avatarData)
            return res.status(400).send("Avatar data not found");

        const avatarId = await userController.changeUserAvatar(req.user.userId, req.body.avatarData);
        res.send(global.Response(avatarId));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});
router.put('/profile/username', async (req, res) => {
    try {
        if(!req.body.userData)
            return res.status(400).send("User data not found");

        const userData = await userController.changeUserUsername(req.body.userData);
        res.send(global.Response(userData));
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
});
//#endregion



module.exports = router

/**
 * @swagger
 * /api/user:
 *      get:
 *          tags:
 *              - User
 *          description: Get User List
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *      post:
 *          tags:
 *              - User
 *          description: Create user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userData'
 *      put:
 *          tags:
 *              - User
 *          description: Update user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "User data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userData'
 * /api/user/{userId}:
 *      get:
 *          tags:
 *              - User
 *          description: Get User Data
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 * /api/user/permissions/{userId}:
 *      get:
 *          tags:
 *              - User
 *          description: Get User Permissions
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          parameters:
 *          -   name: userId
 *              in: path
 *              required: true
 * /api/user/avatar:
 *      put:
 *          tags:
 *              - User
 *          description: Change user avatar
 *          responses:
 *              '200':
 *                  description: OK
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Avatar data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userData'
 */