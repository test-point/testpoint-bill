<?php

namespace App\Http\Controllers\v0;

use App\Classes\UblValidator;
use App\Exceptions\UblValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ValidationController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request)
    {
        $urlValidator = new UblValidator($request);

        try {
            $urlValidator->validateAllRules();
        } catch (UblValidationException $e) {
            return response()->json($e->getFields(), 422);
        }
        return response()->json(['success' => 'ok']);
    }
}
