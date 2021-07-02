process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;
const request = require("supertest");
const Server = require("../src/server");
const ErrorDump = require("../src/error-dump");

var server = new Server();
var serverApp = null;

describe("TESTING /api/role", () => {
    // BEFORE TESTING
    before((done) => {
        server
            .start()
            .then(() => done())
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
            // ROLE ADMIN LOGIN
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

            // ROLE BASIC LOGIN
            const basicLoginResponse = await request(server).post("/auth/login/test").send({ username: userBasic.username, password: userBasic.password });
            if (basicLoginResponse.status !== 200 && basicLoginResponse.status !== 302) {
                throw Error("Login failed");
            }

            expect(basicLoginResponse).to.contain.property("text");

            const basicLoginResponseBody = JSON.parse(basicLoginResponse.text);

            expect(basicLoginResponseBody).to.be.an("object");
            expect(basicLoginResponseBody).to.contain.property("data");

            const basicTokenData = basicLoginResponseBody.data;
            expect(basicTokenData).to.contain.property("accessToken");
            expect(basicTokenData).to.contain.property("refreshToken");
            expect(basicTokenData).to.contain.property("userData");

            userBasic._id = basicTokenData.userData.userId;
            userBasic.accessToken = basicTokenData.accessToken;
        } catch (err) {
            ErrorDump(err, false);
            throw err;
        }
    });
    // AFTER EVERY TEST
    // afterEach(done=>{
    // })

    describe("[GET]", () => {
        it("GET ROLE LIST", (done) => {
            request(server)
                .get("/api/role")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("array");

                    roleList = data;

                    done();
                });
        });

        it("FIND ROLEs", (done) => {
            request(server)
                .get("/api/role?search=admin")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("array");

                    done();
                });
        });

        it("GET ROLE BY ID", (done) => {
            request(server)
                .get("/api/role/" + userAdmin.role)
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });
    });

    describe("[POST]", () => {
        it("CREATE ROLE", (done) => {
            request(server)
                .post("/api/role")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .send(sampleRoleData)
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    sampleRoleData = data;

                    done();
                });
        });

        it("CREATE ROLE - BAD REQUEST", (done) => {
            request(server)
                .post("/api/role")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("CREATE ROLE - UNAUTHORIZED", (done) => {
            request(server)
                .post("/api/role")
                .set({ Authorization: `Bearer ${userBasic.accessToken}` })
                .send(sampleRoleData)
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[PUT]", () => {
        it("UPDATE ROLE", (done) => {
            request(server)
                .put("/api/role")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .send({
                    ...sampleRoleData,
                    name: "update role name",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("object");

                    done();
                });
        });

        it("UPDATE ROLE - BAD REQUEST", (done) => {
            request(server)
                .put("/api/role")
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(400);
                    done();
                });
        });

        it("UPDATE ROLE - UNAUTHORIZED", (done) => {
            request(server)
                .put("/api/role")
                .set({ Authorization: `Bearer ${userBasic.accessToken}` })
                .send({
                    ...sampleRoleData,
                    name: "update role name",
                })
                .end((err, response) => {
                    expect(response.status).to.equal(403);
                    done();
                });
        });
    });

    describe("[DELETE]", () => {
        it("DELETE ROLE", (done) => {
            request(server)
                .delete("/api/role/" + sampleRoleData._id)
                .set({ Authorization: `Bearer ${userAdmin.accessToken}` })
                .end((err, response) => {
                    expect(response.status).to.equal(200);
                    expect(response).to.contain.property("text");

                    const body = JSON.parse(response.text);
                    expect(body).to.be.an("object");
                    expect(body).to.contain.property("data");

                    const data = body.data;
                    expect(data).to.be.an("string");

                    done();
                });
        });
    });
});
