process.env.NODE_ENV = "test";

const chai = require("chai");
const expect = require("chai").expect;

const database = require("../src/database");

describe("TESTING USER SERVICEs", () => {
    let roleService = null;
    let createdRole = null;

    // BEFORE TESTING
    before((done) => {
        database
            .connect()
            .then(async () => {
                database.registerModels();
                roleService = require("../src/service/role");
                done();
            })
            .catch((err) => done(err));
    });

    it("CREATE", (done) => {
        roleService
            .create({
                name: "test",
            })
            .then((role) => {
                expect(role).to.be.an("object");
                createdRole = role;
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("GET", (done) => {
        roleService
            .get(createdRole._id)
            .then((role) => {
                expect(role).to.be.an("object");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("GET ALL", (done) => {
        roleService
            .getAll()
            .then((roleList) => {
                expect(roleList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
    it("FIND", (done) => {
        roleService
            .find("tes")
            .then((roleList) => {
                expect(roleList).to.be.an("array");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });

    it("UPDATE", (done) => {
        roleService
            .update({
                _id: createdRole._id,
                name: "test update",
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
        roleService
            .delete(createdRole._id.toString())
            .then((deletedId) => {
                expect(deletedId).to.be.an("string");
                done();
            })
            .catch((err) => {
                done(err.message);
            });
    });
});
