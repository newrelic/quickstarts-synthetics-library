// Script-wide timeout for all wait functions (in ms)
var elementWaitTimer = 10000;

// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
//var UserAgent = "default";
var UserAgent = "default";

const AWS = require('aws-sdk'),
  startTime = Date.now();

var curDate = timestamp(); //UTC date for current execution of script (this is included in the folder name created within your bucket)
var jobId = $env.JOB_ID

const url_to_monitor = 'https://www.tutorialrepublic.com/snippets/preview.php?topic=bootstrap&file=simple-login-form';
const user = 'user';
const pass = 'test';

function timestamp() {
  function pad(n) {return n<10 ? "0"+n : n};
  var d = new Date();
  var dash = "-"
  var colon = ":"

  return d.getFullYear()+dash+pad(d.getUTCMonth()+1)+dash+pad(d.getUTCDate())+dash+pad(d.getUTCHours())+colon+pad(d.getUTCMinutes())+colon+pad(d.getUTCSeconds())
}

var SaveScreenshot = async function(stepName, stepError){
  //Set these to your bucket/monitorName/region
  var bucketName = '<bucket name>';
  var monName = '<monitor name>';
  AWS.config.region = 'us-east-1';

  const awsCreds = { //include this if non-public bucket
    accessKeyId: $secure.AWS_KEY,
    secretAccessKey: $secure.AWS_SECRET
  };
  AWS.config.update(awsCreds);


  var folderName = monName + "--" + curDate.toString() + "--" + jobId;

  let s3 = new AWS.S3({apiVersion: '2006-03-01'});

  let screenshot = await $webDriver.takeScreenshot();
  let b64data = await Buffer.from(screenshot, 'base64');

  const params = {
    Bucket: bucketName,
    Key: folderName + "/" + stepName + ".png",
    ACL: "public-read", //required if using Step Analyzer nerdpack or if you want to publicly access the screenshots
    Body: b64data
  }

  s3.upload(params, function(err, data) {
    if (err) {
      console.log('Failed to upload screenshot.');
      console.log(err);
      $util.insights.set('S3_UPLOAD_ERROR', err);
      if (stepError !== null) {
        throw stepError;
      }
    }
    console.log('****************************');
    console.log('Screenshot for step "' + stepName + '" saved to location: ' + data.Location);
    console.log('****************************');
    $util.insights.set('S3URL', data.Location);
  });
}

async function stepOne() { //get homepage + validate element on page
  var loginHeaderXpath = "//h2[text()='Log in']";

  try {
    console.log('Hitting tutorial site: https://www.tutorialrepublic.com/');
    await $webDriver.get(url_to_monitor); //get url
    console.log("Switching to iFrame 'preview'");
    await $webDriver.wait($selenium.until.ableToSwitchToFrame($selenium.By.id('preview')), elementWaitTimer); //switch to iFrame where our validation element is nested within
    console.log('Attempting to validate: ' + loginHeaderXpath);
    await $webDriver.wait($selenium.until.elementLocated($selenium.By.xpath(loginHeaderXpath)), elementWaitTimer, 'Failed to locate element: ' + loginHeaderXpath)
    await $webDriver.findElement($selenium.By.xpath(loginHeaderXpath)); //find element on page
    await SaveScreenshot('1-GetHomePage', null);
  } catch (e) {
    console.log('Step 1 Failure');
    await SaveScreenshot('1-GetHomePage', e);
    $util.insights.set('Homepage Validation', 'FAILED');
    //throw e;
  }
}

async function stepTwo() { //fill in login details on form + click submit
  var userXpath = "//input[@placeholder='Username']";
  var passXpath = "//input[@placeholder='Password']";
  var loginXpath = "//button[text() = 'Log in']";

  try {
    console.log('Locating userName InputBox');
    let userNameElement = await $webDriver.findElement($selenium.By.xpath(userXpath));
    console.log('Inputting userName');
    await userNameElement.sendKeys(user);
    console.log('Locating password InputBox');
    let passwordElement = await $webDriver.findElement($selenium.By.xpath(passXpath));
    console.log('Inputting password');
    await passwordElement.sendKeys(pass);
    console.log('Locating Log In button');
    let loginBtn = await $webDriver.findElement($selenium.By.xpath(loginXpath));
    console.log('Clicking Log In button');
    await loginBtn.click();
    await SaveScreenshot('2-Login', null);
  } catch(e) {
    console.log('Step 2 Failure');
    await SaveScreenshot('2-Login', null);
    $util.insights.set('Login Process', 'FAILED');
  }

}

async function main() {
  await stepOne();
  await stepTwo();
  console.log('complete');
}

main();
