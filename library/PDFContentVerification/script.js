// Script Name: PDF Parse Example

  
/** CONFIGURATIONS **/
// Failure if the entire script does not complete in this amount of time.  Note: all monitors will fail if they execute for longer than 3 minutes.
var ScriptTimeout = 180000;
// Script-wide timeout for all wait and waitAndFind functions (in ms)
var DefaultTimeout = 30000;
// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
var UserAgent = "default";

var fs = require('fs');
var pdf = require('pdf-parse');
var request = require('request');

const myRegex = /Telemetry Data Platform/gi

/** HELPER VARIABLES AND FUNCTIONS **/
var assert = require('assert'),
  By = $driver.By,
  browser = $browser.manage(),
  startTime = Date.now(),
  stepStartTime = Date.now(),
  prevMsg = '',
  prevStep = 0,
  lastStep = 9999;

var log = function(thisStep, thisMsg) {
  if (thisStep > 1 || thisStep == lastStep) {
    var totalTimeElapsed = Date.now() - startTime;
    var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;
    console.log('Step ' + prevStep + ': ' + prevMsg + ' FINISHED. It took ' + prevStepTimeElapsed + 'ms to complete.');
    $util.insights.set('Step ' + prevStep + ': ' + prevMsg, prevStepTimeElapsed);
    if (ScriptTimeout > 0 && totalTimeElapsed > ScriptTimeout) {
      throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + ScriptTimeout + 'ms.');
    }
  }
if (thisStep > 0 && thisStep != lastStep) {
   stepStartTime = Date.now() - startTime;
   console.log('Step ' + thisStep + ': ' + thisMsg + ' STARTED at ' + stepStartTime + 'ms.');
   prevMsg = thisMsg;
   prevStep = thisStep;
  }
};

/** BEGINNING OF SCRIPT **/
console.log('Starting synthetics script: {scriptName}');
console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');

// Setting User Agent is not then-able, so we do this first (if defined and not default)
if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
  $browser.addHeader('User-Agent', UserAgent);
  console.log('Setting User-Agent to ' + UserAgent);
}

// Get browser capabilities and do nothing with it, so that we start with a then-able command

$browser.getCapabilities().then(function () { })
     .then(() => {
    // STEP 1: Navigate to the documentation page.
    log(1, 'Navigate to https://newrelic.com/resources/datasheets/new-relic-one')
    return $browser.get('https://newrelic.com/resources/datasheets/new-relic-one')
  })
  .then(() => {
    // STEP 2: Locate the PDF link
    log(2, 'Locate the PDF link')
    return $browser.waitForAndFindElement(
      $driver.By.linkText('Download PDF'),
      DefaultTimeout
    )
  })
  .then((element) => {
    // STEP 2.1: Grab the HREF attribute off the link
    log(2.1, 'Locate the PDF link')
    return element.getAttribute('href')
  })
  .then((href) => {
    // STEP 3: Simulate clicking on the link and downloading the PDF by using
    // the Node "request" module to access the PDF link from the HREF.
    log(3, '"Click on" and download the PDF')
    return new Promise((resolve, reject) => {
      const writable = fs.createWriteStream('/tmp/doc.pdf')
      writable.on('finish', () => resolve())
      writable.on('error', (err) => reject(err))
      request(href).pipe(writable)
    })
  })
  .then(() => {
    // STEP 4: Parse the PDF using pdf-parse
    log(4, 'Parse the PDF!')
    return pdf(fs.readFileSync('/tmp/doc.pdf'), { version: 'v2.0.550' })
  })
  .then((data) => {
    // STEP 4.1: User the Node "assert" module to validate that the
    // pdf-parse module was able to parse the text and that our regex matches
    // the text data.
    log(4.1, 'Validate the contents!')
    assert.ok(data.text, "ERROR - Unable to parse PDF")
    assert.ok(myRegex.test(data.text), "ERROR - Unable to find "+myRegex+" in the PDF")
  })
.then(function() {
  log(lastStep, '');
  console.log('Browser script execution SUCCEEDED.');
}, function(err) {
  console.log ('Browser script execution FAILED.');
  throw(err);
});