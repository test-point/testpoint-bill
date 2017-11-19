<?php

namespace App\Classes\Validators;


class Rule201Invoice extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $payeableAmount = $invoiceData[$this->type]['legalMonetaryTotal']['payableAmount'] ?? '';
        $invoiceTypeCode = $invoiceData[$this->type]['invoiceTypeCode'] ?? '';
        if ($payeableAmount && $payeableAmount > 82.5 && $invoiceTypeCode && $invoiceTypeCode != 388) {
            $errors[] = [
                'value' => $invoiceTypeCode,
                'pointer' => '#/invoice.invoiceTypeCode',
                'dataElementName' => 'invoiceTypeCode',
            ];
            $errors[] = [
                'value' => $payeableAmount,
                'pointer' => '#/invoice.legalMonetaryTotal.payableAmount',
                'dataElementName' => 'payableAmount',
            ];
        }

        if (!empty($errors)) {
            return ['code' => 201, 'errors' => $errors];
        }
    }
}