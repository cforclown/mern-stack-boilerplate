"use strict";

const config = require("../config");
const Database = require("../database");
const App = require("../app");
const ErrorDump = require("../error-dump");
const cl = require("../console-log");

class Server {
    constructor() {
        this.app = null;
    }
    async start() {
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
            cl.LogBgSuccess("============================================================================");
            cl.LogSuccess(`| ${config.NODE_ENV.toUpperCase()} MODE`);
            cl.LogSuccess(`| DATABASE CONNECTED [${config.DB_NAME}]`);

            this.app = App({
                nodeEnv: config.NODE_ENV,
                port: config.PORT,
                appHost: config.APP_HOST.split(" "),
                sessionConfig: {
                    secret: config.SESSION_SECRET,
                    resave: config.SESSION_RESAVE,
                    saveUninitialized: config.SESSION_SAVE_UNINITIALIZED,
                    cookieSecure: true,
                    cookieMaxAge: config.SESSION_COOKIE_MAX_AGE,
                },
            });
            await this.app.listen(this.app.get("port"), this.app.get("host"));
            cl.LogSuccess(`| SERVER LISTENING ON PORT ${this.app.get("port")}`);
            cl.LogBgSuccess("============================================================================");
        } catch (err) {
            ErrorDump(err);
            cl.LogError("!! DATABASE CONNECTION FAILED: " + err.message);
        }
    }
}

module.exports = Server;
