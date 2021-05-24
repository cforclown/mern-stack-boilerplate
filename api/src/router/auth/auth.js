const config = require('../../config');
const express=require('express');
const passport=require('passport');
const jwt=require('jsonwebtoken');
const global=require('../../global/global');
const userController=require('../../database/controller/user.controller');
const tokenController=require('../../database/controller/token.controller');

const router=express.Router()

const accessTokenExpIn=parseInt(config.ACCESS_TOKEN_EXP_IN)
const refreshTokenExpIn=parseInt(config.ACCESS_TOKEN_EXP_IN)*2
// const accessTokenExpIn=10;
// const refreshTokenExpIn=20;

const removeTokenTasks=[]


router.post('/register', async (req, res)=>{
    try{
        if(!req.body.registerData)
            return res.status(400).send(global.ErrorResponse("Register data not found"));
        if(!req.body.registerData.username)
            return res.status(400).send(global.ErrorResponse("Username not found"));
        if(!req.body.registerData.password)
            return res.status(400).send(global.ErrorResponse("Password not found"));
        if(!req.body.registerData.confirmPassword)
            return res.status(400).send(global.ErrorResponse("Confirmation password not found"));
        if(req.body.registerData.password!==req.body.registerData.confirmPassword)
            return res.status(400).send(global.ErrorResponse("Confirmation password is incorrect"));
        if(!req.body.registerData.email)
            return res.status(400).send(global.ErrorResponse("Email not found"));
        if(!req.body.registerData.fullname)
            return res.status(400).send(global.ErrorResponse("Fullname not found"));

        const user=await userController.registerUser(req.body.registerData);

        const userData={
            userId:user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        };
        const accessToken=jwt.sign(userData, config.ACCESS_TOKEN_SECRET, { 
            expiresIn:`${accessTokenExpIn}s`
        });
        const refreshToken=jwt.sign(userData, config.REFRESH_TOKEN_SECRET, { 
            expiresIn:`${refreshTokenExpIn}s`
        });
            
        await tokenController.addToken(userData.userId, refreshToken);
        startRemoveTokenTask(refreshToken);

        res.send(global.Response({
            userData, 
            accessToken, 
            refreshToken
        }));
    }
    catch(err){
        global.DumpError(err);
        res.status(500).send(global.ErrorResponse(err.message));
    }
});
router.post('/login', passport.authenticate("local", {
        successRedirect: "/auth/login/verify",
        failureRedirect: "/auth/login/error",
        failureFlash: true,
    })
);
router.post('/login/test', async (req, res)=>{       // LOGIN SUCCESS
    try{
        if(!req.body)                               return res.status(400).send(global.ErrorResponse("CREDENTIALS NOT FOUND"));
        if(!req.body.username && !req.body.password)return res.status(400).send(global.ErrorResponse("CREDENTIALS NOT FOUND"));

        const user=await userController.authenticate(req.body.username, req.body.password);
        if(!user)
            return res.status(404).send(global.ErrorResponse("USER NOT FOUND"));

        const userData={
            userId:user._id,
            username:user.username,
            email:user.email,
            fullname:user.fullname,
            avatar: user.avatar,
            role:user.role,
        }
        const accessToken=jwt.sign(userData, config.ACCESS_TOKEN_SECRET, { 
            expiresIn:`${accessTokenExpIn}s`
        })
        const refreshToken=jwt.sign(userData, config.REFRESH_TOKEN_SECRET, { 
            expiresIn:`${refreshTokenExpIn}s`
        })
            
        await tokenController.addToken(userData.userId, refreshToken)
        startRemoveTokenTask(refreshToken)

        res.send(global.Response(new TokenResponse(userData, accessToken, refreshToken)))
    }
    catch(error){
        global.DumpError(error)
        res.status(500).send(global.Response(null, error.message))
    }
})
router.get('/login/verify', async (req, res)=>{       // LOGIN SUCCESS
    try{
        const userData={
            userId:req.user._id,
            username:req.user.username,
            email:req.user.email,
            fullname:req.user.fullname,
            avatar: req.user.avatar,
            role:req.user.role,
        }
        const accessToken=jwt.sign(userData, config.ACCESS_TOKEN_SECRET, { 
            expiresIn:`${accessTokenExpIn}s`
        })
        const refreshToken=jwt.sign(userData, config.REFRESH_TOKEN_SECRET, { 
            expiresIn:`${refreshTokenExpIn}s`
        })
            
        await tokenController.addToken(userData.userId, refreshToken)
        startRemoveTokenTask(refreshToken)

        res.send(global.Response(new TokenResponse(userData, accessToken, refreshToken)))
    }
    catch(error){
        global.DumpError(error)
        res.status(500).send(global.Response(null, error.message))
    }
})
router.get('/login/error', async (req, res)=>{        // LOGIN FAILED
    res.status(404).send(global.Response(null, 'Authentication error'));
})
router.post('/refresh', async (req, res)=>{
    try{
        if(!req.body.refreshToken) return res.sendStatus(400)

        if(!(await tokenController.isExists(req.body.refreshToken))) return res.sendStatus(403)

        jwt.verify(req.body.refreshToken, config.REFRESH_TOKEN_SECRET, async (err, user)=>{
            if(err) return res.sendStatus(403)

            const userData={
                userId:user.userId,
                username:user.username,
                email:user.email,
                fullname:user.fullname,
                avatar: user.avatar,
                role:user.role,
            }
            const accessToken=jwt.sign(userData, config.ACCESS_TOKEN_SECRET, { 
                expiresIn:`${accessTokenExpIn}s`
            })
            const refreshToken=jwt.sign(userData, config.REFRESH_TOKEN_SECRET, { 
                expiresIn:`${refreshTokenExpIn}s`
            })
            
            stopRemoveTokenTask(req.body.refreshToken)
            await tokenController.addToken(userData.userId, refreshToken); // FUNGSI INI SEKALIGUS MENGHAPUS SEMUA REFRESH TOKEN BY USER ID
            startRemoveTokenTask(refreshToken)
    
            res.send(global.Response(new TokenResponse(userData, accessToken, refreshToken)))
        })
    }
    catch(error){
        global.DumpError(error)
        res.status(500).send(global.Response(null, error.message))
    }
})
router.delete('/logout', async (req, res)=>{
    try{
        if(req.headers['authorization']===undefined) return res.sendStatus(401)
        
        const token=req.headers['authorization'].split(' ')[1]

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user)=>{
            if(err){ // TOKEN NOT VALID
                // STILL RETURN 200
                return res.send(global.OKResponse())
            }
            return res.send(global.OKResponse())
        })
    }
    catch(error){
        global.DumpError(error)
        res.status(500).send(global.Response(null, error.message))
    }
})

module.exports=router

function startRemoveTokenTask(refreshToken){
    const task={
        refreshToken:refreshToken,
        task:setTimeout(async () => {
            try{
                await tokenController.deleteToken(refreshToken);
                stopRemoveTokenTask(refreshToken);
            }
            catch(error){
                global.DumpError(error, false);
            }
        }, refreshTokenExpIn*1000),
    }
    removeTokenTasks.push(task)
}
function stopRemoveTokenTask(refreshToken){
    try{
        const task = removeTokenTasks.find(t=>t.refreshToken===refreshToken)
        if(!task) return
        
        clearTimeout(task.task)
        const taskIndex=removeTokenTasks.indexOf(t=>t.refreshToken===refreshToken);
        if(taskIndex>=0)
            removeTokenTasks.splice(taskIndex, 1);
    }
    catch(error){
        global.DumpError(error, false)
        const taskIndex=removeTokenTasks.indexOf(t=>t.refreshToken===refreshToken);
        if(taskIndex>=0)
            removeTokenTasks.splice(taskIndex, 1);
    }
}

function TokenResponse(_userData, _accessToken, _refreshToken){
    this.userData={
        userId:_userData.userId,
        username:_userData.username,
        email:_userData.email,
        fullname:_userData.fullname,
        avatar:_userData.avatar,
        role:{
            _id:_userData.role._id,
            nama:_userData.role.nama,
        },
    };
    this.accessToken=_accessToken;
    this.refreshToken=_refreshToken;
}



/**
 * @swagger
 * /auth/register:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Register
 *          responses:
 *              '200':
 *                  description: Register Success
 *          requestBody:
 *              description: "Register Data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/registerData'
 * /auth/login:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Login
 *          responses:
 *              '200':
 *                  description: Login Success
 *          requestBody:
 *              description: "Login Data"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/loginData'
 * /auth/refresh:
 *      post:
 *          tags:
 *              - Authentication
 *          description: Refresh Token
 *          responses:
 *              '200':
 *                  description: Token berhasil diperbarui
 *          security:
 *              - Bearer: []
 *          requestBody:
 *              description: "Refresh Token"
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/refreshToken'
 * /auth/logout:
 *      delete:
 *          tags:
 *              - Authentication
 *          description: Logout berhasil
 *          responses:
 *              '200':
 *                  description: Logout Success
 *          security:
 *              - Bearer: []
 */