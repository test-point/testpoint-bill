/**
 * Created by Kseniya on 1/22/2017.
 */
var ErrorCodes = require('../../../resources/errors/ErrorCodes')

function buildError(code, link, detail, pointer, parameter) {
    var title;
    var result = {};

    if(code && ErrorCodes[code])
        title = ErrorCodes[code]
    else {
        console.log("Unknown error code: " + code)
        title = "Unknown error has occurred."
    }

    if (link)
        result["link"] = link

    if (code)
        result["code"] = code

    if (title)
        result["title"] = title

    if (detail)
        result["detail"] = detail

    if (pointer || parameter)
        result["source"] = {}

    if (pointer)
        result["source"]["pointer"] = pointer

    if (parameter)
        result["source"]["parameter"] = parameter

    return result

}

module.exports = buildError