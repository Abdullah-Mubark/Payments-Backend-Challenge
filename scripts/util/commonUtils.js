var fs = require('fs');
var config = require('../config/config');
var session = require('express-session');
var pkiBaseUrl = config.PKI_GATEWAY.BASEURL + "/api/rest/version/" + config.PKI_GATEWAY.API_VERSION + "/merchant/" + config.PKI_GATEWAY.MERCHANTID;
var tstBaseUrl = config.TEST_GATEWAY.BASEURL + "/api/rest/version/" + config.TEST_GATEWAY.API_VERSION + "/merchant/" + config.TEST_GATEWAY.MERCHANTID;
function keyGen(keyLength) {
    var i, key = "", characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (i = 0; i < keyLength; i++) {
        key += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
    }
    return key;
}

function getCurrency(keyLength) {
    return config.CURRENCY;
}
function setAuthentication(config, options) {
    if (config.IS_CERT_AUTH_ENABLED === 'true') {
        options.agentOptions = {
            cert: fs.readFileSync(config.SSL_FILES.CRT),
            key: fs.readFileSync(config.SSL_FILES.KEY),
            passphrase: config.PKI_GATEWAY.MERCHANTID
        }
    } else {
        options.auth = {
            user: config.TEST_GATEWAY.USERNAME,
            pass: config.TEST_GATEWAY.PASSWORD,
            sendImmediately: false
        };
    }
}
function initWebhooksNotificationsFolder() {
    var folderName = config.WEBHOOKS.WEBHOOKS_NOTIFICATION_FOLDER;
    if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);

    } else {
        fs.readdir(folderName, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(folderName, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
}

function getBaseUrl(config) {
    return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.BASEURL : config.TEST_GATEWAY.BASEURL;
}
function getApiVersion(config) {
    return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.API_VERSION : config.TEST_GATEWAY.API_VERSION;
}
function getMerchantId(config) {
    return (config.IS_CERT_AUTH_ENABLED) ? config.PKI_GATEWAY.MERCHANTID : config.TEST_GATEWAY.MERCHANTID;
}

function getPkiMerchantUrl(config) {
    return getBaseUrl(config) + "/api/rest/version/" + config.PKI_GATEWAY.API_VERSION + "/merchant/" + config.PKI_GATEWAY.MERCHANTID;
}

function getTestMerchantUrl(config) {
    return getBaseUrl(config) + "/api/rest/version/" + config.TEST_GATEWAY.API_VERSION + "/merchant/" + config.TEST_GATEWAY.MERCHANTID;
}

function getSecureId() {

    if (typeof session.secureId == "undefined") {
        session.secureId = keyGen(10);
    }
    return session.secureId;
}

function get3DSData(amount, currency) {
    if (typeof amount != undefined && typeof currency != "undefined" && amount && currency) {
        session["3dsAmount"] = amount;
        session["3dsCurrency"] = currency;
    }

    return [session["3dsAmount"], session["3dsCurrency"]];
}

module.exports = {
    get3DSData: get3DSData,
    keyGen: keyGen,
    getCurrency: getCurrency,
    setAuthentication: setAuthentication,
    getBaseUrl: getBaseUrl,
    getApiVersion: getApiVersion,
    getMerchantId: getMerchantId,
    getTestMerchantUrl: getTestMerchantUrl,
    getPkiMerchantUrl: getPkiMerchantUrl,
    getSecureId: getSecureId,
    initWebhooksNotificationsFolder: initWebhooksNotificationsFolder
}