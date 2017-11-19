<?php

namespace App\Classes\Validators;


class Rule102CountryCode extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $invoiceData = $this->requestData->all();
        $countriesData = json_decode(file_get_contents(resource_path('codes/CountryIdentificationCode-2.1.json')), true);
        $countries = array_column($countriesData['CodeList']['Codes'], 'Code');
        if ($countries) {
            $supplierPartyCountry = $invoiceData[$this->type]['accountingSupplierParty']['party']['postalAddress']['country'] ?? false;
            if ($supplierPartyCountry && !in_array($supplierPartyCountry, $countries)) {
                $errors[] = [
                    'value' => $supplierPartyCountry,
                    'pointer' => '#/invoice.accountingCustomerParty.party.postalAddress.country',
                    'dataElementName' => 'country',
                ];
            }
            $customerPartyCountry = $invoiceData[$this->type]['accountingCustomerParty']['party']['postalAddress']['country'] ?? false;
            if ($customerPartyCountry && !in_array($customerPartyCountry, $countries)) {
                $errors[] = [
                    'value' => $customerPartyCountry,
                    'pointer' => '#/invoice.accountingCustomerParty.party.postalAddress.country',
                    'dataElementName' => 'country',
                ];
            }
            $payeePartyCountry = $invoiceData[$this->type]['payeeParty']['postalAddress']['country'] ?? false;
            if ($payeePartyCountry && !in_array($payeePartyCountry, $countries)) {
                $errors[] = [
                    'value' => $payeePartyCountry,
                    'pointer' => '#/invoice.payeeParty.postalAddress.country',
                    'dataElementName' => 'country',
                ];
            }
            if ($invoiceData[$this->type]['delivery']) {
                foreach ($invoiceData[$this->type]['delivery'] as $k => $delivery) {
                    $deliveryCountry = $delivery['deliveryAddress']['country'] ?? false;
                    if ($deliveryCountry && !in_array($deliveryCountry, $countries)) {
                        $errors[] = [
                            'value' => $deliveryCountry,
                            'pointer' => '#/invoice.delivery[' . $k . '].deliveryAddress.country',
                            'dataElementName' => 'country',
                        ];
                    }

                    $deliverypartyCountry = $delivery['deliveryParty']['postalAddress']['country'] ?? false;
                    if ($deliverypartyCountry && !in_array($deliverypartyCountry, $countries)) {
                        $errors[] = [
                            'value' => $deliverypartyCountry,
                            'pointer' => '#/invoice.delivery[' . $k . '].deliveryParty.postalAddress.country',
                            'dataElementName' => 'country',
                        ];
                    }
                }
            }
        }
        if (!empty($errors)) {
            return ['code' => 102, 'errors' => $errors];
        }
    }
}