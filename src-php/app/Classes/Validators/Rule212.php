<?php

namespace App\Classes\Validators;


class Rule212 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (empty($invoiceData[$this->type]['legalMonetaryTotal']['taxInclusiveAmount'])) {
            $errors[] = [
                'pointer' => '#/invoice.legalMonetaryTotal.taxInclusiveAmount',
                'dataElementName' => 'taxInclusiveAmount',
            ];
        }

        if (!empty($errors)) {
            return ['code' => 212, 'errors' => $errors];
        }
    }
}