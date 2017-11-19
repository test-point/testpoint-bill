<?php

namespace App\Classes\Validators;


class Rule223 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $taxExclusiveAmount = $invoiceData[$this->type]['legalMonetaryTotal']['taxExclusiveAmount'] ?? 0;
        $lineExtensionAmount = $invoiceData[$this->type]['legalMonetaryTotal']['lineExtensionAmount'] ?? 0;
        $allowanceTotalAmount = $invoiceData[$this->type]['legalMonetaryTotal']['allowanceTotalAmount'] ?? 0;
        $chargeTotalAmount = $invoiceData[$this->type]['legalMonetaryTotal']['chargeTotalAmount'] ?? 0;

        if ($taxExclusiveAmount != ($lineExtensionAmount - $allowanceTotalAmount + $chargeTotalAmount)) {

            $errors[] = [
                'value' => $taxExclusiveAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.taxExclusiveAmount',
                'dataElementName' => 'taxExclusiveAmount',
            ];

            $errors[] = [
                'value' => $lineExtensionAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.lineExtensionAmount',
                'dataElementName' => 'lineExtensionAmount',
            ];

            $errors[] = [
                'value' => $allowanceTotalAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.allowanceTotalAmount',
                'dataElementName' => 'allowanceTotalAmount',
            ];

            $errors[] = [
                'value' => $chargeTotalAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.chargeTotalAmount',
                'dataElementName' => 'chargeTotalAmount',
            ];
            return ['code' => 223, 'errors' => $errors];
        }
    }
}