<?php

namespace App\Classes;

use App\Exceptions\UblValidationException;

class UblValidator
{

    private $requestData;
    private $type;

    public function __construct($request)
    {
        $this->requestData = $request;
        $this->type = $request->has('Invoice') ? 'Invoice' : 'Response';
    }

    public function validateAllRules()
    {
        foreach ($this->getValidationClasses() as $className) {
            $errors = $this->validateClass($className);
            if($errors){
                throw new UblValidationException('', 0, null, buildResponse($errors));
            }
        }
    }

    private function getValidationClasses()
    {
        return [
            'Rule100Schema',
            'Rule102CountryCode',
            'Rule103CurrencyCode',
            'Rule202InvoiceContainDocumentCode',
            'Rule201Invoice',
            'Rule203Invoice',
            'Rule204Invoice',
            'Rule229',
            'Rule231',
            'Rule232',
            'Rule233',
            'Rule234',

            'Rule235',
            'Rule238',

            'Rule236',
            'Rule239',

            'Rule237',
            'Rule240',

            'Rule207',
            'Rule208',
//            'Rule209',
            'Rule211',
            'Rule212',
            'Rule217',
            'Rule219InvoiceNoLineDesc',
            'Rule220',
            'Rule221',
            'Rule222',
            'Rule223',
            'Rule224',
            'Rule225',
            'Rule227',
            'Rule228',
            'Rule241',
            'Rule242',
            'Rule243',
            'Rule244',


        ];
    }

    private function validateClass($className)
    {
        $className = '\App\Classes\Validators\\' . $className;
        $class = new $className($this->requestData, $this->type);
        return $class->validate();
    }
}