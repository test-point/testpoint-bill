/**
 * Created by Kseniya on 1/24/2017.
 */
var fs = require('fs');
var CodeErrorBuilder = require('../CodeErrorBuilder')


function validation(invoice) {
    //country code
    var elements = [];
    var errors = [];
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.payableAmount) {
        elements.push({
            value: invoice.legalMonetaryTotal.payableAmount,
            invoiceTypeCode: invoice.invoiceTypeCode,
            pointer: '#/invoice.invoiceTypeCode'
        });
    }
    var codes = undefined;
    if (elements.length > 0) {
    }
    for (i in elements) {
        var element = elements[i];
        var error = countryCodeValidation(element.value, element.pointer, element.invoiceTypeCode)
        if (error)
            errors.push(error);
    }
    return errors;
}

function countryCodeValidation(value, pointer, invoiceTypeCode) {
    if (invoiceTypeCode != 388 && value > 82.5) {
        var codes = JSON.parse(fs.readFileSync('./resources/codes/DocumentTypeCode-2.1.json').toString());
        for (i in codes.CodeList.Codes) {
            if (codes.CodeList.Codes[i].Code == invoiceTypeCode) {
                invoiceTypeCode = invoiceTypeCode.concat('('+codes.CodeList.Codes[i].Name+')');
            }
        }
        var error = CodeErrorBuilder("Code-201", pointer);

        error.detail = error.detail.replace('{value}', value)
            .replace('{invoice type code}', invoiceTypeCode);
        return error;
    }

}

module.exports = validation