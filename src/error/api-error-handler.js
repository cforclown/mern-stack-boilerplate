const ErrorDump = require("../error-dump");
const dro = require("../dro");

function apiErrorHandler(err, req, res, next) {
    ErrorDump(err);

    if (err instanceof Error) {
        return res.status(err.status ? err.status : 500).send(dro.errorResponse(err.message));
    }

    return res.status(500).send(dro.errorResponse("Something went wrong"));
}

module.exports = apiErrorHandler;
