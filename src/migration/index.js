const mongoose = require("mongoose");
const config = require("../config");
const Database = require("../database");
const initialData = require("./mongodb-initial-static-attribute");

async function migrate() {
    try {
        const database = new Database({
            nodeEnv: config.NODE_ENV,
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            dbName: config.DB_NAME,
        });
        await database.connect();

        const roleModel = mongoose.model("Role");
        const userModel = mongoose.model("User");
        if ((await roleModel.find({}).exec()).length === 0) {
            for (const data of initialData.roles) {
                const doc = new roleModel(data);
                await doc.save();
            }
        }
        if ((await userModel.find({}).exec()).length === 0) {
            for (const data of initialData.users) {
                const doc = new userModel(data);
                await doc.save();
            }
        }
        console.log("MIGRATION COMPLETE!");
    } catch (err) {
        throw err;
    }
}

migrate();
