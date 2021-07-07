"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressSession = require("express-session");
const expressFlash = require("express-flash");
const cors = require("cors");
const fs = require("fs");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const swaggerSchemas = require("../swagger-schemas");

function App({ nodeEnv, port, appHost, sessionConfig }) {
    const app = express();

    const initPassportConfig = require("../passport-config");

    //#region =========================== CONFIG MIDDLEWARE ===========================
    app.use(logger("dev"));
    app.use(bodyParser.json({ limit: "10mb" }));
    app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

    // CORS
    app.use(
        cors({
            origin: appHost,
            credentials: true,
        })
    );

    app.use(expressFlash());
    app.use(
        expressSession({
            secret: sessionConfig.secret,
            resave: sessionConfig.resave,
            saveUninitialized: sessionConfig.saveUninitialized,
            cookie: {
                secure: sessionConfig.cookieSecure,
                maxAge: sessionConfig.cookieMaxAge,
            },
        })
    );
    app.use(cookieParser(sessionConfig.secret));

    // INIT PASSPORT CONFIGURATION
    app.use(passport.initialize());
    app.use(passport.session());
    initPassportConfig(passport);
    //#endregion =======================================================================

    //#region ============================ SWAGGER CONFIG =============================
    // extended : https://swagger.io/specification/#infoObject
    const swaggerOptions = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "API",
                version: "1.0.0",
                description: "API Documentation",
                contact: {
                    name: "Hafis Alrizal",
                    url: "https://hafisalrizal.com",
                    email: "hafisalrizal@gmail.com",
                },
            },
            consumes: ["application/json"],
            produces: ["application/json"],
            schemes: ["http", "https"],
            components: {
                schemas: swaggerSchemas,
                securitySchemes: {
                    Bearer: {
                        type: "apiKey",
                        name: "Authorization",
                        in: "header",
                    },
                },
            },
            securityDefinitions: {
                Bearer: {
                    type: "apiKey",
                    name: "Authorization",
                    in: "header",
                },
            },
            security: {
                Bearer: [],
            },
        },
        apis: ["./src/router/api/router/*.js", "./src/router/auth/*.js"],
    };
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
    //#endregion -----------------------------------------------------------------------

    //#region ================================ ROUTES =================================
    const router = require("../router");
    app.use("/", router);

    // HOME
    if (nodeEnv === "development") {
        if (fs.existsSync(path.join(__dirname, "../../public/staging"))) {
            app.use(express.static(path.join(__dirname, "../../public/staging")));
            app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/staging/index.html"));
            });
        } else {
            app.use(express.static(path.join(__dirname, "../../public/default")));
            app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/default/index.html"));
            });
        }
    } else if (nodeEnv === "production") {
        if (fs.existsSync(path.join(__dirname, "../../public/production"))) {
            app.use(express.static(path.join(__dirname, "../../public/production")));
            app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/production/index.html"));
            });
        } else {
            app.use(express.static(path.join(__dirname, "../../public/default")));
            app.get("/*", (req, res) => {
                res.sendFile(path.join(__dirname, "../../public/default/index.html"));
            });
        }
    } else {
        app.use(express.static(path.join(__dirname, "../../public/default")));
        app.get("/*", (req, res) => {
            res.sendFile(path.join(__dirname, "../../public/default/index.html"));
        });
    }
    //#endregion

    app.set("port", port);

    return app;
}

module.exports = App;
