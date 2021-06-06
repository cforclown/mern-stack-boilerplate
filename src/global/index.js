const fs = require("fs");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const path = require("path");
const consoleOut = require("./console_out");

exports.DumpError = function (_err, saveLog = true) {
    if (require("../config").NODE_ENV === "test") return;

    console.log(consoleOut.TextError, "======================================================================");
    if (typeof _err === "object") {
        console.log(consoleOut.TextYellow, `MESSAGE: ${_err.message ? _err.message : ""}`);
        if (_err.codeMessage) console.log(consoleOut.TextYellow, "CODE_MSG: " + _err.codeMessage);
        if (_err.stack) {
            console.log(consoleOut.TextRed, "STACKTRACE------------------>");
            console.log(consoleOut.TextRed, _err.stack);
        }

        if (saveLog) {
            const errorMessage = `
            ============================================
            MESSAGE: ${_err.message ? _err.message : ""}
            STACKTRACE:
            ${_err.stack ? _err.stack : ""}
            ============================================
            `;

            const filename = moment().format("DD MMMM YYYY") + ".txt";
            fs.appendFile(path.join(__dirname, "../../dump-log/" + filename), errorMessage, (err) => {
                if (err) console.log(consoleOut.TextError, err.message);
                else console.log(consoleOut.TextRed, "Error saved");
            });
        }
    } else {
        console.log(consoleOut.TextError, "dumpError : argument is not an object");
    }
    console.log(consoleOut.TextError, "======================================================================");
};
exports.LogError = function (errText) {
    console.log(consoleOut.TextError, errText);
};
exports.LogBgGreen = function (text) {
    console.log(consoleOut.BgGreen, text);
};
exports.LogGreen = function (text) {
    console.log(consoleOut.TextGreen, text);
};
exports.Hash = async function (password) {
    return await CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex);
};
