/**
 * When creating the script, setting it as an API test simplifies the results
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-api-tests
 *
 * When the script is added as synthetics check, it is recommend that it be set to check the custom URL
 * no more than once a day.
 *
 * The custom attributes added to the synthetics check will be found in the New Relic SyntheticCheck event
 * sample table.
 *
 * Example
 * SELECT * FROM SyntheticCheck WHERE monitorName = 'the-api-monitor-name'
 *
 * Results from NRQL query
 * ...
 *   "events": [
 *     {
 *       "custom.issuer": "Sectigo Limited",
 *       "custom.remainingDays": 225,
 *       "custom.url": "custom-url",
 *       "custom.validTo": "2021-10-13T23:59:59.000Z",
 *       "custom.failDaysBeforeExpiration": 30,
 *       "custom.serialNumber": "ABBDD363634353"
 * ...
 */

const assert = require('assert');
const request = require('request');

// EDIT: Put your custom URL here
const url = 'https://enter-url-here';
// EDIT: Days before your certification expires to fail the check and provide an alert
const failDaysBeforeExpiration = 30;

const currentDate = new Date();

$util.insights.set('url', url);
console.log(`Validating the certificate for ${url}`);

$util.insights.set('failDaysBeforeExpiration', failDaysBeforeExpiration);

request({
  url: url,
  method: 'HEAD',
  gzip: true,
  followRedirect: false,
  followAllRedirects: false,
}).on('response', (res) => {
  // For more details about a certificate, review the object properties
  // https://nodejs.org/api/tls.html#tls_certificate_object
  const cert = res.req.connection.getPeerCertificate();
  const validTo = new Date(cert.valid_to);

  $util.insights.set('serialNumber', cert.serialNumber);
  $util.insights.set('validTo', validTo);
  console.log(
    `This certificate ${cert.serialNumber} will expire on ${validTo}`
  );

  $util.insights.set('issuer', cert.issuer.O);
  console.log(`Certificate was issued by ${cert.issuer.O}`);

  const remainingDays = getRemainingDays(validTo, currentDate);
  console.log(`Days left until expiration ${remainingDays}`);
  $util.insights.set('remainingDays', remainingDays);

  // Subtract the failDaysBeforeExpiration from the certificate's expiration date
  validTo.setDate(validTo.getDate() - failDaysBeforeExpiration);

  if (validTo <= currentDate) {
    console.log("The certificate's date is not valid and should be updated.");
  } else {
    console.log("The certificate's date is valid.");
  }

  assert.ok(
    validTo > currentDate,
    `the certificate will expire in the next ${failDaysBeforeExpiration}days.`
  );
});

function getRemainingDays(expiration, current) {
  return Math.floor(
    (expiration.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
  );
}
