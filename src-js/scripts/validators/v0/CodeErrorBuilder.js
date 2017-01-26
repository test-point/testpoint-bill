/**
 * Created by Kseniya on 1/22/2017.
 */
var ErrorCodes = require('../../../resources/errors/ErrorCodes')

function buildError(code, pointer) {
    var result = {"code": code};
    if (code && ErrorCodes[code]) {
        var error = ErrorCodes[code];

        if (error.title)
            result["title"] = error.title;

        if (error.detail)
            result["detail"] = error.detail

        if (error.pointer || error.parameter || pointer)
            result["source"] = {}

        if (error.pointer)
            result["source"]["pointer"] = error.pointer

        else if (pointer)
            result["source"]["pointer"] = pointer

        if (error.parameter)
            result["source"]["parameter"] = error.parameter
    }
    else {
        console.log("Unknown error code: " + code)
        title = "Unknown error has occurred."
    }
    return result

}

module.exports = buildError