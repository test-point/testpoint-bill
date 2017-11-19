<?php

namespace App\Classes\Validators;


class Rule229 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if (!empty($line['price']['priceAmount']) && $line['price']['priceAmount'] < 0) {
                    $errors[] = [
                        'value' => $line['price']['priceAmount'],
                        'pointer' => '#/invoice.invoiceLine[' . $lk . '].price.priceAmount',
                        'dataElementName' => 'priceAmount',
                    ];
                }

            }
        }

        if (!empty($errors)) {
            return ['code' => 229, 'errors' => $errors];
        }
    }
}