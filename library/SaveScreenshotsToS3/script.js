// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Default is '0', which means that it won't fail.
var ScriptTimeout = 60000;
// Script-wide timeout for all wait and waitAndFind functions (in ms)
var DefaultTimeout = 20000;

// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
//var UserAgent = "default";
var UserAgent = "default";

const fs = require('fs');
var req = require('request'),
  By = $driver.By,
  startTime = Date.now();

//Start a transaction
var startTrnx = function (thisStep) {
  startTime = Date.now();
  console.log(thisStep + ' Started.');
};

//End a transaction, log the time to Insights
var endTrnx = function (thisStep) {
  var lastStepTimeElapsed = Date.now() - startTime;
  console.log(thisStep + ' Finished: ' + lastStepTimeElapsed + 'ms.');
  $util.insights.set(thisStep, lastStepTimeElapsed);
};

var curDate = timestamp(); //UTC date for current execution of script (this is included in the folder name created within your bucket)
var jobId = $env.JOB_ID //Monitor execution ID generated during run

//This function will create a timestamp string that will be apart of the folder name within s3 bucket specified
function timestamp() {
  function pad(n) {return n<10 ? "0"+n : n};
  var d = new Date();
  var dash = "-"
  var colon = ":"

  return d.getFullYear()+dash+pad(d.getUTCMonth()+1)+dash+pad(d.getUTCDate())+dash+pad(d.getUTCHours())+colon+pad(d.getUTCMinutes())+colon+pad(d.getUTCSeconds())
}

var SaveScreenshot = function(stepName, stepError){
  //Set these to your s3 bucket/ desired monitorName within s3
  var bucketName = '<your bucket name>'
  var monName = "<monitor name>"

  var s3uri = 'https://' + bucketName + '.s3.amazonaws.com'
  var folderName = monName + "--" + curDate.toString() + "--" + jobId;

  $browser.takeScreenshot().then(function(){ // take screenshot of current page
    fs.readFile('/opt/shared/screenshot.png', function(err, data){ //read the screenshot file that is taken
      if (err) throw err;
      var options = { //request options to save the screenshot to s3
        method: 'PUT',
        uri: s3uri + "/" + folderName + "/" + stepName + ".png",
        body: data,
        headers: {
          'Content-Type': 'image/png',
          'x-amz-acl': 'public-read' //required if using Step Analyzer nerdpack - https://github.com/newrelic-experimental/nr1-step-analyzer
        },
        aws: { //include this object if non-public bucket, otherwise comment out
          key: $secure.AWS_KEY,
          secret: $secure.AWS_SECRET,
          bucket: bucketName
        }
      }
      req(options, function(err, res, body){ //save screenshot to s3
        if (err) {
          console.log(res.statusCode);
          console.log("Error: " + err);
          console.log(body);
          $util.insights.set('S3_PUT_ERRORCODE', res.statusCode);
        } else {
          console.log('****************************');
          console.log('Screenshot for step "' + stepName + '" saved to location: ' + res.request.uri.href);
          console.log('****************************');
          $util.insights.set('S3URL', res.request.uri.href);
          if (stepError !== null) {
            throw stepError;
          }
        }
      })
    })
  })
}

//Step 0
$browser.getCapabilities().then(() => {
  //set timeouts here if needed
})

//Step 1
.then(function(){
  startTrnx("1-GoogleHome") //Start timer for step
  $browser.get('http://www.google.com').then(() => {
    return $browser.waitForAndFindElement(By.xpath("//img[@alt='Google']"), 10000)
  }).then(() => {
    endTrnx("1-GoogleHome"); //End timer for step
    SaveScreenshot("1-GoogleHome", null); //Save final screenshot
  }, (err) => { //Set step to 'Failed' within NRDB if error, save final screenshot
    SaveScreenshot("1-GoogleHome", err);
    $util.insights.set('1-GoogleHome', 'Failed');
  })
})

//Step 2
.then(function(){
  startTrnx("2-GoogleSearch")
  $browser.findElement(By.xpath("//input[@title='Search']")).sendKeys('New Relic').then(() => { //input New Relic into Google search
    $browser.findElement(By.xpath("//input[@title='Search']")).sendKeys($driver.Key.ENTER).then(() => { // press Enter key to perform search
      $browser.waitForAndFindElement(By.xpath("//div[text() = 'New Relic']"), 10000).then(() => { //wait for New Relic text on search page
        endTrnx("2-GoogleSearch");
        SaveScreenshot("2-GoogleSearch", null);
      }, (err) => { //waitFor failure
        SaveScreenshot("2-GoogleSearch", err);
        $util.insights.set('2-GoogleSearch', 'Failed');
      })
    }, (err) => { //Enter key failure
      SaveScreenshot("2-GoogleSearch", err);
      $util.insights.set('2-GoogleSearch', 'Failed');
    })
  }, (err) => { //Input 'New Relic' failure
    SaveScreenshot("2-GoogleSearch", err);
    $util.insights.set('2-GoogleSearch', 'Failed');
  })
})
