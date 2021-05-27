"use strict";

const path = require("path");
const config=require('./config');
const database = require("./database/database");
const global=require('./global/global');



// CREATE FOLDER dump-log IF NOT EXIST
const fs = require("fs");
if (!fs.existsSync(path.join(__dirname, "../dump-log")))
    fs.mkdirSync(path.join(__dirname, "../dump-log"));
    

    
database.connect().then(async () => {
    try{
        global.LogBgGreen("============================================================================");
        global.LogGreen(`| ${config.NODE_ENV.toUpperCase()} MODE`);
        global.LogGreen(`| DATABASE CONNECTED [${config.DB_NAME}]`);

        const app = require('./app');
        await app.listen(app.get("port"), app.get("host"));
        global.LogGreen(`| SERVER LISTENING ON [${app.get("host")}/${app.get("port")}]`);
        global.LogBgGreen("============================================================================");

        await InsertStaticAttributes();
    }
    catch(err){
        global.DumpError(err);
    }
}).catch(err=>{
    global.DumpError(err);
    global.LogError('!! DATABASE CONNECTION FAILED: '+err.message);
})

async function InsertStaticAttributes(){
    try{
        // BOARD DEFAULT BACKGROUNDS
        const roleController=require('./database/controller/role.controller');
        const roleList=await roleController.getRoleList();
        if(roleList.length===0)
            await roleController.insertDefaultRole();
    }
    catch(err){
        throw err;
    }
}