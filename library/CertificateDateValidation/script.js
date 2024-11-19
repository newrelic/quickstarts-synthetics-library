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
 *       "custom.daysRemaining": 103,
 *       "custom.threshold": 30
 * ...
 */

const sslChecker = require('ssl-checker');
const assert = require('assert');

// Change the port from the default 443 if needed
const sslCheckerOptions = {
  method: 'GET',
  port: 443
};

// Set your domain here
const domain = 'example.com';
const daysUntilExpiration = 30;
const sslTimer = $har.addResource(domain);

async function checkCert(domain, daysUntilExpiration) {
  try {
    sslTimer.startTimer();
    sslTimer.ssl().startTimer();
    const sslCheckerResult = await sslChecker(domain, sslCheckerOptions);
    $util.insights.set('daysRemaining', sslCheckerResult.daysRemaining);
    $util.insights.set('threshold', daysUntilExpiration);
    console.log('Days remaining: '+sslCheckerResult.daysRemaining+ ' Threshold: '+ daysUntilExpiration);
    assert.ok(sslCheckerResult.daysRemaining >= daysUntilExpiration,
      `The SSL Certificate has fewer than ${daysUntilExpiration} day(s) remaining before expiring`);
  } catch(err){
    throw new Error(err);
  } finally {
    sslTimer.ssl().endTimer();
    sslTimer.endTimer();
  }
}

await checkCert(domain, daysUntilExpiration);
