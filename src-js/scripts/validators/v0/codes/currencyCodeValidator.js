/**
 * Created by Kseniya on 1/24/2017.
 */
var fs = require('fs');
var CodeErrorBuilder = require('../CodeErrorBuilder')

function codesValidation(invoice) {
    //country code
    var elements = [];
    var errors = [];
    if (invoice.documentCurrencyCode) {
        elements.push({
            value: invoice.documentCurrencyCode,
            pointer: '#/invoice.documentCurrencyCode',
            dataElementName: 'documentCurrencyCode',
        });
    }
    var codes = undefined;
    if (elements.length > 0) {
        codes = JSON.parse(fs.readFileSync('./resources/codes/CurrencyCode-2.1.json').toString());
    }
    for (i in elements) {
        var element = elements[i];
        var error = countryCodeValidation(element.value, element.dataElementName, codes, element.pointer)
        if (error)
            errors.push(error);
    }
    return errors;
}

function countryCodeValidation(countryCode, dataElementName, codes, pointer) {
    var listName = codes.CodeList.SchemeIdentification.ListName;
    for (i in codes.CodeList.Codes) {
        if (codes.CodeList.Codes[i].Code == countryCode) {
            console.log("Country Code: " + countryCode + " was found.")
            return
        }
    }
    var error = CodeErrorBuilder("Code-02", pointer);
    console.log(error.detail.replace('{code value}', countryCode));
    error.detail = error.detail.replace('{code value}', countryCode)
        .replace('{data element name}', dataElementName).replace('{list name}', listName);
    return error;
}

module.exports = codesValidation