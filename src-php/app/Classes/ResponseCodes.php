<?php

namespace App\Classes;


class ResponseCodes
{
    private static $codes = [
        100 => [
            'title' => 'Document is not valid against its schema.',
        ],
        102 => [
            'title' => 'The country code value is not valid',
        ],
        103 => [
            'title' => 'The currency code value is not valid',
        ],
        201 => [
            'title' => 'An Invoice of more than $82.50 (including GST) to a GST-registered Buyer MUST be a Tax Invoice.',
        ],
        202 => [
            'title' => 'An Invoice must contain a valid Document Type Code.',
        ],
        203 => [
            'title' => 'An Invoice MUST contain the Supplier’s Business Name or the ABN of the Supplier.',
        ],
        //todo
        214 => [
            'title' => 'An Invoice MUST have a Supplier Business Name.',
        ],
        204 => [
            'title' => 'An Invoice with a Total Amount greater than $1000 MUST have either the Buyer\'s Business Name or the ABN of the Buyer.',
        ],
//        205 => [
//            'title' => 'An Invoice MUST contain an Invoice Issue Date.',
//        ],

        207 => [
            'title' => 'An Invoice Line MUST contain the Invoice Line Extension Amount (Net Price multiplied by Invoiced Quantity) (excluding GST) for the Items sold.',
        ],
        208 => [
            'title' => 'An Invoice MUST contain the sum total of all Invoice Line Extension Amounts.',
        ],
        //covered by json schema - invoiceLine.taxTotal.taxAmount
        209 => [
            'title' => 'An Invoice Line MUST contain the GST Amount for the Items sold or indicate the extent to which Items are taxable.',
        ],
        210 => [
            'title' => 'An Invoice Line MUST contain the Amount Payable (Invoice Line Extension Amount plus GST Amount) for the Items sold.',
        ],
        211 => [
            'title' => 'An Invoice MUST contain the Invoice level Tax Amount exclusive of GST.',
        ],
        212 => [
            'title' => 'An Invoice MUST contain the Invoice level GST Total Amount.',
        ],
//        213 => [
//            'title' => 'An Invoice MUST have an Invoice Identifier.',
//        ],


//        215 => [
//            'title' => 'An Invoice MUST have a valid Document Type Code.',
//        ],
//        216 => [
//            'title' => 'An Invoice MUST have an Issue Date.',
//        ],
        //todo - crosses with 217. How to validate 217 if one of fields defined
        215 => [
            'title' => 'An Invoice MAY have an Invoice Period Start Date.',
        ],
        216 => [
            'title' => 'An Invoice MAY have an Invoice Period End Date.',
        ],
        217 => [
            'title' => 'An Invoice End Period Date MUST be later or equal to an Invoice Period Start Date.',
        ],
//        218 => [
//            'title' => 'An Invoice MUST have at least one Invoice Line.',
//        ],
        //todo - item.description is an array with minItems=0, should we make it 1
        219 => [
            'title' => 'An Invoice Line Item MUST have a Description.',
        ],

        220 => [
            'title' => 'The Invoice Level Net Amount MUST be equal to the sum of Invoice Line Net Amounts.',
        ],

        221 => [
            'title' => 'The Invoice Level Allowance Amount MUST be equal to the sum of Invoice Line Allowances plus any Invoice Level Allowances.',
        ],

        222 => [
            'title' => 'The Invoice Level Charge Amount MUST be equal to the sum of Invoice Line Charges plus any Invoice Level Charges.',
        ],

        223 => [
            'title' => 'The Invoice Level Net Amount MUST be equal to the Invoice Level Gross Amount - Invoice Level Allowance Amount + Invoice Level Charge Amount.',
        ],

        224 => [
            'title' => 'The Invoice Level GST Amount MUST be equal to the sum of Invoice Line GST Amounts.',
        ],

        225 => [
            'title' => 'An Invoice Level Total Amount MUST be greater than 0.',
        ],

        //todo-later
        226 => [
            'title' => 'An Invoice MUST have an Invoice Level Total Amount.',
        ],

        227 => [
            'title' => 'The Invoice Level Total Amount MUST be equal to the Invoice Level Net Amount + the Invoice Level Tax Amount.',
        ],

        228 => [
            'title' => 'An Invoice Line Extended Amount after all allowances and charges MUST NOT be negative.',
        ],

        229 => [
            'title' => 'An Invoice Line Price MUST be 0 or more.',
        ],
        //required by schema
        230 => [
            'title' => 'An Invoice Line Item MUST have a Net Price.',
        ],

        231 => [
            'title' => 'An Invoice Level Allowance MUST be greater than 0.',
        ],
        232 => [
            'title' => 'An Invoice Level Charge MUST be greater than 0.',
        ],

        233 => [
            'title' => 'An Invoice Level Allowance Reason Description MUST match the Invoice Level Allowance Reason Code (if any).',
        ],

        234 => [
            'title' => 'An Invoice Level Charge Reason Description MUST match the Invoice Level Charge Reason Code (if any).',
        ],


        235 => [
            'title' => 'An Invoice Line Allowance MUST be greater than 0.',
        ],
        238 => [
            'title' => 'An Invoice Line Charge MUST be greater than 0.',
        ],


        236 => [
            'title' => 'An Invoice Line Allowance MUST have an Allowance Reason Description.',
        ],
        239 => [
            'title' => 'An Invoice Line Charge MUST have a Charge Reason Description.',
        ],


        237 => [
            'title' => 'An Invoice Line Allowance Reason Description MUST match the Invoice Line Allowance Reason Code (if any).',
        ],

        240 => [
            'title' => 'An Invoice Line Charge Reason Description MUST match the Invoice Line Charge Reason Code (if any).',
        ],


        241 => [
            'title' => 'A Payment Means MUST have a valid Payment Means Type Code.',
        ],


        242 => [
            'title' => 'A Payment Means Financial Institution Account Identifier MUST have Financial Institution Identifier.',
        ],

        243 => [
            'title' => 'A Payment Means for a card payment MUST state the last 4 to 6 digits of the Financial Institution Account Identifier.',
        ],

        244 => [
            'title' => 'An Invoice MUST have a Payee Business Name if Payee Business Name is not the same as the Suppliers Business Name.',
        ],

        //bill-invoice

        //todo-do
        245 => [
            'title' => 'A Tax Invoice for goods or services that do not all include GST (mixed supplies) shall indicate which goods or services do not include GST.',
        ],

        //bill-rcti

        246 => [
            'title' => 'A Recipient Created Tax Invoice MUST contain either the Business Name or the ABN of the Buyer.',
        ],
        247 => [
            'title' => 'A Recipient Created Tax Invoice MUST contain the Payee Name if GST is payable.',
        ],

        //bill-adjustment
        248 => [
            'title' => 'An Invoice MUST contain a Document Type Code indicating it is an adjustment document.',
        ],
        //creditnote
        249 => [
            'title' => 'The Credit Note Total Amount MUST be greater than 0.',
        ],
        250 => [
            'title' => 'The Credit Note Line Net Price MUST NOT be negative.',
        ],
        251 => [
            'title' => 'A Payment Means Type Code for a Credit MUST have a Financial Institution Account Identifier.',
        ],
    ];

    public static function getTitle($code)
    {
        if (!empty(self::$codes[$code]['title'])) {
            return self::$codes[$code]['title'];
        }
        return false;
    }
}