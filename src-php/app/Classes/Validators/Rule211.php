<?php

namespace App\Classes\Validators;


class Rule211 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (empty($invoiceData[$this->type]['legalMonetaryTotal']['taxExclusiveAmount'])) {
            $errors[] = [
                'pointer' => '#/invoice.legalMonetaryTotal.taxExclusiveAmount',
                'dataElementName' => 'taxExclusiveAmount',
            ];
        }

        if (!empty($errors)) {
            return ['code' => 211, 'errors' => $errors];
        }
    }
}