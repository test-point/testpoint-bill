<?php

namespace App\Classes\Validators;


use Carbon\Carbon;

class Rule217 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $startDate = $invoiceData[$this->type]['invoicePeriod'][0]['startDate'] ?? false;
        $endDate = $invoiceData[$this->type]['invoicePeriod'][0]['endDate'] ?? false;
        if($startDate || $endDate) {
            if (!Carbon::parse($startDate)->lte(Carbon::parse($endDate))) {
                $errors[] = [
                    'value' => $invoiceData[$this->type]['invoicePeriod'][0]['startDate'] ?? '',
                    'pointer' => '#/invoice.invoicePeriod.startDate',
                    'dataElementName' => 'startDate',
                ];
                $errors[] = [
                    'value' => $invoiceData[$this->type]['invoicePeriod'][0]['endDate'] ?? '',
                    'pointer' => '#/invoice.invoicePeriod.endDate',
                    'dataElementName' => 'endDate',
                ];
            }
        }

        if (!empty($errors)) {
            return ['code' => 217, 'errors' => $errors];
        }
    }
}