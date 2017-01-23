/**
 * Created by Kseniya on 1/21/2017.
 */
var fs = require('fs');
var ErrorBuilder = require('./ErrorCodeBuilder')

function validate(invoice, next) {
    if (!invoice) {
        //TODO: build an error
        return
    }

    var errorCode = validate203(invoice)
    if (!errorCode)
        errorCode = validate204(invoice)
    if (!errorCode)
        errorCode = validate220(invoice)
    if (!errorCode)
        errorCode = validate226(invoice)
    if (!errorCode)
        errorCode = validate241(invoice)
    if (!errorCode)
        errorCode = validate242(invoice)
    if (!errorCode)
        errorCode = validate243(invoice)
    if (!errorCode)
        errorCode = validate244(invoice)
    if (!errorCode)
        errorCode = validate245(invoice)
    if (!errorCode)
        errorCode = validate246(invoice)
    if (!errorCode)
        errorCode = validate252(invoice)
    if (errorCode) {
        return ErrorBuilder(errorCode);
    }
}

function validate203(invoice) {
    var check;
    if (invoice && invoice.accountingSupplierParty && invoice.accountingSupplierParty.party) {
        check = checkPartyABNOrName(invoice.accountingSupplierParty.party);
    }
    if (!check) {
        return 203;
    }
}

function validate204(invoice) {
    var check;
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.payableAmount) {
        var payableAmount = invoice.legalMonetaryTotal.payableAmount;
        if (payableAmount <= 1000) {
            return
        }
    }
    if (invoice && invoice.accountingCustomerParty && invoice.accountingCustomerParty.party) {
        check = checkPartyABNOrName(invoice.accountingCustomerParty.party);
    }
    if (!check) {
        return 204;
    }
}

function checkPartyABNOrName(party) {
    if (party.partyIdentification) {
        for (pI in party.partyIdentification) {
            var partyIdentification = party.partyIdentification[pI];
            if (partyIdentification.ABN) {
                return true;
            }
        }
    }
    if (party.partyName) {
        for (pI in party.partyName) {
            var partyName = party.partyName[pI];
            if (partyName.name) {
                return true;
            }
        }
    }
}

function validate220(invoice) {
    if (invoice && invoice.invoiceTypeCode) {
        var code = invoice.invoiceTypeCode;
        console.log("Looking up for document code type: " + code)
        var documentCodes = JSON.parse(fs.readFileSync('./resources/codes/DocumentTypeCode-2.1.json').toString());
        for (i in documentCodes.CodeList.Codes) {
            if (documentCodes.CodeList.Codes[i].Code == code) {
                console.log("Document code type: " + code + " was found.")
                return
            }
        }
        console.log("Missing document code type: " + code)
        //TODO: build a complete error
        return 220;
    }
}

function validate226(invoice) {
    if (invoice && invoice.invoicePeriod) {
        for (i in invoice.invoicePeriod) {
            var invoicePeriod = invoice.invoicePeriod[i];
            if (invoicePeriod.startDate && invoicePeriod.endDate) {
                if (invoicePeriod.startDate > invoicePeriod.endDate) {
                    console.log('end date ' + invoicePeriod.endDate + ' is earlier than start date ' + invoicePeriod.startDate)
                    //TODO: build a complete error
                    return 226;
                }
            }
        }
    }
}

function validate241(invoice) {
    var invoiceLevelNetAmount = 0, sumOfInvoiceLineNetAmounts = 0;
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.lineExtensionAmount) {
        invoiceLevelNetAmount = invoice.legalMonetaryTotal.lineExtensionAmount;
    }
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.lineExtensionAmount) {
                console.log('invoiceLine.lineExtensionAmount', invoiceLine.lineExtensionAmount)
                sumOfInvoiceLineNetAmounts += invoiceLine.lineExtensionAmount;
            }
        }
    }
    console.log('invoiceLevelNetAmount - ' + invoiceLevelNetAmount)
    console.log('sumOfInvoiceLineNetAmounts - ' + sumOfInvoiceLineNetAmounts)
    if (invoiceLevelNetAmount != sumOfInvoiceLineNetAmounts) {
        //TODO: build a complete error
        return 241;
    }

}

function validate242(invoice) {
    var invoiceLevelAllowanceAmount = 0, sumOfAllowanceAmounts = 0;
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.allowanceTotalAmount) {
        invoiceLevelAllowanceAmount = invoice.legalMonetaryTotal.allowanceTotalAmount;
    }
    if (invoice.allowanceCharge) {
        var invoiceAllowanceCharge = invoice.allowanceCharge[j];
        if (invoiceAllowanceCharge.amount) {
            if (!invoiceAllowanceCharge.chargeIndicator) {
                sumOfAllowanceAmounts += invoiceAllowanceCharge.amount;
            }
        }
    }
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.allowanceCharge) {
                for (j in invoiceLine.allowanceCharge) {
                    var invoiceLineAllowanceCharge = invoiceLine.allowanceCharge[j];
                    if (invoiceLineAllowanceCharge.amount) {
                        if (!invoiceLineAllowanceCharge.chargeIndicator) {
                            sumOfAllowanceAmounts += invoiceLineAllowanceCharge.amount;
                        }
                    }
                }
            }
        }
    }
    console.log('invoiceLevelAllowanceAmount - ' + invoiceLevelAllowanceAmount)
    console.log('sumOfAllowanceAmounts - ' + sumOfAllowanceAmounts)
    if (invoiceLevelAllowanceAmount != sumOfAllowanceAmounts) {
        //TODO: build a complete error
        return 242;
    }
}

function validate243(invoice) {
    var invoiceLevelChargeTotalAmount = 0, sumOfChargeAmounts = 0;
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.chargeTotalAmount) {
        invoiceLevelChargeTotalAmount = invoice.legalMonetaryTotal.chargeTotalAmount;
    }
    if (invoice.allowanceCharge) {
        var invoiceAllowanceCharge = invoice.allowanceCharge[j];
        if (invoiceAllowanceCharge.amount) {
            if (invoiceAllowanceCharge.chargeIndicator) {
                sumOfChargeAmounts += invoiceAllowanceCharge.amount;
            }
        }
    }
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.allowanceCharge) {
                for (j in invoiceLine.allowanceCharge) {
                    var invoiceLineAllowanceCharge = invoiceLine.allowanceCharge[j];
                    if (invoiceLineAllowanceCharge.amount) {
                        if (invoiceLineAllowanceCharge.chargeIndicator) {
                            sumOfChargeAmounts += invoiceLineAllowanceCharge.amount;
                        }
                    }
                }
            }
        }
    }
    console.log('invoiceLevelChargeTotalAmount - ' + invoiceLevelChargeTotalAmount)
    console.log('sumOfChargeAmounts - ' + sumOfChargeAmounts)
    if (invoiceLevelChargeTotalAmount != sumOfChargeAmounts) {
        //TODO: build a complete error
        return 243;
    }
}

function validate244(invoice) {
    var taxExclusiveAmount = 0, lineExtensionAmount = 0, allowanceTotalAmount = 0, chargeTotalAmount = 0;
    if (invoice && invoice.legalMonetaryTotal) {
        if (invoice.legalMonetaryTotal.taxExclusiveAmount) {
            taxExclusiveAmount = invoice.legalMonetaryTotal.taxExclusiveAmount;
        }
        if (invoice.legalMonetaryTotal.lineExtensionAmount) {
            lineExtensionAmount = invoice.legalMonetaryTotal.lineExtensionAmount;
        }
        if (invoice.legalMonetaryTotal.allowanceTotalAmount) {
            allowanceTotalAmount = invoice.legalMonetaryTotal.allowanceTotalAmount;
        }
        if (invoice.legalMonetaryTotal.chargeTotalAmount) {
            chargeTotalAmount = invoice.legalMonetaryTotal.chargeTotalAmount;
        }
    }
    if (taxExclusiveAmount != (lineExtensionAmount - allowanceTotalAmount + chargeTotalAmount)) {
        //TODO: build a complete error
        return 244;
    }
}

function validate245(invoice) {
    var invoiceLevelGSTAmount = 0, sumOfGSTAmounts = 0;
    if (invoice && invoice.taxTotal) {
        for (i in invoice.taxTotal) {
            var taxTotal = invoice.taxTotal[i];
            if (taxTotal.taxAmount) {
                console.log('taxTotal.taxAmount', taxTotal.taxAmount)
                invoiceLevelGSTAmount += taxTotal.taxAmount;
            }
        }
    }
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.taxTotal) {
                for (j in invoiceLine.taxTotal) {
                    var taxTotal = invoiceLine.taxTotal[j];
                    if (taxTotal.taxAmount) {
                        console.log('taxTotal.taxAmount', taxTotal.taxAmount)
                        sumOfGSTAmounts += taxTotal.taxAmount;
                    }
                }
            }
        }
    }
    console.log('invoiceLevelGSTAmount - ' + invoiceLevelGSTAmount)
    console.log('sumOfGSTAmounts - ' + sumOfGSTAmounts)
    if (invoiceLevelGSTAmount != sumOfGSTAmounts) {
        //TODO: build a complete error
        return 245;
    }

}

function validate246(invoice) {
    var invoiceLevelTaxAmount = 0, taxExclusiveAmount = 0, payableAmount = 0;
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.payableAmount) {
        payableAmount = invoice.legalMonetaryTotal.payableAmount;
    }
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.taxExclusiveAmount) {
        taxExclusiveAmount = invoice.legalMonetaryTotal.taxExclusiveAmount;
    }
    if (invoice && invoice.taxTotal) {
        for (i in invoice.taxTotal) {
            var taxTotal = invoice.taxTotal[i];
            if (taxTotal.taxAmount) {
                invoiceLevelTaxAmount += taxTotal.taxAmount;
            }
        }
    }
    if (payableAmount != (taxExclusiveAmount + invoiceLevelTaxAmount)) {
        //TODO: build a complete error
        return 246;
    }

}

function validate252(invoice) {
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.hasOwnProperty('payableAmount')) {
        var payableAmount = invoice.legalMonetaryTotal.payableAmount;
        if(payableAmount<=0)
        //TODO: build a complete error
            return 252;
    }
}



module.exports = validate