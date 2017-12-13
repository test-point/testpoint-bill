<?php

$router->post('/api/v0/validator', 'v0\\ValidationController@index');
$router->get('/', function(){
    return redirect()->to('http://testpoint.io/bill');
});
