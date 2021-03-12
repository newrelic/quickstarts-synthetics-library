var zlib = require('zlib');
var request = require('request');

var my_json = [
    {
        "eventType":"Purchase",
        "account":3,
        "amount":259.54
    },
    {
        "eventType":"Purchase",
        "account":5,
        "amount":12309,
        "product":"Item"
    }
]

zlib.gzip(JSON.stringify(my_json), null, function (err, compressed_json) {
    if (!err) {
        var json = undefined;
        var body = compressed_json;

        var headers = {
            'Content-Type': 'application/json',
            'X-Insert-Key': $secure.INSIGHTS_INSERT_KEY,
            'Content-Encoding': 'gzip'
        };

        var options = {
            url: 'https://insights-collector.newrelic.com/v1/accounts/' + $secure.ACCOUNT_ID + '/events',
            method: 'POST',
            headers: headers,
            body: body
        };

        function callback(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
            }
            else {
                console.log(body)
            }
        }

        request(options, callback);

    }
});
