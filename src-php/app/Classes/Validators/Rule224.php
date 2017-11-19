<?php

namespace App\Classes\Validators;


class Rule224 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $invoiceLevelGSTAmount = $sumOfGSTAmounts = 0;
        if (!empty($invoiceData[$this->type]['taxTotal']) && is_array($invoiceData[$this->type]['taxTotal'])) {
            foreach ($invoiceData[$this->type]['taxTotal'] as $k => $invoiceTax) {
                if (!empty($invoiceTax['taxAmount'])) {
                    $invoiceLevelGSTAmount += $invoiceTax['taxAmount'];
                    $errors[] = [
                        'value' => $invoiceTax['taxAmount'],
                        'pointer' => '#/invoice.taxTotal[' . $k . '].lineExtensionAmount',
                        'dataElementName' => 'lineExtensionAmount',
                    ];
                }
            }
        }

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if (!empty($line['taxTotal']) && is_array($line['taxTotal'])) {
                    foreach ($line['taxTotal'] as $tlk => $lineTotal) {
                        if (!empty($lineTotal['taxAmount'])) {
                            $sumOfGSTAmounts += $lineTotal['taxAmount'];
                            $errors[] = [
                                'value' => $lineTotal['taxAmount'],
                                'pointer' => '#/invoice.invoiceLine[' . $lk . '].taxTotal[' . $tlk . '].taxAmount',
                                'dataElementName' => 'lineExtensionAmount',
                            ];
                        }
                    }
                }
            }
        }


        if ($sumOfGSTAmounts != $invoiceLevelGSTAmount) {
            return ['code' => 224, 'errors' => $errors];
        }
    }
}