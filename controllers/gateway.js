var express = require('express');
var gatewayService = require('../service/gatewayService');
var router = express.Router();
var view_path = '../templates';
var https = require('https');
function handleResponse(result, request, response) {
    var responseData = apiResponseBody(request, result);
    if (responseData.status) {
        response.render(view_path + '/receipt', responseData);
    } else {
        response.render(view_path + '/error', responseData);
    }
}
function apiRequestBody(apiOperation, request) {
    var returnObj = {
        "apiOperation": apiOperation
    }
    switch (apiOperation) {
        case "AUTHORIZE":
        case "PAY":
        case "VERIFY":
            returnObj.order = {
                "amount": request.body.orderAmount,
                "currency": request.body.orderCurrency
            };
            returnObj.session = {
                "id": request.body.sessionId
            }
            break;

        case "CAPTURE":
        case "REFUND":
            returnObj.transaction = {
                "amount": request.body.orderAmount,
                "currency": request.body.orderCurrency
            };
            break;
        case "VOID":
            returnObj.transaction = {
                "targetTransactionId": request.body.targetTransactionId
            };
            break;
        case "RETRIVE":
            returnObj.transaction = {
                "targetOrderId": request.body.orderId
            };
            break;

        case "INITIATE_BROWSER_PAYMENT":
            returnObj.order = {
                "amount": request.body.orderAmount,
                "currency": request.body.orderCurrency
            };
            returnObj.sourceOfFunds = {
                "type": request.body.sourceType
            };

            returnObj.browserPayment = {
                "operation": request.body.browserPaymentOperation,

                "paypal": {
                   "paymentConfirmation": "CONFIRM_AT_PROVIDER"
                },

                "returnUrl": request.protocol + "://" + request.headers.host + "/process/browserPaymentReceipt/" + request.body.transactionId + "/" + request.body.orderId
            }
            break;

    }
    return returnObj;
}
function apiResponseBody(request, response) {
    var status = (response.resbody.error) ? false : true;
    if (!status) {
        return {
            "cause": response.resbody.error.cause,
            "explanation": response.resbody.error.explanation,
            "field": "apiOperation",
            "validationType": "INVALID",
            "status": false
        };
    } else {
        return {
            "title": "title",
            "apiOperation": request.body.apiOperation,
            "payload": JSON.stringify(response.payload),
            "resbody": JSON.stringify(response.resbody),
            "url": response.url,
            "method": response.mthd,
            "status": (response.resbody.error) ? false : true
        };
    }
}

/**
* This method calls the AUTHORIZE operation, which returns the response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for AUTHORIZE operation
*/
router.post('/authorize', function (request, response) {
    var requestData = apiRequestBody("AUTHORIZE", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.processAuthorize(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the PAY operation, which returns the  response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for PAY operation
*/
router.post('/pay', function (request, response) {
    var requestData = apiRequestBody("PAY", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.processPay(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the capture operation, which returns the  response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for capture operation
*/
router.post('/capture', function (request, response) {
    var requestData = apiRequestBody("CAPTURE", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.processCapture(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the REFUND operation, which returns the  response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for REFUND operation
*/
router.post('/refund', function (request, response) {
    var requestData = apiRequestBody("REFUND", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.processRefund(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the VOID operation, which returns the  response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for VOID operation
*/
router.post('/void', function (request, response) {
    var requestData = apiRequestBody("VOID", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.voidTransaction(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the VERIFY operation, which returns the  response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for VERIFY operation
*/
router.post('/verify', function (request, response) {
    var requestData = apiRequestBody("VERIFY", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.processVerify(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});
/**
* This method calls the RETRIVE operation, which returns the response body or error body.
*
* @param request contains info on how to construct API call
* @return  receipt page or error page with response body for RETRIVE operation
*/
router.post('/retrieve', function (request, response) {
    var requestData = apiRequestBody("RETRIEVE", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.retriveOrder(requestData, requestUrl, function (result) {
        handleResponse(result, request, response);
    });
});

/**
 * This method calls the INTIATE_BROWSER_PAYMENT operation, which returns a URL to the provider's website. The user is redirected to this URL, where the purchase is completed.
 *
 * @param request contains info on how to construct API call
 * @return either redirects to appropriate provider website or returns error page
 */
router.post('/browserPayment', function (request, response, next) {
    var requestData = apiRequestBody("INITIATE_BROWSER_PAYMENT", request);
    var apiRequest = request.body;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.browserPaymentResult(requestData, requestUrl, function (result) {
        var responseData = apiResponseBody(request, result);
        if (responseData.status) {
            var Url = result.resbody.browserPayment.redirectUrl;
            response.redirect(Url);
            next();
        } else {
            response.render(view_path + '/error', responseData);
        }

    });
});



/**
* This method handles the callback from the payment . It looks up the transaction based on the transaction ID and order ID and displays
* either a receipt page or an error page.
*
* @param transactionId used to retrieve transaction
* @param orderId used to construct API endpoint
* @return for  SecurePay receipt page or error page
*/
router.get('/browserPaymentReceipt/:transactionId/:orderId', function (request, response, next) {
    var apiRequest = request.params;
    var requestUrl = gatewayService.getRequestUrl("REST", apiRequest);
    gatewayService.browserPaymentReceiptResult(requestUrl, function (callback) {
        response.render(view_path + '/browserPaymentReceipt', { title: "browserPaymentReceipt", resbody: callback });
        next();
    });
});

 /**
 * This method calls the Tokenize operation, which returns the  response body or error body.
 *
 * @param request contains info on how to construct API call
 * @return  receipt page or error page with response body for PAY operation
 */
 router.post('/tokenize', function (request, response) {
     var requestData = apiRequestBody("PAY", request);
     var apiRequest = request.body;
     gatewayService.processTokenPay(requestData, apiRequest, function (result) {
         handleResponse(result, request, response);
     });
 });
module.exports = router;