var assert = require('assert');
const { Resolver } = require('dns');
const myResolver = new Resolver();

var failures = []

var checksCompleted = 0;

var lookups = [
  'newrelic.com',
  'docs.newrelic.com',
  'discuss.newrelic.com'
];

// Set the DNS server we are using to test these lookups.  Replace the IP address with the correct value.  You wouldn't use the loopback address as set here.
myResolver.setServers(['127.0.0.1'])

// This will be used to look up each address provided in lookups.  
function checkLookup(item)
{
  myResolver.resolve4(item, function(err, addresses) {
    if (err) {
      console.log("An error occurred while looking up "+item+" on "+": "+err)
      failures.push(item)
    }

    console.log("Resolver: "+item+"\nResult: "+addresses+"\n\n");
    checksCompleted++
  
    // Are we done checking all lookups?  If so, check for errors.
    if (checksCompleted == lookups.length)
    {
      assert.ok(failures.length == 0, "ERROR - " + failures.length + "/" + lookups.length + " DNS lookups failed. Failures: " + failures)
      console.log("All DNS checks were successful");
    }
    else
    {
      console.log("More checks to complete. Continuing...");
    }
  })
}

lookups.forEach(checkLookup);