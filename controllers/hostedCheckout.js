var express = require('express');
var gatewayService = require('../service/gatewayService');
var router = express.Router();
var utils = require('../scripts/util/commonUtils');
var view_path = '../templates';
var config = require('../scripts/config/config');
/**
* Display page for Hosted Checkout operation
*
* @return response for hostedCheckout.ejs
*/
router.get('/hostedCheckout', function (request, response, next) {
    var orderId = utils.keyGen(10);
    var requestData = {
        "apiOperation": "CREATE_CHECKOUT_SESSION",
        "order": {
            "id": orderId,
            "currency": utils.getCurrency()
        }
    }
    var apiRequest = { orderId: orderId };
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.getSession(requestData, function (result) {
        response.render(view_path + '/hostedCheckout', {
            "baseUrl": config.TEST_GATEWAY.BASEURL,
            "apiVersion": config.TEST_GATEWAY.API_VERSION,
            "orderId": orderId,
            "merchant": result.merchant,
            "result": result.result,
            "session": {
                "id": result.session.id,
                "updateStatus": result.session.updateStatus,
                "version": result.session.version
            },
            "successIndicator": result.successIndicator,
            "returnUrl": '/process/hostedCheckout/'
        });
        next();
    });
});
router.get('/hostedCheckout/:orderId/:successIndicator/:sessionId', function (request, response, next) {
    var sessionIndicator = request.params.successIndicator;
    var orderId = request.params.orderId;
    var sessionId = request.params.sessionId;
    var resdata = {
        "orderId": orderId,
        "sessionId": sessionId,
        "baseUrl": config.TEST_GATEWAY.BASEURL,
        "apiVersion": config.TEST_GATEWAY.API_VERSION,
        "merchant": '',
        "result": '',
        "session": {
            "id": sessionId,
            "updateStatus": '',
            "version": ''
        },
        "successIndicator": sessionIndicator,
        "returnUrl": '/process/hostedCheckout/'
    };
    response.render(view_path + '/hostedCheckout', resdata);
});
/**
* This method receives the callback from the Hosted Checkout redirect. It looks up the order using the RETRIEVE_ORDER operation and
* displays either the receipt or an error page.
*
* @param orderId needed to retrieve order
* @param result of Hosted Checkout operation (success or error) - sent from hostedCheckout.ejs complete() callback
* @return for hostedCheckoutReceipt page or error page
*/
router.get('/hostedCheckout/:orderId/:result', function (request, response, next) {
    var result = request.params.result;
    var orderId = request.params.orderId;
    if (result == "SUCCESS") {
        var apiRequest = { orderId: orderId };
        var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
        gatewayService.paymentResult(requestUrl, function (error, result) {
            if (error) {
                var reserror = {
                    error: true,
                    title: "hostedCheckoutReceipt",
                    cause: "Payment was unsuccessful",
                    explanation: "There was a problem completing your transaction.",
                    field: null,
                    validationType: null
                }
                response.render(view_path + '/error', reserror);
            } else {
                var ressuccess = {
                    error: false,
                    cause: "Payment was successful",
                    message: "Your transaction was successfully completed",
                    resbody: JSON.parse(result)
                }
                response.render(view_path + '/hostedCheckoutReceipt', { title: "hostedCheckoutReceipt", resbody: ressuccess });
            }
        });
    } else {
        var reserror = {
            error: true,
            title: "hostedCheckoutReceipt",
            cause: "Payment was unsuccessful",
            explanation: "There was a problem completing your transaction.",
            field: null,
            validationType: null
        }
        response.render(view_path + '/error', reserror);
        next();
    }
});
module.exports = router;