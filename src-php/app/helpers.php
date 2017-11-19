<?php

function buildResponse($errorData)
{
    $response = [];
    $response['status'] = 'error';
    if (!empty($errorData['code'])) {
        $response['code'] = $errorData['code'];
        if ($code = \App\Classes\ResponseCodes::getTitle($errorData['code'])) {
            $response['title'] = $code;
        }
    }
//    if (!empty($errorData['link'])) {
//        $response['link'] = $errorData['link'];
//    }

//    if (!empty($errorData['detail'])) {
//        $response['detail'] = $errorData['detail'];
//    }

    if(!empty($errorData['errors'])){
        $response['errors'] = $errorData['errors'];
    }
    return $response;
}
