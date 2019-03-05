var request = require('request');
var config = require('../scripts/config/config');
var utils = require('../scripts/util/commonUtils');
function update(options, callback) {
    request.put(options, function (error, response, body) {
        return callback({
            url: options.url,
            mthd: "PUT",
            payload: options.json,
            resbody: body
        });
    });
}
/**
* This method processes the API PAY request for server-to-server operations.
* @param {*} requestData - request body for PAY operation
* @param {*} url  - request url for PAY operation
* @param {*} callback - return response body
*/
function processPay(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Authorize Request for server-to-server operations.
* @param {*} requestData -request body for Authorize operation
* @param {*} url -request url for Authorize operation
* @param {*} callback -return response body
*/
function processAuthorize(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Verify Request for server-to-server operations.
* @param {*} requestData -request body for verify operation
* @param {*} url -request url for Verify operation
* @param {*} callback-return response body
*/
function processVerify(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };

    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Capture Request for server-to-server operations.
* @param {*} requestData -request body for Capture operation
* @param {*} url -request url for Capture operation
* @param {*} callback -return response body
*/
function processCapture(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Refund Request for server-to-server operations.
* @param {*} requestData -request body for Refund operation
* @param {*} url - request url for Refund operation
* @param {*} callback -return response body
*
*/
function processRefund(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Void Request for server-to-server operations.
* @param {*} requestData -request body for void operation
* @param {*} url -request url for Void operation
* @param {*} callback -return response body
*/
function voidTransaction(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    update(options, callback);
}
/**
* This method processes the API Retrive Request for server-to-server operations.
* @param {*} requestData -request body for Retrive operation
* @param {*} url -request url for Retrive operation
* @param {*} callback -return response body
*/
function retriveOrder(requestData, url, callback) {
    var options = {
        url: url,
    };
    utils.setAuthentication(config, options);
    request.get(options, function (error, response, body) {
        return callback({
            url: url,
            mthd: "GET",
            payload: requestData,
            resbody: body
        });
    });
}
/**
* This method processes the API getSession Request for server-to-server operations.
* @param {*} requestData -request body for getSession operation
* @param {*} callback -return callback body
*/
function getSession(requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session";
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    request.post(options, function (error, response, body) {
        return callback(body);
    });
}
/**
* This method processes the API paymentResult for server-to-server operations.
* @param {*} url -request url for paymentResult operation
* @param {*} callback -return callback body
*/
function paymentResult(url, callback) {
    var options = {
        url: url,
    };
    utils.setAuthentication(config, options);
    request.get(options, function (error, response, body) {
        return callback(error, body);
    });
}

/**
* This method processes the API request for browserPaymentResult operation
* @param {*} requestData -request body for browserPaymentResult operation
* @param {*} url -request url for paymentResult operation
* @param {*} callback -return response body
*/
function browserPaymentResult(requestData, url, callback) {
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    request.put(options, function (error, response, body) {
        return callback({
            resbody: body
        });
    });
}



/**
* This method handles the callback from the payment provider. It looks up the transaction based on the transaction ID and order ID and displays
* either a receipt page or an error page.
* @param {*} orderId - used to construct API endpoint
* @param {*} transactionId -used to retrieve transaction
* @param {*} callback -  SecurePay receipt page or error page
*/
function browserPaymentReceiptResult(url, callback) {
    var options = {
        url: url,
    };
    utils.setAuthentication(config, options);
    request.get(options, function (error, response, body) {
        if (error) {
            return callback({
                error: true,
                message: error
            });
        } else {
            return callback({
                error: false,
                message: JSON.parse(body)
            });
        }
    });
}


/**
* This method handles the response from the CHECK_3DS_ENROLLMENT operation. If the card is enrolled, the response includes the ejs for the issuer's authentication form, to be injected into 3dSecurePayerAuthenticationForm.ejs.
* Otherwise, it displays an error.
* @param {*} operation -needed to retrieve various data to complete API operation
* @param {*} sessionId -needed to store sessionID
* @param {*} callback -return callbackbody or error page
*/
function check3dsEnrollment(operation, sessionId, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session/" + sessionId;
    var options = {
        url: url,
    };
    utils.setAuthentication(config, options);
    request.get(options, function (error, response, body) {
        return callback(error, body);
    });
}
/**
* This method handles the response from the CHECK_3DS_ENROLLMENT operation. If the card is enrolled, the response includes the ejs for the issuer's authentication form, to be injected into 3dSecurePayerAuthenticationForm.ejs.
* Otherwise, it displays an error.
* @param {*} secureId -needed to store secureID
* @param {*} requestData -needed to retrieve various data to complete API operatio
* @param {*} callback -return callbackbody or error page
*/
function check3dsEnrollmentAccess(secureId, requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/3DSecureId/" + secureId;
    var options = {
        url: url,
        json: requestData,
    };
    utils.setAuthentication(config, options);
    request.put(options, function (error, response, body) {
        return callback(error, body);
    });
}
/**
* This method completes the 3DS process after the enrollment check. It calls PROCESS_ACS_RESULT, which returns either a successful or failed authentication response.
* If the response is successful, complete the operation (PAY, AUTHORIZE, etc) or shows an error page.
*
* @param {*} requestData -needed to retrieve 3DSecure ID and session ID to complete 3DS transaction
* @param {*} secureId -needed to store secureID
* @param {*} callback -displays api response page or error page
*/
function process3ds(requestData, secureId, callback) {
    var requestUrl = utils.getTestMerchantUrl(config) + "/3DSecureId/" + secureId
    var options = {
        url: requestUrl,
        method: "POST",
        json: requestData,
    }
    utils.setAuthentication(config, options);
    return request(options, function (error, response, body) {
        return callback(body);
    });
}
/**
*
* @param {*} requestData -request body for 3DSresult operation,which returns either a successful or failed authentication response.
* @param {*} orderId
* @param {*} transactionId -used to construct API result
* @param {*} callback -returns response or error page
*/
function process3dsResult(requestData, orderId, transactionId, callback) {
    var requestUrl = utils.getTestMerchantUrl(config) + "/order/" + orderId + "/transaction/" + transactionId;
    var options = {
        url: requestUrl,
        method: "PUT",
        json: requestData,
    }
    utils.setAuthentication(config, options);
    return request(options, function (error, response, body) {
        if (error) {
            return callback({
                error: true,
                message: error,
                url: requestUrl
            });
        } else {
            return callback({
                error: false,
                message: body,
                url: requestUrl
            });
        }
    });
}

function setSessionVariables(sessionid, secureid) {
    tempVariables = {
        sessionidVariable: sessionid,
        securityVariable: utils.getSecureId()
    }
}
function getSessionId() {
    return tempVariables.sessionidVariable;
}
function getSecureId() {
    return utils.getSecureId();
}

/**
*  This method handles the response masterpassSession operation, which returns either a successful or failed error response.
*
* @param {*} requestData
* @param {*} callback -returns response or error page
*/
function getMasterpassSession(requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session";
    var options = {
        url: url,
        json: requestData,
    }
    utils.setAuthentication(config, options);
    request.post(options, function (error, response, body) {
        if (error) {
            return callback({
                error: true,
                message: error
            });
        } else {
            return callback({
                error: false,
                message: body
            });
        }
    });
}
/**
* This method handles the response for updating the masterpass sessionID.which returns either a successful or failed error response.
* @param {*} sessionid -needed to store sessionID
* @param {*} requestData -request the body for updating the masterpasssession
* @param {*} callback -returns call back or error page
*/
function updateMasterpassSession(sessionid, requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session/" + sessionid;
    var options = {
        url: url,
        json: requestData,
    }
    utils.setAuthentication(config, options);
    request.put(options, function (error, response, body) {
        return callback(body);
    });
}
/**
* This method handles the request body for the wallet which returns either a successful or failed error response.
*
* @param {*} sessionid -needed to store sessionID
* @param {*} requestData -needed to request the data to complete API operation
* @param {*} callback -returns callback or error page
*/
function walletRequest(sessionid, requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session/" + sessionid;
    var options = {
        url: url,
        method: "POST",
        json: requestData,
    }
    utils.setAuthentication(config, options);
    request.post(options, function (error, response, body) {
        return callback(body);
    });
}
/**
* This method handles the response body for the masterpass which returns either a successful or failed error response.
*
* @param {*} sessionid -needed to store sessionID
* @param {*} requestData -request the data dor masterpass response
* @param {*} callback -returs callback or error page
*/
function masterpassResponse(sessionid, requestData, callback) {
    var url = utils.getTestMerchantUrl(config) + "/session/" + sessionid;
    var options = {
        url: url,
        method: "POST",
        json: requestData,
    }
    utils.setAuthentication(config, options);
    request.post(options, function (error, response, body) {
        return callback(body);
    });
}
/**
* This method handles the final response for body the masterpass which returns either a successful or failed error response.
*
* @param {*} orderId -needed to store orderId
* @param {*} transactionId -needed to store transactionId
* @param {*} requestbody -request the final responsebody of masterpass
* @param {*} callback -returns callback or error page
*/
function masterpassFinalResponse(orderId, transactionId, requestbody, callback) {
    var url = utils.getTestMerchantUrl(config) + "/order/" + orderId + "/transaction/" + transactionId;
    var options = {
        url: url,
        json: requestbody,
    }
    utils.setAuthentication(config, options);
    request.put(options, function (error, response, body) {
        return callback(body);
    });
}


/**
* Constructs the API payload request map based on properties of ApiRequest
*
* @param request contains info on what data the payload should include (order ID, amount, currency, etc) depending on the operation (PAY, AUTHORIZE, CAPTURE, etc)
* @return JSON string
*/
function buildMap(apiRequest) {
    var keyValueMap = {};
    keyValueMap["transaction.id"] = apiRequest.transactionId;
    keyValueMap["order.id"] = apiRequest.orderId;
    keyValueMap["merchant"] = config.TEST_GATEWAY.MERCHANTID;
    keyValueMap["sourceOfFunds.type"] = "CARD";
    keyValueMap["session.id"] = apiRequest.sessionId;
    keyValueMap["order.currency"] = apiRequest.orderCurrency;
    keyValueMap["apiOperation"] = "PAY";
    keyValueMap["order.amount"] = apiRequest.orderAmount;
    return keyValueMap;
}
function getRequestUrl(apiProtocol, request) {
    var base = utils.getBaseUrl(config);
    switch (apiProtocol) {
        case "REST":

            var url = getApiBaseURL(base, apiProtocol) + "/version/" + utils.getApiVersion(config) + "/merchant/" + utils.getMerchantId(config) + "/order/" + request.orderId;
            if (request.transactionId) {
                url += "/transaction/" + request.transactionId;
            }
            return url;
        case "NVP":
            return getApiBaseURL(base, apiProtocol) + "/version/" + utils.getApiVersion(config);
        default:
            throwUnsupportedProtocolException();
    }
    return null;
}
/**
* Returns the base URL for the API call (either REST or NVP)
*
* @param gatewayHost
* @param apiProtocol
* @return base url or throw exception
*/
function getApiBaseURL(gatewayHost, apiProtocol) {
    switch (apiProtocol) {
        case "REST":
            return gatewayHost + "/api/rest";
        case "NVP":
            return gatewayHost + "/api/nvp"
        default:
            throwUnsupportedProtocolException();
    }
    return null;
}
function throwUnsupportedProtocolException() {
    throw "Unsupported API protocol!";
}

function postData(data, url, callback) {
    var error = null;
    var body = null;

    var httpRequest = {
        url: url,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer(config.TEST_GATEWAY.USERNAME + ":" + config.TEST_GATEWAY.PASSWORD).toString("base64")
        }
    }

    var options = {
        headers: httpRequest.headers,
        url: url,
    }
    var form_data = "";
    for (var key in data) {
        form_data += "&" + key + "=" + data[key];
    }
    form_data += "&apiUsername=" + config.TEST_GATEWAY.USERNAME + "&apiPassword=" + config.TEST_GATEWAY.PASSWORD;
    options.body = form_data;
    utils.setAuthentication(config, options);
    request.post(options, function (error, response, body) {
        return callback(error, body);
    });
}
function processTokenPay(requestData, apiRequest, callback) {
    var requestUrl = utils.getTestMerchantUrl(config) + "/session/" + requestData.session.id;
    var options = {
        url: requestUrl,
        method: "PUT",
        json: { order: requestData.order },
    }
    utils.setAuthentication(config, options);
    request(options, function (error, response, body) {
        var tokenRequestData = { session: { id: requestData.session.id } };
        var tokenRequestUrl = utils.getTestMerchantUrl(config) + "/token";
        var tokenOptions = {
            url: tokenRequestUrl,
            method: "POST",
            json: tokenRequestData,
        }
        utils.setAuthentication(config, tokenOptions);
        request(tokenOptions, function (error, response, body) {
            var token = body.token;
            var tokenPayData = {
                apiOperation: "PAY",
                sourceOfFunds: {
                    token: token
                },
                session: {
                    id: requestData.session.id
                }
            }
            var tokenPayUrl = utils.getTestMerchantUrl(config) + "/order/" + apiRequest.orderId + "/transaction/" + apiRequest.transactionId;
            var tokenPayOptions = {
                url: tokenPayUrl,
                json: tokenPayData,
                method: "PUT"
            }
            utils.setAuthentication(config, tokenPayOptions);
            request(tokenPayOptions, function (error, response, body) {
                return callback({
                    url: tokenPayUrl,
                    mthd: "PUT",
                    payload: tokenPayData,
                    resbody: body
                });
            });


        });

    });
}
function constructGeneralErrorResponse(e) {
    mav = {};
    mav.viewName = "error";
    mav.message = JSON.stringify(e);
    return mav;
}
module.exports = {
    processAuthorize: processAuthorize,
    processPay: processPay,
    processVerify: processVerify,
    processCapture: processCapture,
    processRefund: processRefund,
    voidTransaction: voidTransaction,
    retriveOrder: retriveOrder,
    getSession: getSession,
    paymentResult: paymentResult,

    browserPaymentResult: browserPaymentResult,
    browserPaymentReceiptResult: browserPaymentReceiptResult,

    check3dsEnrollment: check3dsEnrollment,
    check3dsEnrollmentAccess: check3dsEnrollmentAccess,
    process3ds: process3ds,
    process3dsResult: process3dsResult,

    updateMasterpassSession: updateMasterpassSession,
    getMasterpassSession: getMasterpassSession,
    walletRequest: walletRequest,
    masterpassResponse: masterpassResponse,
    masterpassFinalResponse: masterpassFinalResponse,

    buildMap: buildMap,
    getRequestUrl: getRequestUrl,
    postData: postData,
    processTokenPay: processTokenPay,
    setSessionVariables: setSessionVariables,
    getSessionId: getSessionId,
    getSecureId: getSecureId
}