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
 *       "custom.remainingDays": 225,
 *       "custom.url": "custom-url",
 *       "custom.failDaysBeforeExpiration": 30
 *    }
 * ...
 */

const assert = require('assert')
const sslChecker = require('ssl-checker')

// EDIT: Put your custom Hostname here
const hostname = 'enter-hostname-here'
// EDIT: Days before your certification expires to fail the check and provide an alert
const failDaysBeforeExpiration = 30

$util.insights.set('url', url)
console.log('Validating the certificate for ' + url)

$util.insights.set('failDaysBeforeExpiration', failDaysBeforeExpiration)

sslChecker(hostname, { port: 443 }).then((res) => {
  $util.insights.set('remainingDays', res.daysRemaining)
  console.log('Remaining days ' + res.daysRemaining)
  assert.ok(res.daysRemaining > failDaysBeforeExpiration, "the certificate will expire in the next " + res.daysRemaining + "days.")
})
