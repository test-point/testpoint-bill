<?php

namespace App\Classes\Validators;


class Rule209 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if(empty($line['taxTotal'][0]['taxAmount'])) {
                    $errors[] = [
                        'pointer' => '#/invoice.invoiceLine['.$lk.'].taxTotal.taxAmount',
                        'dataElementName' => 'taxAmount',
                    ];
                }
            }
        }

        if (!empty($errors)) {
            return ['code' => 209, 'errors' => $errors];
        }
    }
}