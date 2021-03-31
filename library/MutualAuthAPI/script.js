const assert = require('assert');

// The certificate and key can also be base64 encoded and stored in a Secure Credential.
// This would require decoding the certificate and key from the Secure Credential then including them in your request options.
const certString =
  '-----BEGIN CERTIFICATE-----\n' +
  'LineOneOfCertificate\n' +
  'LineTwoOfCertificate\n' +
  '-----END CERTIFICATE-----\n';

const keyString =
  '-----BEGIN PRIVATE KEY-----\n' +
  'LineOneOfPrivateKey\n' +
  'LineTwoOfPrivateKey\n' +
  '-----END PRIVATE KEY-----\n';

// This is used for the request body.
const payload = 'MyXmlOrJsonPayload';

const SuccessCriteria = 'Success';
const options = {
  // Define endpoint URL.
  url: 'https://www.newrelic.com',
  // Define body of POST request.
  body: payload,
  cert: certString,
  key: keyString,
  // Additional headers could be added if needed. Otherwise the headers section could be removed.
  headers: {
    MyTestHeader: 'abc123',
  },
};

// Define expected results using callback function.
function callback(error, response, body) {
  assert.ok(!error, `Request failed: ${error}`);
  // Log status code to Synthetics console.
  console.log(`${response.statusCode} status code`);
  // Verify endpoint returns 200 (OK) response code.
  assert.ok(
    response.statusCode == 200,
    `Expected 200 OK response. Please review the response: ${response.body}`
  );

  const XMLResponse = response.body;
  const status = XMLResponse.search(SuccessCriteria);
  assert.ok(
    status >= 0,
    `Unable to find ${SuccessCriteria}.  Please review the response: ${XMLResponse}`
  );

  console.log('End reached');
}
// Make POST request, passing in options and callback.
$http.post(options, callback);
