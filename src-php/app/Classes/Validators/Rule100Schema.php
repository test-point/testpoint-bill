<?php

namespace App\Classes\Validators;

use Validator;

class Rule100Schema extends AbstractValidator
{

    public function validate()
    {
        $errors = [];
        $dereferencer = \League\JsonReference\Dereferencer::draft4();
        $schema = $dereferencer->dereference('file://' . resource_path('schemas/' . $this->type . '.json'));
        $validator = new \League\JsonGuard\Validator(json_decode(json_encode($this->requestData->all())), $schema);

        if ($validator->fails()) {
            foreach ($validator->errors() as $error) {
                $dataPath = $error->getDataPath();
                if (is_array($error->getCause()) && count($error->getCause())) {
                    foreach ($error->getCause() as $cause) {
                        $errors[] = [
                            'pointer' => '#' . $dataPath . '/' . $cause,
                            'dataElementName' => $cause,
                            'title' => trim(array_first(explode('[', $error->getMessage())), '()') . ': ' . $cause,
                        ];
                    }
                } else {
                    $errors[] = [
                        'pointer' => '#' . $dataPath,
                        'dataElementName' => array_last(explode('/', $dataPath)),
                        'title' => $error->getMessage(),
                    ];
                }
            }
            return ['code' => 100, 'errors' => $errors];
        }
    }
}