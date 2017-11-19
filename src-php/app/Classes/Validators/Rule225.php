<?php

namespace App\Classes\Validators;


class Rule225 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $payableAmount = $invoiceData[$this->type]['legalMonetaryTotal']['payableAmount'] ?? 0;

        if ($payableAmount <= 0) {
            $errors[] = [
                'value' => $payableAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.payableAmount',
                'dataElementName' => 'payableAmount',
            ];
            return ['code' => 225, 'errors' => $errors];
        }
    }
}