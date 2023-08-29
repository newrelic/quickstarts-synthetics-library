const assert = require("assert")
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set thresholds and other variables
const config = {
    minFileSize:FILESIZEASINTEGER
};
/* 
Set the Bucket name & object returned - these are used when calling the main function getObjectDetails.  
In most cases using this synthetic to check a file that is uploaded daily, the filename will remain the same, or 
perhaps with a datestamp, or will be the latest one, and the script can be modified as such - if modifying to look
for the latest file, make sure there is a check to ensure it has also been uploaded within the last X hours or the
same day the synthetic executes on (in UTC)
*/
const bucketDetails = {
    Bucket: BUCKETNAME,
    File: FILENAME
   };

// Create S3 service object
const s3 = new AWS.S3(
  {
    apiVersion: '2006-03-01',
    region: 'eu-west-2',
    accessKeyId: $secure.AWSACCESSKEYID,
    secretAccessKey: $secure.AWSACCESSKEY
  }
);

//Gets all the objects in the specified bucket
async function getObjectDetails(bucketName, fileName) {
  const response = await s3.listObjects( { Bucket: bucketName } ).promise().catch(error => {
    assert.fail(`Unable to list the objects from the bucket "${bucketName}": ${error.message}`);
  });

  assert.ok(response.Contents.length > 0, 'No objects found in the bucket');
  const object = response.Contents.find(item => item.Key === fileName);
  assert.ok(object, `No object with key "${fileName}" found in the bucket`);
  return object; 
}

//Do the work and compare the sizes
const object = await getObjectDetails(bucketDetails.Bucket, bucketDetails.File);
console.log(object);
// Assertion
assert.ok(object.Size > config.minFileSize, 'Object size is less than config.minfilesize');