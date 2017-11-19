<?php

namespace App\Classes\Validators;


class Rule222 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $sumOfAllowanceAmounts = 0;

        $invoiceLevelChargeAmount = $invoiceData[$this->type]['legalMonetaryTotal']['chargeTotalAmount'] ?? 0;

        $errors[] = [
            'value' => $invoiceLevelChargeAmount,
            'pointer' => '#/invoice.legalMonetaryTotal.chargeTotalAmount',
            'dataElementName' => 'chargeTotalAmount',
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
        if ($invoiceLevelChargeAmount != $sumOfAllowanceAmounts) {
            return ['code' => 222, 'errors' => $errors];
        }
    }
}