/**
 * Created by Kseniya on 1/21/2017.
 */
var fs = require('fs');
var ErrorBuilder = require('./ErrorCodeBuilder')

function validate(invoice) {
    if (!invoice) {
        //TODO: build an error
        return
    }

    var errorCode = validate201(invoice)
    if (!errorCode)
        errorCode = validate203(invoice)
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
    if (!errorCode)
        errorCode = validate254(invoice)
    if (!errorCode)
        errorCode = validate255(invoice)
    if (!errorCode)
        errorCode = validate259and263(invoice)
    if (!errorCode)
        errorCode = validate261and265(invoice)
    if (!errorCode)
        errorCode = validate267and271(invoice)
    if (!errorCode)
        errorCode = validate268and272(invoice)
    if (!errorCode)
        errorCode = validate269and273(invoice)
    if (!errorCode)
        errorCode = validate274(invoice)
    if (!errorCode)
        errorCode = validate275(invoice)
    if (!errorCode)
        errorCode = validate276(invoice)
    if (errorCode) {
        return ErrorBuilder(errorCode);
    }
}

function validate201(invoice) {
    if (invoice && invoice.legalMonetaryTotal && invoice.legalMonetaryTotal.payableAmount) {
        var payableAmount = invoice.legalMonetaryTotal.payableAmount;
        if (payableAmount >= 82.5) {
            var code = invoice.invoiceTypeCode;
            if (code != 388)
                return 201
        }
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
        for (i in invoice.allowanceCharge) {
            var invoiceAllowanceCharge = invoice.allowanceCharge[i];
            if (invoiceAllowanceCharge.amount) {
                if (!invoiceAllowanceCharge.chargeIndicator) {
                    sumOfAllowanceAmounts += invoiceAllowanceCharge.amount;
                }
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
        for (i in invoice.allowanceCharge) {
            var invoiceAllowanceCharge = invoice.allowanceCharge[i];
            if (invoiceAllowanceCharge.amount) {
                if (invoiceAllowanceCharge.chargeIndicator) {
                    sumOfChargeAmounts += invoiceAllowanceCharge.amount;
                }
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
        if (payableAmount <= 0)
        //TODO: build a complete error
            return 252;
    }
}

function validate254(invoice) {
    //An Invoice Line Extended Amount after all allowances and charges MUST NOT be negative.
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.lineExtensionAmount) {
                var lineExtensionAmount = invoiceLine.lineExtensionAmount;
                if (invoiceLine.allowanceCharge) {
                    for (j in invoiceLine.allowanceCharge) {
                        var invoiceLineAllowanceCharge = invoiceLine.allowanceCharge[j];
                        if (invoiceLineAllowanceCharge.amount) {
                            if (invoiceLineAllowanceCharge.chargeIndicator) {
                                lineExtensionAmount += invoiceLineAllowanceCharge.amount;
                            } else {
                                lineExtensionAmount -= invoiceLineAllowanceCharge.amount;
                            }
                        }
                    }
                }
                if (lineExtensionAmount < 0) {
                    return 254;
                }
            }
        }
    }
}

function validate255(invoice) {
    //An Invoice Line Price MUST be 0 or more.
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.price && invoiceLine.price.priceAmount) {
                var priceAmount = invoiceLine.price.priceAmount;
                if (priceAmount < 0) {
                    return 255;
                }
            }
        }
    }
}

function validate259and263(invoice) {
    //An Invoice Level Allowance MUST be greater than 0.
    if (invoice.allowanceCharge) {
        for (i in invoice.allowanceCharge) {
            var invoiceAllowanceCharge = invoice.allowanceCharge[i];
            if (invoiceAllowanceCharge.hasOwnProperty('amount')) {
                console.log('invoiceAllowanceCharge.amount', invoiceAllowanceCharge.amount)
                if (invoiceAllowanceCharge.amount <= 0) {
                    if (invoiceAllowanceCharge.chargeIndicator) {
                        return 263
                    }
                    else {
                        return 259
                    }
                }
            }
        }
    }
}

function validate261and265(invoice) {
    //An Invoice Level Allowance Reason Description MUST match the Invoice Level Allowance Reason Code (if any).
    if (invoice.allowanceCharge) {
        for (i in invoice.allowanceCharge) {
            var allowanceChargeReasonCode = undefined;
            var invoiceAllowanceCharge = invoice.allowanceCharge[i];
            var allowanceChargeReason = '';
            if (invoiceAllowanceCharge.allowanceChargeReasonCode) {
                allowanceChargeReasonCode = invoiceAllowanceCharge.allowanceChargeReasonCode;
            }
            if (invoiceAllowanceCharge.allowanceChargeReason) {
                for (j in invoiceAllowanceCharge.allowanceChargeReason) {
                    allowanceChargeReason += invoiceAllowanceCharge.allowanceChargeReason[j];
                }
            }
            console.log('allowanceChargeReason - ' + allowanceChargeReason)
            if (allowanceChargeReasonCode) {
                var allowanceChargeReasonCodes = JSON.parse(fs.readFileSync('./resources/codes/AllowanceChargeReasonCode-2.1.json').toString());
                for (i in allowanceChargeReasonCodes.CodeList.Codes) {
                    if (allowanceChargeReasonCodes.CodeList.Codes[i].Code == allowanceChargeReasonCode) {
                        console.log("Allowance charge reason code type: " + allowanceChargeReasonCode + " was found.")
                        console.log("Allowance charge reason : " + allowanceChargeReasonCodes.CodeList.Codes[i].Name)
                        if (allowanceChargeReasonCodes.CodeList.Codes[i].Name.indexOf(allowanceChargeReason) == -1) {
                            console.log("Mismatch between allowance charge reason code and reason.");
                            if (invoiceAllowanceCharge.chargeIndicator) {
                                return 265
                            } else {
                                return 261;
                            }
                        }
                    }
                }
                //console.log("Missing allowance charge reason code: " + allowanceChargeReasonCode)
                //TODO: build a complete error
            }
        }
    }
}

function validate267and271(invoice) {
    //An Invoice Line Allowance/Charge MUST be greater than 0.
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.lineExtensionAmount) {
                var lineExtensionAmount = invoiceLine.lineExtensionAmount;
                if (invoiceLine.allowanceCharge) {
                    for (j in invoiceLine.allowanceCharge) {
                        var invoiceLineAllowanceCharge = invoiceLine.allowanceCharge[j];
                        if (invoiceLineAllowanceCharge.hasOwnProperty('amount')) {
                            if (invoiceLineAllowanceCharge.amount <= 0) {
                                if (invoiceLineAllowanceCharge.chargeIndicator) {
                                    return 271
                                }
                                else {
                                    return 267
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function validate268and272(invoice) {
    //An Invoice Line Allowance/Charge MUST have an Allowance Reason Description.
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.allowanceCharge) {
                for (j in invoiceLine.allowanceCharge) {
                    var invoiceLineAllowanceCharge = invoiceLine.allowanceCharge[j];
                    if (!invoiceLineAllowanceCharge.allowanceChargeReason) {
                        if (invoiceLineAllowanceCharge.chargeIndicator) {
                            return 272
                        }
                        else {
                            return 268
                        }
                    }
                }
            }
        }
    }
}

function validate269and273(invoice) {
    //An Invoice Line Allowance/Charge Reason Description MUST match the Invoice Line Charge Reason Code (if any).
    //An Invoice Line Allowance/Charge Reason Description MUST match the Invoice Line Charge Reason Code (if any).
    if (invoice && invoice.invoiceLine) {
        for (i in invoice.invoiceLine) {
            var invoiceLine = invoice.invoiceLine[i];
            if (invoiceLine.allowanceCharge) {
                for (i in invoiceLine.allowanceCharge) {
                    var allowanceChargeReasonCode = undefined;
                    var invoiceAllowanceCharge = invoiceLine.allowanceCharge[i];
                    var allowanceChargeReason = '';
                    if (invoiceAllowanceCharge.allowanceChargeReasonCode) {
                        allowanceChargeReasonCode = invoiceAllowanceCharge.allowanceChargeReasonCode;
                    }
                    if (invoiceAllowanceCharge.allowanceChargeReason) {
                        for (j in invoiceAllowanceCharge.allowanceChargeReason) {
                            allowanceChargeReason += invoiceAllowanceCharge.allowanceChargeReason[j];
                        }
                    }
                    console.log('allowanceChargeReason - ' + allowanceChargeReason)
                    if (allowanceChargeReasonCode) {
                        var allowanceChargeReasonCodes = JSON.parse(fs.readFileSync('./resources/codes/AllowanceChargeReasonCode-2.1.json').toString());
                        for (i in allowanceChargeReasonCodes.CodeList.Codes) {
                            if (allowanceChargeReasonCodes.CodeList.Codes[i].Code == allowanceChargeReasonCode) {
                                console.log("Allowance charge reason code type: " + allowanceChargeReasonCode + " was found.")
                                console.log("Allowance charge reason : " + allowanceChargeReasonCodes.CodeList.Codes[i].Name)
                                if (allowanceChargeReasonCodes.CodeList.Codes[i].Name.indexOf(allowanceChargeReason) == -1) {
                                    console.log("Mismatch between allowance charge reason code and reason.");
                                    if (invoiceAllowanceCharge.chargeIndicator) {
                                        return 273
                                    } else {
                                        return 269;
                                    }
                                }
                            }
                        }
                        //console.log("Missing allowance charge reason code: " + allowanceChargeReasonCode)
                        //TODO: build a complete error
                    }
                }
            }
        }
    }
}

function validate274(invoice) {
    //A Payment Means MUST have a valid Payment Means Type Code.
    if (invoice && invoice.paymentMeans) {
        for (i in invoice.paymentMeans) {
            var paymentMeansCodes = JSON.parse(fs.readFileSync('./resources/codes/PaymentMeansCode-2.1.json').toString());
            var paymentMeans = invoice.paymentMeans[i]
            if (paymentMeans.paymentMeansCode) {
                var code = paymentMeans.paymentMeansCode;
                console.log("Looking up for payment means code: " + code)
                for (i in paymentMeansCodes.CodeList.Codes) {
                    if (paymentMeansCodes.CodeList.Codes[i].Code == code) {
                        console.log("Payment Means code: " + code + " was found.")
                        return
                    }
                }
                console.log("Missing payment means code: " + code)
                //TODO: build a complete error
                return 274;
            }
        }
    }
}

function validate275(invoice) {
    //A Payment Means Financial Institution Account Identifier MUST have Financial Institution Identifier.
    if (invoice && invoice.paymentMeans) {
        for (i in invoice.paymentMeans) {
            var paymentMeans = invoice.paymentMeans[i]
            if (paymentMeans.payerFinancialAccount) {
                if (!paymentMeans.payerFinancialAccount.id || paymentMeans.payerFinancialAccount.id == '')
                    return 275;
            }
            if (paymentMeans.payeeFinancialAccount) {
                if (!paymentMeans.payeeFinancialAccount.id || paymentMeans.payeeFinancialAccount.id == '')
                    return 275;
            }
        }
    }
}

function validate276(invoice) {
    //A Payment Means for a card payment MUST state the last 4 to 6 digits of the Financial Institution Account Identifier.
    if (invoice && invoice.paymentMeans) {
        for (i in invoice.paymentMeans) {
            var paymentMeans = invoice.paymentMeans[i]
            if (paymentMeans.paymentMeansCode) {
                var code = paymentMeans.paymentMeansCode;
                if (code == "48") {//"Bank card."
                    if (paymentMeans.payerFinancialAccount && paymentMeans.payerFinancialAccount.id) {
                        var id = paymentMeans.payerFinancialAccount.id;
                        if (id.length > 6 || id.length < 4 || id % 1 !== 0) {
                            return 276
                        }
                    }
                }
            }
        }
    }
}


module.exports = validate