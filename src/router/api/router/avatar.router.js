const express = require('express')
const global = require('../../../global/global')
const avatarController = require('../../../database/controller/avatar.controller');

const router = express.Router()

router.get('/:avatarId', async (req, res) => {
    try {
        const avatar = await avatarController.getAvatar(req.params.avatarId);
        if (!avatar || !avatar.file)
            return res.sendStatus(404);
    
        const imageBase64 = avatar.file.split(";base64,")[1];
        const imageBuffer = new Buffer(imageBase64, "base64");
        res.send(imageBuffer);
    }
    catch (err) {
        global.DumpError(err)
        res.status(err.status?err.status:500).send(global.ErrorResponse(err.message))
    }
})

module.exports = router

/**
 * @swagger
 * /api/avatar/{avatarId}:
 *      get:
 *          tags:
 *              - Avatar
 *          description: Get user avatar
 *          responses:
 *              '200':
 *                  description: OK
 *          parameters:
 *          -   name: avatarId
 *              in: path
 *              required: true
 */