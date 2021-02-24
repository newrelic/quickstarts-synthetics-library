var ftp = require('basic-ftp');

example()

function example() {
const client = new ftp.Client()
client.ftp.verbose = true
client.access({
host: "MyFTPServer",
user: "FTPUser",
password: $secure.FTP_PASSWORD
 }).then(function() {
return client.list();
 }) 
 .then(function(list) {
console.log(list)
 })
 .then(function() {
client.close()
 })
}