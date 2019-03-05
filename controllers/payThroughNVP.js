var express = require('express');
var gatewayService = require('../service/gatewayService');
var router = express.Router();
var apiService = require('../service/apiService');
var view_path = '../templates';
/**
* This method processes the API request using NVP (Name-Value Pair) protocol for Hosted Session (browser) operations (PAY, AUTHORIZE, VERIFY). Any time card details need to be collected, Hosted Session is the preferred method.
*
* @return ModelAndView for apiResponse page or error page
*/
router.post("/PayThroughNVP", function (request, response, next) {
    var apiRequest = request.body;
    try {
        var requestUrl = gatewayService.getRequestUrl("NVP", apiRequest);
        var dataMap = gatewayService.buildMap(apiRequest);
        gatewayService.postData(dataMap, requestUrl, function (error, body) {
            response.render(view_path + '/apiResponse', { title: "NVP Payment Receipt", apiOperation: "PAY", method: "POST", url: requestUrl, payload: JSON.stringify(dataMap), resbody: body });
        });
    } catch (e) {
        if (e.message == "") {
            mav = apiService.constructApiErrorResponse(e);
        } else {
            response.render(view_path + '/error.ejs', { validationType: null, field: null, error: "error", cause: "Unknown error", explanation: JSON.stringify(e) });
        }
    }
});
module.exports = router;