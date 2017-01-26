var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var validator = require('./routes/v0/router');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var router = express.Router();

app.get('/', function (req, res) {
    res.redirect('http://testpoint.io/bill')
});

app.use('/api/v0', validator);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());


app.use(express.static(__dirname + '/resources'));
app.use(express.static(path.join(__dirname, 'public')));


request('https://raw.githubusercontent.com/ausdigital/ausdigital-bill/master/ubl-json/spec/v1.0.0/Invoice.json').pipe(fs.createWriteStream('resources/schemas/Invoice.json'));
request('https://raw.githubusercontent.com/ausdigital/ausdigital-bill/master/ubl-json/spec/v1.0.0/Response.json').pipe(fs.createWriteStream('resources/schemas/Response.json'));

request('https://raw.githubusercontent.com/ausdigital/ausdigital-code/master/ubl-json/codes/extended/DocumentTypeCode-2.1.json').pipe(fs.createWriteStream('resources/codes/DocumentTypeCode-2.1.json'));
request('https://raw.githubusercontent.com/ausdigital/ausdigital-code/master/ubl-json/codes/standard/AllowanceChargeReasonCode-2.1.json').pipe(fs.createWriteStream('resources/codes/AllowanceChargeReasonCode-2.1.json'));
request('https://raw.githubusercontent.com/ausdigital/ausdigital-code/master/ubl-json/codes/standard/PaymentMeansCode-2.1.json').pipe(fs.createWriteStream('resources/codes/PaymentMeansCode-2.1.json'));
request('https://raw.githubusercontent.com/ausdigital/ausdigital-code/master/ubl-json/codes/standard/CountryIdentificationCode-2.1.json').pipe(fs.createWriteStream('resources/codes/CountryIdentificationCode-2.1.json'));
request('https://raw.githubusercontent.com/ausdigital/ausdigital-code/master/ubl-json/codes/standard/CurrencyCode-2.1.json').pipe(fs.createWriteStream('resources/codes/CurrencyCode-2.1.json'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Request Path Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    var status = err.status || 500;
    res.status(status);
    console.log('err.message: ' + JSON.stringify(err.message))
    var message
    try {
        message = JSON.parse(err.message)
    } catch (e) {
        console.log("Error message is not a JSON object. Building an Error object");
        message = {"Error": {"code": status, "title": err.message}}
    }
    if (message.Errors) {
        console.log('message.Errors' + message.Errors)
        res.end(JSON.stringify({Errors: [message.Errors]}));
    } else {
        res.end(JSON.stringify({Errors: [message.Error]}));
    }

});


module.exports = app;
