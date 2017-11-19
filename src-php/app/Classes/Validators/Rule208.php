<?php

namespace App\Classes\Validators;


class Rule208 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (empty($invoiceData[$this->type]['legalMonetaryTotal']['lineExtensionAmount'])) {
            $errors[] = [
                'pointer' => '#/invoice.legalMonetaryTotal.lineExtensionAmount',
                'dataElementName' => 'lineExtensionAmount',
            ];
        }

        if (!empty($errors)) {
            return ['code' => 208, 'errors' => $errors];
        }
    }
}