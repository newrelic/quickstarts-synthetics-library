// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Default is '0', which means that it won't fail.
var ScriptTimeout = 0;

// Script-wide timeout for all wait functions (in ms)
var STEP_TIMEOUT = 20000;

/** HELPER VARIABLES AND FUNCTIONS **/
const got = require('got');
const fs = require('fs');
const { pipeline } = require('stream/promises');
const { promisify } = require('util');

var startTime = Date.now(),
  stepStartTime = Date.now(),
  prevMsg = '',
  prevStep = 0,
  lastStep = 9999;

//This function will log individual steps scripted to the console, as well as total time spent in that step. The duration is also sent to NRDB as an event to query.
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

//Function use to download a file based on direct url to file
async function downloadFile(url, fileName) {
   const downloadPath = '/tmp/' //Path to store the downloaded file
   const downloadStream = got.stream(url);
   const writeStream = fs.createWriteStream(downloadPath + fileName);

   downloadStream.on('downloadProgress', ({ transferred, total, percent}) => {
     const percentDownloaded = Math.round(percent * 100);
     console.log(`download progress: ${transferred}/${total} (${percentDownloaded}%)`);
   })

   try {
     await pipeline(downloadStream, writeStream); //Stream file to local path
     return 'complete';
   } catch(error) {
     console.log('Error downloading file');
     console.log(error);
     return 'error';
   }
}

//Optional function to read file size after download
async function readFile(filePath) {
  const fileStatAsync = promisify(fs.stat);

  const stats = await fileStatAsync(filePath) //Validate download by checking size of file locally
  let sizeBytes = stats.size;
  console.log(`File size: ${sizeBytes}`);
}

async function main() {
  var uri = 'https://download.newrelic.com/';
  var fileToDownload = '548C16BF.gpg';

  //Step 1
  log(1, 'Navigate to download.newrelic.com');
  await $webDriver.get(uri);

  //Step 2
  log(2, 'Download File');
  let res = await downloadFile(uri + fileToDownload, 'testFile');
  console.log('Download Result: ' + res);
  if (res == 'complete') {
    $util.insights.set('DownloadResult', 'success');
  } else {
    $util.insights.set('DownloadResult', 'failure');
  }

  //Last step
  log(lastStep, '');
  console.log('Script execution complete');
}

main();
