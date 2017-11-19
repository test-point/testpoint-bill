<?php

namespace App\Exceptions;


class UblValidationException extends \Exception
{
    protected $_fields;

    public function __construct($message = "", $code = 0, \Exception $previous = NULL, $fields = [])
    {
        $this->_fields = $fields;
        parent::__construct($message, $code, $previous);
    }

    public function getFields()
    {
        return $this->_fields;
    }
}