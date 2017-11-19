<?php

namespace App\Classes\Validators;


class Rule219InvoiceNoLineDesc extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $invoiceLines = $invoiceData[$this->type]['invoiceLine'] ?? [];
        foreach($invoiceLines as $kk => $invoiceLine) {
            if (empty($invoiceLine['item']['description'])) {
                $errors[] = [
                    'pointer' => '#/invoice.invoiceLine.item['.$kk.'].description',
                    'dataElementName' => 'description',
                ];
            }
        }

        if (!empty($errors)) {
            return ['code' => 219, 'errors' => $errors];
        }
    }
}