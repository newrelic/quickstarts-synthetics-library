var tls = require('tls');

var client = tls.connect({
  port: 443,
  host: 'www.google.com'
}, () => {
  console.log('connected to server!');
  client.write('GET / HTTP/1.1\r\n');
  client.write('Host: www.google.com\r\n');
  client.write('User-Agent: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)\r\n');
  client.write('\r\n')
})

client.on('data', function(data){
  console.log('Received: ' +data);
  client.destroy();
})

client.on('end', function() {
  console.log('Connection closed');
})