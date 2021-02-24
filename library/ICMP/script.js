var assert = require('assert');
var ping = require('net-ping');

var failures = [];

var session = ping.createSession({
  retries: 2,
  timeout: 1000
});

var checksCompleted = 0;

// Hosts are numbers in this example, but this could be replaced with a meaningful label for each host instead.
var checks = [
 { 'host': '1', 'ip': '151.101.2.217' },
 { 'host': '2', 'ip': '151.101.66.217' },
 { 'host': '3', 'ip': '151.101.194.217' },
]

function checkEndpoint(item) {
  session.pingHost(item.ip, function (error, target, sent, rcvd) {
    if (error) {
      failures.push(item.ip);
      console.log('ERROR - Ping failed for host ' + item.host + ' (IP ' + item.ip + ') with error: ' + error);
    }
    else {
      var timeRequired = rcvd - sent
      console.log('Ping successful for host ' + item.host + ' (IP ' + item.ip + '). Response (ms): ' + timeRequired)
    }

    checksCompleted++
    if (checksCompleted == checks.length) {
      session.close();
      if (failures.length !=0) {
        throw new Error("ERROR - " + failures.length + "/" + checks.length + " endpoints failed. Failures: " + failures);
      }
      else {
        console.log("All checks were successful.");
      }
    }
    else {
      console.log("More checks to complete. Continuing...");
    }
  })
}
// Check each endpoint
checks.forEach(checkEndpoint);