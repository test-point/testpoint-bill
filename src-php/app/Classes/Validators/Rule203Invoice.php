<?php

namespace App\Classes\Validators;


class Rule203Invoice extends AbstractValidator
{

    public function validate()
    {
        $invoiceData = $this->requestData->all();

        $invoiceSupplierParty = $invoiceData[$this->type]['accountingSupplierParty']['party'] ?? [];

        $isValid = false;
        if (!empty($invoiceSupplierParty['partyIdentification'])) {
            foreach ($invoiceSupplierParty['partyIdentification'] as $identification) {
                if (!empty($identification['ABN'])) {
                    $isValid = true;
                }
            }
        }
        if (!empty($invoiceSupplierParty['partyName'])) {
            foreach ($invoiceSupplierParty['partyName'] as $identification) {
                if (!empty($identification['name'])) {
                    $isValid = true;
                }
            }
        }

        if (!$isValid) {
            return ['code' => 203];
        }
    }
}