const Client = require('ssh2-sftp-client');
var fs = require ('fs');
var endpoint = 'YourSFTPServer';

// Create a simple test file.
fs.writeFileSync('test-sftp.txt', 'Hello World from New Relic Synthetics');
var testFile = fs.createReadStream('test-sftp.txt');
var remotePath = '/test-sftp.txt';

const config = {
host: endpoint,
username: 'MyUsername',
password: $secure.MY_PASSWORD,
   // You only need to define algorithms if your server is still using ssh-dss
algorithms: {
  serverHostKey: ['ssh-rsa', 'ssh-dss']
    }
}

const sftp = new Client('US');

// Connect to the SFTP server using the configuration defined above.
sftp.connect(config)

// Check if our test file exists before issuing put. Delete it and then proceed if so.
.then(function() {
    return sftp.exists(remotePath);
})

.then(function(bool) {
    if(bool) 
    {
        console.log('Test file from previous run exists. Removing.')
        return sftp.delete(remotePath);
    }
    else
    {
        console.log('No test files from previous executions. Proceeding.');
    }
})

.then(function () {
    console.log('Putting test file on SFTP server.');
    return sftp.put(testFile, remotePath);
})

.then(function () {
    console.log('Getting test file from SFTP server.');
    var destination = fs.createWriteStream('test-sftp-download.txt');
    return sftp.get(remotePath, destination)
})

.then(function () {
    var fileContents = fs.readFileSync('test-sftp-download.txt');
    console.log('Reading downloaded test file.');
    console.log(fileContents.toString())
})

.then(function() {
    console.log('Deleting test file from FTP server.');
    return sftp.delete(remotePath)
})

.then(function (){
    return sftp.end();
})

.catch(function(err) {
    throw err;
})