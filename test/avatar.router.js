process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

const Server = require("../src/server");
const ErrorDump = require("../src/error-dump");
const global = require("../src/global");

var server = new Server();

describe("TESTING /api/avatar", () => {
    const database = new Database();

    // BEFORE TESTING
    before((done) => {
        server
            .start()
            .then(async () => {
                // DUMMY AVATAR
                const avatarData = {
                    file: "data:image/jpeg;base64,hahahahahahahahahahhahahahahahahaha",
                    filename: "avatar.jpeg",
                };
                const prefix = avatarData.file.split(";base64,").length > 0 ? avatarData.file.split(";base64,")[0] : null;
                const ext = avatarData.file.match(/[^:/]\w+(?=;|,)/);
                const avatarDoc = new avatarModel({
                    filename: avatarData.filename,
                    file: avatarData.file,
                    prefix,
                    ext: ext && ext.length > 0 ? ext[0] : null,
                });
                await avatarDoc.save();

                done();
            })
            .catch((err) => done(err));
    });

    // AFTER TESTING
    after(async () => {
        try {
            await userModel.collection.drop();
            await roleModel.collection.drop();
        } catch (err) {
            ErrorDump(err, false);
            throw err;
        }
    });

    // BEFORE EVERY TEST, LOGIN BEFORE EVERY TEST
    beforeEach(async () => {
        try {
            // USER ADMIN LOGIN
            const adminLoginResponse = await request(server).post("/auth/login/test").send({ username: userAdmin.username, password: userAdmin.password });
            if (adminLoginResponse.status !== 200 && adminLoginResponse.status !== 302) {
                throw Error("Login failed");
            }

            expect(adminLoginResponse).to.contain.property("text");

            const adminLoginResponseBody = JSON.parse(adminLoginResponse.text);

            expect(adminLoginResponseBody).to.be.an("object");
            expect(adminLoginResponseBody).to.contain.property("data");

            const adminTokenData = adminLoginResponseBody.data;
            expect(adminTokenData).to.contain.property("accessToken");
            expect(adminTokenData).to.contain.property("refreshToken");
            expect(adminTokenData).to.contain.property("userData");

            userAdmin._id = adminTokenData.userData.userId;
            userAdmin.accessToken = adminTokenData.accessToken;
        } catch (err) {
            ErrorDump(err, false);
            throw err;
        }
    });

    describe("[GET]", () => {
        it("GET AVATAR", (done) => {
            request(server)
                .get("/api/avatar/" + userAdmin.avatar)
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    done();
                });
        });
    });
});
