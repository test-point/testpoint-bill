<?php

namespace App\Classes\Validators;


class Rule204Invoice extends AbstractValidator
{

    public function validate()
    {
        $invoiceData = $this->requestData->all();

        $invoiceCustomerParty = $invoiceData[$this->type]['accountingCustomerParty']['party'] ?? [];
        $payableAmount = $invoiceData[$this->type]['legalMonetaryTotal']['payableAmount'] ?? 0;

        $isValid = true;
        if($payableAmount > 1000) {
            $isValid = false;
            if (!empty($invoiceCustomerParty['partyIdentification'])) {
                foreach ($invoiceCustomerParty['partyIdentification'] as $identification) {
                    if (!empty($identification['ABN'])) {
                        $isValid = true;
                    }
                }
            }
            if (!empty($invoiceCustomerParty['partyName'])) {
                foreach ($invoiceCustomerParty['partyName'] as $identification) {
                    if (!empty($identification['name'])) {
                        $isValid = true;
                    }
                }
            }
        }

        if (!$isValid) {
            return ['code' => 204];
        }
    }
}