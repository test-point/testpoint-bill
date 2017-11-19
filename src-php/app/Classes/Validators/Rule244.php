<?php

namespace App\Classes\Validators;


class Rule244 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $supplierBusinessName = array_column($invoiceData[$this->type]['accountingSupplierParty']['party']['partyName'] ?? [], 'name');

        if (!empty($invoiceData[$this->type]['paymentMeans'])) {
            foreach ($invoiceData[$this->type]['paymentMeans'] as $mk => $paymentMeanEntry) {
                if (!empty($paymentMeanEntry['payeeFinancialAccount']['financialInstitutionBranch']['name']) &&
                    !in_array($paymentMeanEntry['payeeFinancialAccount']['financialInstitutionBranch']['name'], $supplierBusinessName)) {
                    $errors[] = [
                        'value' => $paymentMeanEntry['payeeFinancialAccount']['financialInstitutionBranch']['name'],
                        'pointer' => '#/invoice.paymentMeans[' . $mk . '].payeeFinancialAccount.financialInstitutionBranch.name',
                        'dataElementName' => 'id',
                    ];

                    foreach ($supplierBusinessName as $bk => $supplierBusiness) {
                        $errors[] = [
                            'value' => $supplierBusiness,
                            'pointer' => '#/invoice.accountingSupplierParty.party.partyName[' . $bk . '].name',
                            'dataElementName' => 'name',
                        ];
                    }
                }
            }
            if (!empty($errors)) {
                return ['code' => 244, 'errors' => $errors];
            }
        }
    }
}