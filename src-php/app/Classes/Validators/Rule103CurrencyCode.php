<?php

namespace App\Classes\Validators;


class Rule103CurrencyCode extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();
        $currenciesData = json_decode(file_get_contents(resource_path('codes/CurrencyCode-2.1.json')), true);
        $currencies = array_column($currenciesData['CodeList']['Codes'], 'Code');
        if ($currencies) {
            $documentCurrency = $invoiceData[$this->type]['documentCurrencyCode'] ?? '';
            if (!$documentCurrency || !in_array($documentCurrency, $currencies)) {
                $errors[] = [
                    'value' => $documentCurrency,
                    'pointer' => '#/invoice.documentCurrencyCode',
                    'dataElementName' => 'documentCurrencyCode',
                ];
            }
        }
        if (!empty($errors)) {
            return ['code' => 103, 'errors' => $errors];
        }
    }
}