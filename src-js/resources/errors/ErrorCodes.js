/**
 * Created by Kseniya on 1/21/2017.
 */
var ErrorCodes = {
    100: "Document is not valid against its schema.",
    101: "Missing required request parameter.",
    201: "An Invoice of more than $82.50 (including GST) to a GST-registered Buyer MUST be a Tax Invoice.",//unclear
    202: "An Invoice must contain a Document Type Code.",//unclear what is a Document Type Code
    203: "An Invoice MUST contain the Supplier’s Business Name or the ABN of the Supplier.",
    204: "An Invoice with a Total Amount greater than $1000 MUST have either the Buyer's Business Name or the ABN of the Buyer.",
    205: "An Invoice MAY contain the ABN plus a GST branch number for Suppliers with GST branches registered with the ATO.", //optional
    206: "An Invoice MUST contain an Invoice Issue Date.", //covered by json schema
    207: "An Invoice Line MUST have a Description.", //Invoice line has a string property "id" which is required, and an array of strings property "note" which is optional. what invoice line description supposed to be - id or note?
    208: "An Invoice MAY contain a Description of Properties of Invoiced Items.", //optional
    209: "An Invoice Line MAY contain an Invoiced Quantity.", //optional
    210: "An Invoice Line MUST contain the Invoice Line Extension Amount (Net Price multiplied by Invoiced Quantity) (excluding GST) for the Items sold.", //covered by json schema
    211: "An Invoice MUST contain the sum total of all Invoice Line Extension Amounts.", //doesn't covered by json schema if it is legalMonetaryTotal.lineExtensionAmount - make it required on schema level?
    212: "An Invoice Line MUST contain the GST Amount for the Items sold or indicate the extent to which Items are taxable.", //doesn't covered by json schema if it is legalMonetaryTotal.lineExtensionAmount - make it required on schema level?
    213: "An Invoice Line MUST contain the Amount Payable (Invoice Line Extension Amount plus GST Amount) for the Items sold.", //lineExtensionAmount is required but taxTotal array doesn't - should we make it required with min 1 element? but GST is a taxSubtotal, not taxTotal.taxAmount
    214: "An Invoice Line MAY contain a GST Amount of zero.", //optional, but we might need to check that CST is >=0
    215: "An Invoice Line MAY specify a GST Category.", //optional
    216: "An Invoice MUST contain the Invoice level Tax Amount exclusive of GST.", //does it mean that taxTotal MUST contain at least two taxSubtotal - one for GST and one exclusive of GST?
    217: "An Invoice MUST contain the Invoice level GST Total Amount.", //does it mean that taxTotal MUST contain at least two taxSubtotal - one for GST and one exclusive of GST?
    218: "An Invoice MUST have an Invoice Identifier.", //Invoice.id is required on json schema level
    219: "An Invoice MUST have a Supplier Business Name.", //crosses with 203
    220: "An Invoice MUST have a valid Document Type Code.", //code validation
    221: "An Invoice MUST have an Issue Date.", //seems to be duplicate of 206
    222: "An Invoice MAY have a Delivery Date.", //optional
    223: "An Invoice MAY have an Invoice Period.", //optional
    224: "An Invoice MAY have an Invoice Period Start Date.", //optional
    225: "An Invoice MAY have an Invoice Period End Date.", //optional
    226: "An Invoice End Period Date MUST be later or equal to an Invoice Period Start Date.",
    227: "An Invoice MAY have a Sales Order Identifier.",//optional
    228: "An Invoice MAY have a Purchase Order Identifier.",//optional
    229: "An Invoice MAY have a Contact Identifier.",//optional
    230: "An Invoice MAY have an Electronic Address.",//optional
    231: "An Invoice MUST have at least one Invoice Line.",// covered by json schema
    232: "An Invoice Line Item MAY have a Suppliers Item Identifier.",//optional
    233: "An Invoice Line Item MUST have a Description.",//item.description is an array with minItems=0, should we make it 1?
    234: "An Invoice Line MAY have a Quantity.",//optional
    235: "An Invoice Line MAY have a Net Amount.",//optional
    236: "An Invoice Line MAY have a Dispatch Advice Identifier.",//optional
    237: "An Invoice Line MAY have a Receipt Advice Identifier.",//optional
    238: "An Invoice Line MAY have a delivery Address.",//optional
    239: "An Invoice Line Item MAY have a Country of Origin.",//optional
    240: "An Invoice MAY have one or more Document References.",//optional
    241: "The Invoice Level Net Amount MUST be equal to the sum of Invoice Line Net Amounts.",//
    242: "The Invoice Level Allowance Amount MUST be equal to the sum of Invoice Line Allowances plus any Invoice Level Allowances.",//
    243: "The Invoice Level Charge Amount MUST be equal to the sum of Invoice Line Charges plus any Invoice Level Charges.",//
    244: "The Invoice Level Net Amount MUST be equal to the Invoice Level Gross Amount - Invoice Level Allowance Amount + Invoice Level Charge Amount.",//taxExclusiveAmount == (lineExtensionAmount - allowanceTotalAmount + chargeTotalAmount)
    245: "The Invoice Level GST Amount MUST be equal to the sum of Invoice Line GST Amounts.",//
    246: "The Invoice Level Total Amount MUST be equal to the Invoice Level Net Amount + the Invoice Level Tax Amount.",//
    247: "An Invoice MAY have an Amount Payable.",//optional, but payableAmount is required property of legalMonetaryTotal
    248: "An Invoice MUST have an Invoice Level Total Amount.",//but isn't it the same to an Amount Payable or it taxInclusiveAmount?
    249: "An Invoice MAY have an Invoice Level Net Amount.",//optional, is it taxExclusiveAmount?
    250: "An Invoice MAY have a Related Invoice Identifier.",//optional, but doesn't clear what property it is
    251: "An Invoice MAY have one or more Document References.",//optional, despatchDocumentReference, receiptDocumentReference, contractDocumentReference, additionalDocumentReference
    252: "An Invoice Level Total Amount MUST be greater than 0.",//optional, is it taxExclusiveAmount?
    253: "An Invoice Line MAY have a Net Amount."//optional, is it invoiceLine.lineExtensionAmount?
}

module.exports = ErrorCodes;
