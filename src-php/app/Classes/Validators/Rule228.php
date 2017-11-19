<?php

namespace App\Classes\Validators;


class Rule228 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if (!empty($line['lineExtensionAmount'])) {
                    $lineExtensionAmount = $line['lineExtensionAmount'];
                    $tempErrors = [];
                    if (!empty($line['allowanceCharge']) && is_array($line['allowanceCharge'])) {
                        foreach ($line['allowanceCharge'] as $ak => $allowanceCharge) {
                            if (!empty($allowanceCharge['amount'])) {
                                if ($allowanceCharge['chargeIndicator']) {
                                    $lineExtensionAmount += $allowanceCharge['amount'];
                                } else {
                                    $lineExtensionAmount -= $allowanceCharge['amount'];
                                }
                            }
                            $tempErrors[] = [
                                'value' => $allowanceCharge['amount'],
                                'pointer' => '#/invoice.invoiceLine[' . $lk . '].allowanceCharge[' . $ak . '].amount',
                                'dataElementName' => 'amount',
                            ];
                            $tempErrors[] = [
                                'value' => $allowanceCharge['chargeIndicator'],
                                'pointer' => '#/invoice.invoiceLine[' . $lk . '].allowanceCharge[' . $ak . '].chargeIndicator',
                                'dataElementName' => 'chargeIndicator',
                            ];
                        }
                    }
                    if ($lineExtensionAmount < 0) {
                        $errors += $tempErrors;
                    }
                }
            }
        }

        if (!empty($errors)) {
            return ['code' => 228, 'errors' => $errors];
        }
    }
}