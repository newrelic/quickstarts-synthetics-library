/**
 * Feel free to explore, or check out the full documentation
 * https://docs.newrelic.com/docs/synthetics/new-relic-synthetics/scripting-monitors/writing-api-tests
 * for details.
 */

 var assert = require('assert');

 const account = $env.ACCOUNT_ID;
 const comparisonWindow = '1 week ago';
 //Note that by default this uses a SINCE of 1 hour ago. Add your own SINCE configuration if you'd like to use a different window.
 const query = 'SELECT count(*) FROM Transaction COMPARE WITH ' + comparisonWindow;
 const threshPercent = 50;
 
 $http.post('https://api.newrelic.com/graphql',
   // Post data
   {
     headers: {
       'Content-Type': 'application/json',
       // Replace this with a secure credential in your account holding a User API key.
       'API-Key': $secure.USER_API_KEY
     },
     json: {
       query: '{ \
                 actor { \
                   account(id: '+account+') { \
                     nrql(query: "'+query+'") { \
                       results \
                     } \
                   } \
                 } \
               }'
     }
   },
   // Callback
   function (err, response, body) {
     assert.ok(!err, "Connection error!")
     assert.equal(response.statusCode, 200, 'Expected a 200 OK response');
     const queryResults = body['data']['actor']['account']['nrql']['results']
     var current;
     var previous;
     for (var i=0; i < queryResults.length; i++)
     {
       if (queryResults[i]['comparison'] === 'current') 
       {
         // This will need adjusted if a function other than count is used
         current = queryResults[i]['count']
         console.log("Current: "+current);
       }
       if (queryResults[i]['comparison'] === 'previous') 
       {
         // This will need adjusted if a function other than count is used
         previous = queryResults[i]['count']
         console.log("Previous: "+previous);
       }
     }
     var decreasePercent;
     if (current >= previous) {
       decreasePercent = 0;
     }
     else
     {
       decreasePercent = ((previous - current) / previous) * 100;
     }
     console.log(decreasePercent);
     $util.insights.set("currentValue", current);
     $util.insights.set("previousValue", previous);
     $util.insights.set("decreasePercent", decreasePercent);
     assert.ok(decreasePercent < threshPercent, 'Error - decrease percentage of '+decreasePercent+' is greater than or equal to the threshold of '+threshPercent+'. Current: '+current+' Previous: '+previous)
   }
 );