<?php

namespace App\Classes\Validators;


class Rule241 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();
        $meanCodesData = json_decode(file_get_contents(resource_path('codes/PaymentMeansCode-2.1.json')), true);
        $paymentMeanCodes = array_column($meanCodesData['CodeList']['Codes'], 'Code');
        if ($paymentMeanCodes) {
            foreach ($invoiceData[$this->type]['paymentMeans'] as $mk => $paymentMeanEntry) {
                if (empty($paymentMeanEntry) || !in_array($paymentMeanEntry['paymentMeansCode'], $paymentMeanCodes)) {
                    $errors[] = [
                        'value' => $paymentMeanEntry['paymentMeansCode'],
                        'pointer' => '#/invoice.paymentMeans['.$mk.'].paymentMeansCode',
                        'dataElementName' => 'paymentMeansCode',
                    ];
                }
            }
        }
        if (!empty($errors)) {
            return ['code' => 241, 'errors' => $errors];
        }
    }
}