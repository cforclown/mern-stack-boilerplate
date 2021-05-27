process.env.NODE_ENV = "test";

const chai = require('chai');
const expect = require('chai').expect;
const request = require('supertest');

const database = require('../src/database/database');
const server = require('../src/app');

const userModel = require('../src/database/model/user.model').Model;
const avatarModel = require('../src/database/model/avatar.model').Model;
const roleModel = require('../src/database/model/role.model').Model;
const global = require('../src/global/global');



const userAdmin = {
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
    fullname: 'admin',
    role: null,
    accessToken: null,
}

describe('TESTING /api/user', () => {
    // BEFORE TESTING
    before(done => {
        database.connect().then(async () => {
            // ROLE ADMIN
            const adminRoleDoc = new roleModel({
                name: 'Admin',
                user: {
                    view: true,
                    create: true,
                    update: true,
                    delete: true,
                },
                masterData: {
                    view: true,
                    create: true,
                    update: true,
                    delete: true,
                },
            })
            await adminRoleDoc.save();

            // DUMMY AVATAR
            const avatarData={
                file: "data:image/jpeg;base64,hahahahahahahahahahhahahahahahahaha",
                filename: "avatar.jpeg",
            }
            const prefix = avatarData.file.split(";base64,").length > 0 ? 
                            avatarData.file.split(";base64,")[0]
                            : null;
            const ext = avatarData.file.match(/[^:/]\w+(?=;|,)/);
            const avatarDoc = new avatarModel({
                filename: avatarData.filename,
                file: avatarData.file,
                prefix,
                ext: ext && ext.length>0 ? ext[0] : null,
            });
            await avatarDoc.save();



            // USER ADMIN
            userAdmin.avatar=avatarDoc._id;
            userAdmin.role=adminRoleDoc._id;
            const userAdminDoc = new userModel({
                ...userAdmin,
                password:await global.Hash(userAdmin.password),
                avatar: avatarDoc._id,
            })
            await userAdminDoc.save();

            done();
        }).catch((err) => done(err));
    })

    // AFTER TESTING
    after(async () => {
        try{
            await userModel.collection.drop();
            await roleModel.collection.drop();
        }
        catch(err){
            global.DumpError(err, false);
            throw err;
        }
    })



    // BEFORE EVERY TEST, LOGIN BEFORE EVERY TEST
    beforeEach(async () => {
        try{
            // USER ADMIN LOGIN
            const adminLoginResponse =await request(server).post('/auth/login/test').send(userAdmin)
            if (adminLoginResponse.status !== 200 && adminLoginResponse.status !== 302)
                throw Error("Login failed");
    
            expect(adminLoginResponse).to.contain.property('text');
    
            const adminLoginResponseBody = JSON.parse(adminLoginResponse.text);
    
            expect(adminLoginResponseBody).to.be.an('object');
            expect(adminLoginResponseBody).to.contain.property('data');
    
            const adminTokenData=adminLoginResponseBody.data
            expect(adminTokenData).to.contain.property('accessToken');
            expect(adminTokenData).to.contain.property('refreshToken');
            expect(adminTokenData).to.contain.property('userData');
    
            userAdmin._id=adminTokenData.userData.userId;
            userAdmin.accessToken = adminTokenData.accessToken;
        }
        catch(err){
            global.DumpError(err, false);
            throw err;
        }
    })
    // AFTER EVERY TEST
    // afterEach(done=>{
    // })



    describe("[GET]", () => {
        it("GET AVATAR", (done) => {
            request(server)
                .get("/api/avatar/"+userAdmin.avatar)
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    done();
                })
        });
    });
})