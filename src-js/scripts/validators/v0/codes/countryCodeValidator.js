/**
 * Created by Kseniya on 1/24/2017.
 */
var fs = require('fs');
var CodeErrorBuilder = require('../CodeErrorBuilder')

function codesValidation(invoice) {
    //country code
    var elements = [];
    var errors = [];
    if (invoice.accountingSupplierParty && invoice.accountingSupplierParty.party &&
        invoice.accountingSupplierParty.party.postalAddress && invoice.accountingSupplierParty.party.postalAddress.country) {
        elements.push({
            value: invoice.accountingSupplierParty.party.postalAddress.country,
            pointer: '#/invoice.accountingSupplierParty.party.postalAddress.country',
            dataElementName: 'country',
        });
    }
    if (invoice.accountingCustomerParty && invoice.accountingCustomerParty.party &&
        invoice.accountingCustomerParty.party.postalAddress && invoice.accountingCustomerParty.party.postalAddress.country) {
        elements.push({
            value: invoice.accountingCustomerParty.party.postalAddress.country,
            pointer: '#/invoice.accountingCustomerParty.party.postalAddress.country',
            dataElementName: 'country',
        });
    }
    if (invoice.payeeParty && invoice.payeeParty.postalAddress && invoice.payeeParty.postalAddress.country) {
        elements.push({
            value: invoice.payeeParty.postalAddress.country,
            pointer: '#/invoice.payeeParty.postalAddress.country',
            dataElementName: 'country',
        });
    }
    if (invoice.delivery) {
        for (i in invoice.delivery) {
            var delivery = invoice.delivery[i];
            if (delivery.deliveryAddress && delivery.deliveryAddress.country) {
                elements.push({
                    value: delivery.deliveryAddress.country,
                    pointer: '#/invoice.delivery[i].deliveryAddress.country'.replace('[i]', '[' + i + ']'),
                    dataElementName: 'country',
                });
            }
            if (delivery.deliveryParty && delivery.deliveryParty.postalAddress && delivery.deliveryParty.postalAddress.country) {
                elements.push({
                    value: delivery.deliveryParty.postalAddress.country,
                    pointer: '#/invoice.delivery[i].deliveryParty.postalAddress.country'.replace('[i]', '[' + i + ']'),
                    dataElementName: 'country',
                });
            }
        }
    }
    var codes = undefined;
    if (elements.length > 0) {
        codes = JSON.parse(fs.readFileSync('./resources/codes/CountryIdentificationCode-2.1.json').toString());
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