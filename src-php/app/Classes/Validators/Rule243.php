<?php

namespace App\Classes\Validators;


class Rule243 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();
        if (!empty($invoiceData[$this->type]['paymentMeans'])) {
            foreach ($invoiceData[$this->type]['paymentMeans'] as $mk => $paymentMeanEntry) {
                if (!empty($paymentMeanEntry['paymentMeansCode']) && $paymentMeanEntry['paymentMeansCode'] == 48) {
                    if (!empty($paymentMeanEntry['payerFinancialAccount']['financialInstitutionBranch']['id']) && is_array($paymentMeanEntry['payerFinancialAccount']['financialInstitutionBranch']['id'])) {
                        foreach ($paymentMeanEntry['payerFinancialAccount']['financialInstitutionBranch']['id'] as $bk => $branch) {
                            if (strlen($branch) > 6 || strlen($branch) < 4) {
                                $errors[] = [
                                    'value' => $branch ?? null,
                                    'pointer' => '#/invoice.paymentMeans[' . $mk . '].payerFinancialAccount.financialInstitutionBranch.id.' . $bk . '',
                                    'dataElementName' => $bk,
                                ];
                            }
                        }
                    }
                }
            }
            if (!empty($errors)) {
                return ['code' => 243, 'errors' => $errors];
            }
        }
    }
}