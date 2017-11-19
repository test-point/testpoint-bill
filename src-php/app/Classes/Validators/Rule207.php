<?php

namespace App\Classes\Validators;


class Rule207 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $invoiceLines = $invoiceData[$this->type]['invoiceLine'] ?? [];
        foreach($invoiceLines as $kk => $invoiceLine) {
            $total = $invoiceLine['lineExtensionAmount'] ?? 0;
            $quantity = $invoiceLine['invoicedQuantity']['value'] ?? 0;
            $price = $invoiceLine['price']['priceAmount'] ?? 0;
            if ($total != $quantity * $price) {
                $errors[] = [
                    'value' => $total,
                    'pointer' => '#/invoice.invoiceLine['.$kk.'].lineExtensionAmount',
                    'dataElementName' => 'lineExtensionAmount',
                ];
                $errors[] = [
                    'value' => $quantity,
                    'pointer' => '#/invoice.invoiceLine['.$kk.'].invoicedQuantity.value',
                    'dataElementName' => 'value',
                ];
                $errors[] = [
                    'value' => $price,
                    'pointer' => '#/invoice.invoiceLine['.$kk.'].price.priceAmount',
                    'dataElementName' => 'lineExtensionAmount',
                ];
            }
        }

        if (!empty($errors)) {
            return ['code' => 207, 'errors' => $errors];
        }
    }
}