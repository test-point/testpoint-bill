<?php

namespace App\Classes\Validators;


class Rule237 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $allowanceChargeReasons = [];

        $allowanceChargeReasonsData = json_decode(file_get_contents(resource_path('codes/AllowanceChargeReasonCode-2.1.json')), true);
        foreach (array_column($allowanceChargeReasonsData['CodeList']['Codes'], 'Code') as $row) {
            @$allowanceChargeReasons[$row['Code']] = $row['Name'];
        }

        if (!empty($invoiceData[$this->type]['invoiceLine']) && is_array($invoiceData[$this->type]['invoiceLine'])) {
            foreach ($invoiceData[$this->type]['invoiceLine'] as $lk => $line) {
                if (!empty($line['allowanceCharge']) && is_array($line['allowanceCharge'])) {
                    foreach ($line['allowanceCharge'] as $ck => $charge) {
                        if (!empty($charge['allowanceChargeReasonCode']) && !$charge['chargeIndicator']) {
                            if (empty($allowanceChargeReasons[$charge['allowanceChargeReasonCode']]) ||
                                !in_array($allowanceChargeReasons[$charge['allowanceChargeReasonCode']], $charge['allowanceChargeReason'])) {
                                $errors[] = [
                                    'value' => $charge['allowanceChargeReasonCode'],
                                    'pointer' => '#/invoice.allowanceCharge[' . $ck . '].allowanceChargeReasonCode',
                                    'dataElementName' => 'allowanceChargeReasonCode',
                                ];
                                $errors[] = [
                                    'value' => $charge['chargeIndicator'],
                                    'pointer' => '#/invoice.allowanceCharge[' . $ck . '].chargeIndicator',
                                    'dataElementName' => 'chargeIndicator',
                                ];
                                if (!empty($charge['allowanceChargeReason']) && is_array($charge['allowanceChargeReason'])) {
                                    foreach ($charge['allowanceChargeReason'] as $crk => $reason) {
                                        $errors[] = [
                                            'value' => $reason,
                                            'pointer' => '#/invoice.allowanceCharge[' . $ck . '].allowanceChargeReason[' . $crk . ']',
                                            'dataElementName' => 'allowanceChargeReason[' . $crk . ']',
                                        ];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!empty($errors)) {
            return ['code' => 237, 'errors' => $errors];
        }
    }
}