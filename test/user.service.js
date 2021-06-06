process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;

const database = require("../src/database");

describe("TESTING USER SERVICEs", () => {
    let userService = null;
    let createdUser = null;
    let defaultRole = null;
    let testRole = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(async () => {
                database.registerModels();
                userService = require("../src/service/user");

                const mongoose = require("mongoose");
                const roleModel = mongoose.model("Role");
                const defaultRoleDoc = new roleModel({
                    name: "normal",
                    isDefaultNormal: true,
                });
                await defaultRoleDoc.save();
                defaultRole = defaultRoleDoc;
                const testRoleDoc = new roleModel({
                    name: "test",
                });
                await testRoleDoc.save();
                testRole = testRoleDoc;

                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        userService
            .create({
                username: "create",
                email: "create@gmail.com",
                fullname: "create",
                role: defaultRole._id,
            })
            .then((user) => {
                expect(user).to.be.an("object");
                createdUser = user;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("REGISTER", (done) => {
        userService
            .register({
                username: "register",
                password: "register",
                confirmPassword: "register",
                email: "register@gmail.com",
                fullname: "register",
            })
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET", (done) => {
        userService
            .get(createdUser._id)
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("AUTHENTICATE", (done) => {
        userService
            .authenticate("create", "create_c")
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET USER PERMISSIONS", (done) => {
        userService
            .getUserPermissions(createdUser._id)
            .then((permissions) => {
                expect(permissions).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET ALL", (done) => {
        userService
            .getAll()
            .then((userList) => {
                expect(userList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("FIND", (done) => {
        userService
            .find("cre")
            .then((userList) => {
                expect(userList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("GET PROFILE", (done) => {
        userService
            .getProfile(createdUser._id)
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("UPDATE PROFILE", (done) => {
        userService
            .updateProfile(createdUser._id, { email: "create2@gmail.com", fullname: "update fullname" })
            .then((user) => {
                expect(user).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("CHANGE USERNAME", (done) => {
        userService
            .changeUsername(createdUser._id, "new_username")
            .then((user) => {
                expect(user).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("UPDATE", (done) => {
        userService
            .update({
                _id: createdUser._id,
                role: testRole._id,
            })
            .then((result) => {
                expect(result).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("DELETE", (done) => {
        userService
            .delete(createdUser._id.toString())
            .then((deletedUserId) => {
                expect(deletedUserId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
