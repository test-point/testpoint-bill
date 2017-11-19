<?php

namespace App\Classes\Validators;


class Rule227 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $invoiceLevelTaxAmount = $taxExclusiveAmount = $payableAmount = 0;
        $payableAmount = $invoiceData[$this->type]['legalMonetaryTotal']['payableAmount'] ?? 0;
        $errors[] = [
            'value' => $payableAmount,
            'pointer' => '#/invoice.legalMonetaryTotal.payableAmount',
            'dataElementName' => 'payableAmount',
        ];

        $taxExclusiveAmount = $invoiceData[$this->type]['legalMonetaryTotal']['taxExclusiveAmount'] ?? 0;

        $errors[] = [
            'value' => $taxExclusiveAmount,
            'pointer' => '#/invoice.legalMonetaryTotal.taxExclusiveAmount',
            'dataElementName' => 'taxExclusiveAmount',
        ];

        if (!empty($invoiceData[$this->type]['taxTotal']) && is_array($invoiceData[$this->type]['taxTotal'])) {
            foreach ($invoiceData[$this->type]['taxTotal'] as $k => $invoiceTax) {
                if (!empty($invoiceTax['taxAmount'])) {
                    $invoiceLevelTaxAmount += $invoiceTax['taxAmount'];
                    $errors[] = [
                        'value' => $invoiceTax['taxAmount'],
                        'pointer' => '#/invoice.taxTotal[' . $k . '].lineExtensionAmount',
                        'dataElementName' => 'lineExtensionAmount',
                    ];
                }
            }
        }

        if ($payableAmount != ($taxExclusiveAmount + $invoiceLevelTaxAmount)) {
            return ['code' => 227, 'errors' => $errors];
        }
    }
}