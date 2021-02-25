// When using $util.insights.set in your monitor, the name/value pair will be stored as an attribute named custom.<name> on the SyntheticCheck event.
// In this example, we stored a value named benchmark.
// Make sure to use $util.insights.set to set the value that should be passed between executions, which is not included in this example.

// Set up the query to obtain the latest custom attribute value from the last successful monitor execution
// Replace benchmark with the name of your custom attribute.
var query = "SELECT latest(custom.benchmark) FROM SyntheticCheck WHERE monitorName = 'myMonitorName' AND custom.benchmark IS NOT NULL SINCE 1 week ago"
var encodedQuery = encodeURIComponent(query)
var insightsRetries = 0; // This variable keeps track of the number of retries used. Do not modify.
var insightsRetryThreshold = 2; // Three total attempts
var insightsRetrySleep = 5; // Time to sleep in seconds between event API attempts if retries are needed.
// Define a global variable to hold the previous value retained from our query
var prevValue;

// Additional scripted browser or scripted API logic would be here that would 
// If this is not a scripted API monitor, please import request using var $http = require('request');

// Define a function to query the previous value with automatic retries:
function getPreviousValue() {
    var eventApiBase = 'https://insights-api.newrelic.com/v1/accounts';
    // Make an HTTP GET call to execute our NRQL query
    $http.get(eventApiBase+'/'+$env.ACCOUNT_ID+'/query?nrql='+encodedQuery, 
    {
    // Request options
      headers: {
        'Accept': 'application/json',
        // Use Secure Credentials to store your query key to purge the key from your results and enable easy updates
        'X-Query-Key': $secure.YOUR_EVENT_API_QUERY_KEY
       }
    },
    // Callback function - called after we receive a response.
    function(error, response, body)
    {
      var eventAPICallFailed = false;
      if (error) 
      {
        eventAPICallFailed = true;
        console.log("Call to retrieve previous value from Insights failed with connection error. Error: "+ error);
      }
      if (response.statusCode != 200)
      {
        insightsCallFailed = true;
        console.log("Call to retrieve previous value from Insights failed with bad response code. Response code: "+response.statusCode);
      }
      // Parse data and move on to getting exchange info if the Insights call was successful.
      if (!insightsCallFailed) 
      {
        var insightsJsonResponse = JSON.parse(response.body);
        // This assumes your query used the latest function.  Other query types will need adjustments here.
        var result = insightsJsonResponse['results'][0]['latest'];
        if (result != null)
        {
          prevValue = result
          // Go ahead and add this as an attribute to this event. We will overwrite it later if needed.
          $util.insights.set('benchmark', prevBenchmark);
        }
        else
        {
          prevValue = '';
        }
        // Call the your next function to proceed with the rest of your script now that the value has been found.
        // Replace this with the necessary function for your flow or a return statement.
        myNextFunction();
      } 
      // If the Insights call failed, either wait and retry or fail the script if we have hit our max number of retries.
      else
        {
          // If we have not hit our retry threshold, wait and retry.
          if (insightsRetries < insightsRetryThreshold)
          {
            console.log("ERROR - Attempt " + (insightsRetries + 1) +"/" + (insightsRetryThreshold + 1)+" to retrieve benchmark data from New Relic Insights failed. Retrying...");
            // Increase the retry count
            insightsRetries++ 
            // Sleep the number of seconds defined in insightsRetrySleep
            var sleepStop = new Date().getTime(); // Current day (UTC)
            sleepStop = sleepStop + (insightsRetrySleep * 1000) // Adding the sleep time converted to milliseconds
            while(new Date().getTime() < sleepStop)
            {
              // Sleep here until the number of seconds in insightsRetrySleep have passed. Nothing really needs to happen in this while block.
            }
            // Calling getPreviousValue again to retry retrieving benchmark data from Insights.
            getPreviousValue()
          }
          else
            {
              throw new Error("New Relic Insights connection to retrieve previous data failed after "+(insightsRetryThreshold + 1)+" attempts.")
            }
        }
    }
    ) 
}