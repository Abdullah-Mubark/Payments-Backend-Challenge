## Gateway nodeJS Sample Code

This is a sample application to help developers start building nodejs applications using the Gateway Node SDK.

## Prerequisites
1. A barebones Node.js app using Express 4.
  versions:
  Node.js -v6.12.0
  NPM -5.6.0
2. Registered account with MPGS Gateway system

## Steps for running locally
1. Download code
2. npm install
3. Set the following ENV variables using:

 CURRENCY_LABEL=*INSERT_TYPE_OF_CURRENCY* TEST_GATEWAY_URL=* INSERT_YOUR_GATEWAY_URL_HERE* API_VERSION=*INSERT_YOUR_GATEWAY_API_VERSION* USERNAME=*INSERT_YOUR_GATEWAY_MERCHANT_ID_HERE* PASSWORD=*INSERT_YOUR_GATEWAY_API_PASSWORD_HERE* WEBHOOKS_NOTIFICATIONS_SECRET=*INSERT_YOUR_WEBHOOK_NOTIFICATION SECRET_HERE* npm start

NOTE:Make sure that your flag (IS_CERT_AUTH_ENABLED)should be "flase" while running TEST_GATEWAY

4. Navigate to *http://localhost:5000* to test locally


## Disclaimer
This software is intended for **TEST/REFERENCE** purposes **ONLY** and is not intended to be used in a production environment.


