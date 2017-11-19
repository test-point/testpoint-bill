<?php

namespace App\Classes\Validators;


class Rule231 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (!empty($invoiceData[$this->type]['allowanceCharge']) && is_array($invoiceData[$this->type]['allowanceCharge'])) {
            foreach ($invoiceData[$this->type]['allowanceCharge'] as $ck => $charge) {
                if (!empty($charge['amount']) && $charge['amount'] <= 0 && !$charge['chargeIndicator']) {
                    $errors[] = [
                        'value' => $charge['amount'],
                        'pointer' => '#/invoice.allowanceCharge[' . $ck . '].amount',
                        'dataElementName' => 'amount',
                    ];
                    $errors[] = [
                        'value' => $charge['chargeIndicator'],
                        'pointer' => '#/invoice.allowanceCharge[' . $ck . '].chargeIndicator',
                        'dataElementName' => 'chargeIndicator',
                    ];
                }
            }
        }

        if (!empty($errors)) {
            return ['code' => 231, 'errors' => $errors];
        }
    }
}