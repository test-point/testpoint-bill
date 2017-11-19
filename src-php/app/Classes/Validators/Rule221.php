<?php

namespace App\Classes\Validators;


class Rule221 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $sumOfAllowanceAmounts = 0;

        $invoiceLevelAllowanceAmount = $invoiceData[$this->type]['legalMonetaryTotal']['allowanceTotalAmount'] ?? 0;

        $errors[] = [
            'value' => $invoiceLevelAllowanceAmount,
            'pointer' => '#/invoice.legalMonetaryTotal.allowanceTotalAmount',
            'dataElementName' => 'allowanceTotalAmount',
        ];

        if (!empty($invoiceData[$this->type]['allowanceCharge']) && is_array($invoiceData[$this->type]['allowanceCharge'])) {
            foreach ($invoiceData[$this->type]['allowanceCharge'] as $kk => $changeEntry) {
                if (!empty($changeEntry['amount']) && empty($changeEntry['chargeIndicator']) ) {
                    $sumOfAllowanceAmounts += $changeEntry['amount'];
                    $errors[] = [
                        'value' => $changeEntry['amount'],
                        'pointer' => '#/invoice.allowanceCharge[' . $kk . '].amount',
                        'dataElementName' => 'amount',
                    ];
                }
            }
        }

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $kk => $line) {
                if (!empty($line['allowanceCharge']) && is_array($line['allowanceCharge'])) {
                    foreach ($line['allowanceCharge'] as $kk1 => $chargeEntry1) {
                        if (!empty($chargeEntry1['amount']) && empty($chargeEntry1['chargeIndicator']) ) {
                            $sumOfAllowanceAmounts += $chargeEntry1['amount'];
                            $errors[] = [
                                'value' => $chargeEntry1['amount'],
                                'pointer' => '#/invoice.invoiceLine[' . $kk . '].allowanceCharge[' . $kk1 . '].amount',
                                'dataElementName' => 'amount',
                            ];
                        }
                    }
                }
            }
        }
        if ($invoiceLevelAllowanceAmount != $sumOfAllowanceAmounts) {
            return ['code' => 221, 'errors' => $errors];
        }
    }
}