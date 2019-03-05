## Authenticating to the Gateway using a certficate

1. Download the test certificate from the merchant admin portal. Make sure that Your merchant must be configured to use SSL certificate authentication.

2. If you have a test.crt file, Update the configuration with certificate location and update the path of CRT and KEY file in config page

CURRENCY_LABEL=*INSERT_TYPE_OF_CURRENCY* TEST_GATEWAY_URL= *INSERT_YOUR_TEST_GATEWAY_URL_HERE*BASEURL=* INSERT_YOUR_PKI_URL_HERE* API_VERSION=*INSERT_YOUR_GATEWAY_API_VERSION* USERNAME=*INSERT_YOUR_GATEWAY_MERCHANT_ID_HERE*SSL_CRT_PATH=*certificate/test.crt* SSL_KEY_PATH=*certificate/test.key* npm start

NOTE:Make sure that your flag (IS_CERT_AUTH_ENABLED)should be "true" while running PKI_GATEWAY

## API Key:
 You can grab the API Key from merchant portal and set the env variable GATEWAY_API_PASSWORD to that value.

 Navigate to *http://localhost:5000* to test locally