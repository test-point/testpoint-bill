<?php

namespace App\Classes\Validators;


class Rule242 extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();
        if (!empty($invoiceData[$this->type]['paymentMeans'])) {
            foreach ($invoiceData[$this->type]['paymentMeans'] as $mk => $paymentMeanEntry) {
                if (!empty($paymentMeanEntry['payerFinancialAccount'])) {
                    if (empty($paymentMeanEntry['payerFinancialAccount']['id'])) {
                        $errors[] = [
                            'pointer' => '#/invoice.paymentMeans[' . $mk . '].payerFinancialAccount.id',
                            'dataElementName' => 'id',
                        ];
                    }
                }
                if (!empty($paymentMeanEntry['payeeFinancialAccount'])) {
                    if (empty($paymentMeanEntry['payeeFinancialAccount']['id'])) {
                        $errors[] = [
                            'pointer' => '#/invoice.paymentMeans[' . $mk . '].payeeFinancialAccount.id',
                            'dataElementName' => 'id',
                        ];
                    }
                }
            }
        }
        if (!empty($errors)) {
            return ['code' => 242, 'errors' => $errors];
        }
    }
}