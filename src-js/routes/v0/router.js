var express = require('express');
var router = express.Router();
var ErrorCodes = require('../../resources/errors/ErrorCodes')
var InvoiceValidator = require('../../scripts/validators/v0/InvoiceValidator')
var validateAgainstSchema = require('../../scripts/validators/v0/SchemaValidator')
router.post('/validator', function (req, res, next) {
    if (req.body.ubljson) {
        var document = JSON.parse(req.body["ubljson"]);
        var error;
        error = validateAgainstSchema(document, req.get('Link'))
        if (!error)
            error = InvoiceValidator(document.Invoice)
        if (error) {
            var err = new Error(error);
            err.status = 400;
            next(err);
        } else {
            res.setHeader('content-type', 'application/json');
            res.end("");
        }
    } else {
        var err = new Error('The body parameter \'ubljson\' is required.');
        err.status = 400;
        next(err);
    }
});

module.exports = router;
