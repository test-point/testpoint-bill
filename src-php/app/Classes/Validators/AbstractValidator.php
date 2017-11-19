<?php

namespace App\Classes\Validators;

use App\Exceptions\UblValidationException;

abstract class AbstractValidator
{
    protected $type;
    protected $requestData;

    public function __construct($request, $type)
    {
        $this->requestData = $request;
        $this->type = $type;
    }

    abstract public function validate();
}