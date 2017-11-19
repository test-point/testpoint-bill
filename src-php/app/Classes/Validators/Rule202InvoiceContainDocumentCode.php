<?php

namespace App\Classes\Validators;


class Rule202InvoiceContainDocumentCode extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();

        $invoiceTypeCodesData = json_decode(file_get_contents(resource_path('codes/DocumentTypeCode-2.1.json')), true);
        $invoiceTypeCodes = array_column($invoiceTypeCodesData['CodeList']['Codes'], 'Code');

        $invoiceTypeCode = $invoiceData[$this->type]['invoiceTypeCode'] ?? '';
        if (!in_array($invoiceTypeCode, $invoiceTypeCodes)) {
            $errors[] = [
                'value' => $invoiceTypeCode,
                'pointer' => '#/invoice.invoiceTypeCode',
                'dataElementName' => 'invoiceTypeCode',
            ];
        }

        if (!empty($errors)) {
            return ['code' => 202, 'errors' => $errors];
        }
    }
}