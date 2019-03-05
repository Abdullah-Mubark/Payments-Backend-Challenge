var request = require('request');
var config = require('../scripts/config/config');
var utils = require('../scripts/util/commonUtils');
var fileService = require("fs");
function listWebhookNotification() {
    var notificationsFolder = config.WEBHOOKS.WEBHOOKS_NOTIFICATION_FOLDER;
    var notifications = [];
    var files = fileService.readdirSync(notificationsFolder);
    if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var contents = fileService.readFileSync(config.WEBHOOKS_NOTIFICATION_FOLDER + "/" + file);
            var notification = JSON.parse(contents);
            notifications.push(notification);
        }
    }
    else {
        console.log("No webhook notifications files found!");
    }
    return notifications;
}
function processWebhook(request, response) {
    var notificationSecret = request.headers["X-Notification-Secret"];
    if (config.WEBHOOKSNOTIFICATIONSECRET != null && notificationSecret != null && config.WEBHOOKSNOTIFICATIONSECRET != notificationSecret) {
        console.log("Web hooks notification secret doesn't match, so not processing the incoming request!");
        return;
    }
    var payloadJSON = request.body;
    var order = payloadJSON.order;
    var transaction = payloadJSON.transaction;
    writeWebhookNotification(order.id, transaction.id, order.status, order.amount);
}
function writeWebhookNotification(orderId, transactionId, orderStatus, orderAmount) {
    try {
        console.log("Webhook Notification - orderId = " + orderId + ", transactionId = " + transactionId + ", orderStatus = " + orderStatus + ", Amount = " + orderAmount);
        var timeInMillis = new Date().getTime();
        var notification = {
            timestamp: timeInMillis,
            orderId: orderId,
            transactionId: transactionId,
            orderStatus: orderStatus,
            orderAmount: orderAmount
        };
        var data = JSON.stringify(notification);
        var stream = fileService.createWriteStream(config.WEBHOOKS_NOTIFICATION_FOLDER + "/WebHookNotifications_" + timeInMillis + ".json");
        stream.once('open', function (fd) {
            stream.write(data);
            stream.end();
        });
    } catch (e) {
        console.log(e, "Unable to write notification to file ");
    }
}
module.exports = {
    listWebhookNotification: listWebhookNotification,
    processWebhook: processWebhook,
    writeWebhookNotification: writeWebhookNotification
}




