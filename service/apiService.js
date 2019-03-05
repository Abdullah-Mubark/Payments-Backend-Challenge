var request = require('request');
var config = require('../scripts/config/config');
require('request-debug')(request);
var auth = {
    user: config.TEST_GATEWAY.USERNAME,
    pass: config.TEST_GATEWAY.PASSWORD,
    sendImmediately: false
};
function buildMap(apiRequest) {
    var keyValueMap = {};
    keyValueMap["transaction.id"] = apiRequest.transactionId;
    keyValueMap["order.id"] = apiRequest.orderId;
    keyValueMap["merchant"] = config.merchantId;
    keyValueMap["sourceOfFunds.type"] = "CARD";
    keyValueMap["session.id"] = apiRequest.sessionId;
    keyValueMap["order.currency"] = apiRequest.orderCurrency;
    keyValueMap["apiOperation"] = "PAY";
    keyValueMap["order.amount"] = apiRequest.orderAmount;
    return keyValueMap;
}
function getRequestUrl(apiProtocol, config, request) {
    switch (apiProtocol) {
        case "REST":
            var url = getApiBaseURL(config.gatewayHost, apiProtocol) + "/version/" + config.apiVersion + "/merchant/" + config.merchantId + "/order/" + request.orderId;
            if (request.transactionId) {
                url += "/transaction/" + request.transactionId;
            }
            return url;
        case "NVP":
            return getApiBaseURL(config.gatewayHost, apiProtocol) + "/version/" + config.apiVersion;
        default:
            throwUnsupportedProtocolException();
    }
    return null;
}
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
/**
 *
 * @param {*} requestData
 * @param {*} callback
 */
function getSession(requestData, callback) {
    var url = config.TEST_GATEWAY.URI + "/merchant/" + config.TEST_GATEWAY.MERCHANT + "/session";
    var options = {
        url: url,
        method: "POST",
        json: requestData,
        auth: auth
    }
    return request(options, function (error, response, body) {
        return callback(body);
    });
}
module.exports = {
    buildMap: buildMap,
    getRequestUrl: getRequestUrl,
    getApiBaseURL: getApiBaseURL,
    getSession: getSession
}