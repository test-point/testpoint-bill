<?php

namespace App\Classes\Validators;


class Rule220 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $sumOfInvoiceLineNetAmounts = 0;

        $invoiceLevelNetAmount = $invoiceData[$this->type]['legalMonetaryTotal']['lineExtensionAmount'] ?? 0;

        $errors[] = [
            'value' => $invoiceLevelNetAmount,
            'pointer' => '#/invoice.legalMonetaryTotal.lineExtensionAmount',
            'dataElementName' => 'lineExtensionAmount',
        ];

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $kk => $line) {
                if (!empty($line['lineExtensionAmount'])) {
                    $sumOfInvoiceLineNetAmounts += $line['lineExtensionAmount'];
                    $errors[] = [
                        'value' => $line['lineExtensionAmount'],
                        'pointer' => '#/invoice.invoiceLine[' . $kk . '].lineExtensionAmount',
                        'dataElementName' => 'lineExtensionAmount',
                    ];
                }
            }
        }
        if ($invoiceLevelNetAmount != $sumOfInvoiceLineNetAmounts) {
            return ['code' => 220, 'errors' => $errors];
        }
    }
}