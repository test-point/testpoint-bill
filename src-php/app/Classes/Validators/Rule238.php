<?php

namespace App\Classes\Validators;


class Rule238 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if (!empty($line['allowanceCharge']) && is_array($line['allowanceCharge'])) {
                    foreach ($line['allowanceCharge'] as $ck => $charge) {
                        if (!empty($charge['amount']) && $charge['amount'] <= 0 && $charge['chargeIndicator']) {
                            $errors[] = [
                                'value' => $charge['amount'],
                                'pointer' => '#/invoice.invoiceLine[' . $lk . '].allowanceCharge[' . $ck . '].amount',
                                'dataElementName' => 'amount',
                            ];
                            $errors[] = [
                                'value' => $charge['chargeIndicator'],
                                'pointer' => '#/invoice.invoiceLine[' . $lk . '].allowanceCharge[' . $ck . '].chargeIndicator',
                                'dataElementName' => 'chargeIndicator',
                            ];
                        }
                    }
                }
            }
        }

        if (!empty($errors)) {
            return ['code' => 238, 'errors' => $errors];
        }
    }
}