/**
 * Created by Kseniya on 1/22/2017.
 */
var fs = require('fs');
var Ajv = require('ajv');
var parse = require('parse-link-header');
var ErrorBuilder = require('./ErrorBuilder')

function validate(document, reqLinkHeader, next) {
    var errors = [];
    var ajv = new Ajv();
    var linkHeader = parse(reqLinkHeader)
    var jsonSchema, validate, documentType;
    if (document["Invoice"]) {
        documentType = "Invoice";
    } else if (document["ApplicationResponse"]) {
        documentType = "Response";
    }
    switch (documentType) {
        case "Invoice":
            if (linkHeader && linkHeader.describedby) {
                //TODO: add a check for the attached schema
            }
            jsonSchema = JSON.parse(fs.readFileSync('./resources/schemas/Invoice.json').toString());
            break;
        case "Response":
            if (linkHeader && linkHeader.describedby) {
                //TODO: add a check for the attached schema
            }
            jsonSchema = JSON.parse(fs.readFileSync('./resources/schemas/Response.json').toString());
            break;
        default:
            console.error("Unknown document type")
    }

    var validate = ajv.compile(jsonSchema);
    console.log('Validating.');
    var valid = validate(document);
    if (!valid) {
        console.log('Validation failed.');
        console.log('Validation errors:');
        console.error(validate.errors);
        for (i in validate.errors) {
            var error = translateSchemaValidationError(validate.errors[i], "100");
            errors.push(error);
        }
    }
    if (errors.length > 0)
        return {Errors: errors};
}

function translateSchemaValidationError(error, code) {
    var link, title, detail, pointer, parameter;

    if (error.dataPath)
        pointer = error.schemaPath;
    if (error.keyword == "type") {
        if (error.message)
            detail = "Incorrect type. Type " + error.message
    }

    return ErrorBuilder(code, link, detail, pointer, parameter)
}

module.exports = validate

