var express = require('express');
var gatewayService = require('../service/gatewayService');
var errorService = require('../service/errorService');
var router = express.Router();
var jsdom = require("jsdom");
var { JSDOM } = jsdom;
var utils = require('../scripts/util/commonUtils');
var view_path = '../templates';
/**
* This method handles the response from the CHECK_3DS_ENROLLMENT operation. If the card is enrolled, the response includes the ejs for the issuer's authentication form, to be injected into secureIdPayerAuthenticationForm.ejs.
* Otherwise, it displays an error.
*
* @param request needed to store 3DSecure ID and session ID in HttpSession
* @param apiRequest needed to retrieve various data to complete API operation
* @return response - displays issuer authentication form or error page
*/
router.post('/check3dsEnrollment', function (request, response, next) {
    var apiOperation = request.body.apiOperation;
    var sessionId = request.body.sessionId;
    var redirectUrl = request.body.secureIdResponseUrl;
    var orderId = request.body.orderId;
    var transactionId = request.body.transactionId;
    var orderAmount = request.body.orderAmount;
    var orderDescription = request.body.orderDescription;
    var orderCurrency = request.body.orderCurrency;
    var secureId = utils.getSecureId();
    request.session.sessionidVariable = sessionId;
    request.session.securityVariable = utils.getSecureId();
    utils.get3DSData(orderAmount, orderCurrency);
    gatewayService.setSessionVariables(sessionId, secureId);
    gatewayService.check3dsEnrollment(apiOperation, sessionId, function (error, result) {
        if (!error) {
            var requestData = {
                "apiOperation": apiOperation,
                "order": {
                    "amount": orderAmount,
                    "currency": orderCurrency
                },
                "session": {
                    "id": sessionId
                },
                "3DSecure": {
                    "authenticationRedirect": {
                        "responseUrl": redirectUrl,
                        "pageGenerationMode": "SIMPLE"
                    }
                }
            };
            gatewayService.check3dsEnrollmentAccess(secureId, requestData, function (err, body) {
                if (err) {
                    errorService.showErrorPage(err, response, null, null, null);
                    next();
                } if (body.error) {
                    errorService.showErrorPage(body, response, null, null, null);
                    next();
                } else {
                    var secure = body['3DSecure'];
                    var htmlcontent = secure.authenticationRedirect.simple.htmlBodyContent;
                    const dom = new JSDOM(htmlcontent);
                    var resdata = {
                        title: "browserPaymentReceipt",
                        resbody: htmlcontent,
                        pareq: dom.window.document.getElementsByName('PaReq')[0].value,
                        echoForm: dom.window.document.getElementsByName('echoForm')[0].action,
                        termUrl: dom.window.document.getElementsByName('TermUrl')[0].value,
                        md: dom.window.document.getElementsByName('MD')[0].value
                    };
                    response.render(view_path + '/secureIdPayerAuthenticationForm', resdata);
                    next();
                }
            });
            request.session.save();
        } else {
            errorService.showErrorPage(result, response, null, null, null);
        }
    });
});
/**
* This method completes the 3DS process after the enrollment check. It calls PROCESS_ACS_RESULT, which returns either a successful or failed authentication response.m
* If the response is successful, complete the operation (PAY, AUTHORIZE, etc) or shows an error page.
*
* @param request needed to retrieve 3DSecure ID and session ID to complete 3DS transaction
* @return return - displays api response page or error page
*/
router.post('/process3ds', function (request, response, next) {
    var DDDsData = utils.get3DSData();
    var orderAmount = DDDsData[0];
    var orderCurrency = DDDsData[1];
    var ssid = request.session.sessionidVariable;
    var scid = utils.getSecureId();
    if (!ssid) {
        ssid = gatewayService.getSessionId();
    }
    if (!scid) {
        scid = utils.getSecureId();
    }
    var apiOperation = 'PROCESS_ACS_RESULT';
    var pares = request.body.PaRes;
    var requestData = {
        "apiOperation": "PROCESS_ACS_RESULT",
        "3DSecure": {
            "paRes": pares
        }
    }
    gatewayService.process3ds(requestData, scid, function (result) {
        if (!result.error) {
            var payload = {
                "apiOperation": "PAY",
                "3DSecureId": utils.getSecureId(),
                "order": {
                    "amount": orderAmount,
                    "currency": orderCurrency
                },
                "session": {
                    "id": ssid
                }
            }
            var transactionId = utils.keyGen(10);
            var orderId = utils.keyGen(10);
            gatewayService.process3dsResult(payload, orderId, transactionId, function (finalresult) {
                var data = JSON.stringify(finalresult.message);
                if (data.error) {
                    errorService.showErrorPage(data, response, "apiOperation", "INVALID", false);
                } else {
                    var url = finalresult.url;
                    var reqPayload = JSON.stringify(payload);
                    var responseData = {
                        title: "browserPaymentReceipt",
                        apiOperation: "PAY",
                        method: "PUT",
                        url: url,
                        payload: reqPayload,
                        resbody: data
                    };
                    response.render(view_path + '/apiResponse', responseData);
                }
                next();
            });
        } else {
            errorService.showErrorPage(result, response, null, null, null);
        }
    });
});
module.exports = router;


